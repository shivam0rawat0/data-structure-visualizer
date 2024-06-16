var graph = null;
var prev = null;
var parent = null;

var isMapOn = false;
var isConnectOn = false;
var isPathOn = false;
var isPoint = false;
var animation = true;

var point_count = 0;
var imgMap = {
    "0": "img/custom.png",
    "1": "img/gta-vice-city.png",
    "2": "img/counter-strike-2-dust2.png"
}

var state = 0;
var source = null, destination;
var pathStart = null, pathEnd = null;

function toggleAnimation(btn) {
    if (animation) {
        btn.innerHTML = "Animation OFF";
        btn.style.backgroundColor = "blue";
        animation = false;
    } else {
        btn.innerHTML = "Animation ON";
        btn.style.backgroundColor = "green";
        animation = true;
    }
}

function toggleMapping(btn) {
    if (isMapOn) {
        btn.innerHTML = "Add node";
        isMapOn = false;
    } else {
        btn.innerHTML = "Stop";
        isMapOn = true;
    }
}

function toggleConnect(btn) {
    if (isConnectOn) {
        clearCanvas();
        btn.innerHTML = "Add edge";
        isConnectOn = false;
    } else {
        btn.innerHTML = "Stop";
        isConnectOn = true;
    }
}

function loadMap() {
    var opt = document.getElementById("map-input").value;
    if (opt > -1) {
        document.getElementById("map-bg").src = imgMap[opt];
        graph = new Graph();
        graph.edges = edges[opt];
        graph.nodes = nodes[opt];
        if (frame.childNodes.length > 0)
            clearApp();
        for (var x in graph.nodes) {
            var cx = x.split(",");
            frame.appendChild(_x("div", {
                "id": graph.nodes[x],
                "class": "point pt-cr-sm",
                "onclick": "setPoint(this)",
                "onmouseover": "setSize(this,true)",
                "onmouseout": "setSize(this,false)",
                "style": "top:" + Number(cx[0]) + "px;left:" + Number(cx[1]) + "px;"
            }))
        }
    }
}

function captureMouse(e) {
    if (isMapOn) {
        if (!isPoint) {
            ++point_count;
            frame.appendChild(_x("div", {
                "id": "p" + point_count,
                "class": "point pt-cr-sm",
                "onclick": "setPoint(this)",
                "onmouseover": "setSize(this,true)",
                "onmouseout": "setSize(this,false)",
                "style": "top:" + (e.clientY - 95 + Math.round(pageYOffset)) + "px;left:"
                    + (e.clientX - 5) + "px;"
            }));
            graph.addNode(
                [e.clientY - 95 + Math.round(pageYOffset), e.clientX - 5],
                "p" + point_count
            );
        } else {
            isPoint = false;
        }
    }
}

function setSize(point, expand) {
    if (isPathOn) {
        if (expand) {
            point.setAttribute("class", "point pt-cr-md");
        }
        else {
            point.setAttribute("class", "point pt-cr-sm");
        }
    }
}

function setPoint(point) {
    isPoint = true;
    if (isConnectOn) {
        if (prev == null) {
            prev = point;
            prev.style.backgroundColor = "rgb(126, 235, 79)";
        } else {
            var a = [prev.style.top.replace("px", ""), prev.style.left.replace("px", "")];
            var b = [point.style.top.replace("px", ""), point.style.left.replace("px", "")];
            graph.addEdge(a, b);
            graph.addEdge(b, a);
            drawLine(Number(a[1]) + 5, Number(a[0]) + 5, Number(b[1]) + 5, Number(b[0]) + 5, "blue", 2);
            prev.style.backgroundColor = "transparent";
            prev = null;
        }
    }
    if (isPathOn) {
        if (source == null) {
            source = point;
            source.style.backgroundColor = "green";
            findPath(document.getElementById("find-btn"));
        } else {
            destination = point;
            destination.style.backgroundColor = "red";
            isPathOn = false;
            findPath(document.getElementById("find-btn"));
        }
    }
}

class Graph {
    constructor() {
        this.nodes = {};
        this.edges = {};
        this.visited = null;
    }

    addNode(s, element) {
        this.nodes[s] = element;
    }

    addEdge(s, d) {
        if (!this.edges[s]) {
            this.edges[s] = {};
        }
        if (!this.edges[s][d]) {
            var A = [Number(s[0]), Number(d[0])];
            var B = [Number(s[1]), Number(d[1])];
            var X = Math.pow(Math.abs(A[0] - B[0]), 2);
            var Y = Math.pow(Math.abs(A[1] - B[1]), 2);
            var len = Number(Math.pow(X + Y, 0.5).toFixed());
            this.edges[s][d] = len;
        }
    }

    dfs(j, k) {
        this.visited = {};
        j = j[0] + "," + j[1];
        k = k[0] + "," + k[1];
        this.dfs_r(j, k);
    }

    dfs_r(j, k) {
        if (this.visited[j] == undefined) {
            if (j == k) return true;
            this.visited[j] = 1;
            startProcess([pointRender, [j, "#FFFF00"]]);
            for (var x in this.edges[j]) {
                startProcess([lineRender, [x, j, "red"]]);
                if (this.dfs_r(x, k)) return true;
            }
            for(var x in this.edges[j])
                startProcess([lineClear,[x,j]]);
            startProcess([pointRender, [j, "transparent"]]);
        }
    }

    dijkstra(j, k) {
        this.parent = {};
        this.visited = {};
        j = j[0] + "," + j[1];
        k = k[0] + "," + k[1];
        var dist = {j : 0};
        var heap = new minHeap();
        heap.insert([j, 0]);
        while (!heap.empty()) {
            var block = heap.remove();
            var curr = block[0];
            if(animation) startProcess([pointRender, [curr, "#FFFF00"]]);
            var currWgt = block[1];
            if (this.visited[curr] == undefined) {
                this.visited[curr] = 1;
                var edgeList = this.edges[curr];
                for (var edge in edgeList) {
                    var dest = edge;
                    var Wgt = edgeList[edge];
                    if (dist[dest] != undefined) {
                        var oldWgt = dist[dest];
                        if (oldWgt > (currWgt + Wgt)) {
                            dist[dest] = currWgt + Wgt;
                            heap.insert([dest, currWgt + Wgt]);
                            this.parent[dest] = curr;
                            if(animation) startProcess([lineRender, [dest, curr, "red"]]);
                        }
                    } else {
                        dist[dest] = Wgt + currWgt;
                        heap.insert([dest, Wgt + currWgt]);
                        this.parent[dest] = curr;
                        if(animation) startProcess([lineRender, [dest, curr, "red"]]);
                    }
                }
            }
        }
        startProcess([findPath, document.getElementById("find-btn")]);
    }
}

function clearMap() {
    for (var x in graph.nodes)
        pointRender([x, "transparent"]);
}

function pointRender(p) {
    document.getElementById(graph.nodes[p[0]]).style.backgroundColor = p[1];
}

function lineRender(pts) {
    var a = pts[0].split(",");
    var b = pts[1].split(",");
    drawLine(Number(a[1]) + 5, Number(a[0]) + 5, Number(b[1]) + 5, Number(b[0]) + 5, pts[2], 3);
}

function lineClear(pts){
    var a = pts[0].split(",");
    var b = pts[1].split(",");
    ctx.clearRect(Number(a[1]) + 5, Number(a[0]) + 5, Number(b[1]) + 5, Number(b[0]) + 5);
}

function findPath(btn) {
    switch (state) {
        case 0:
            clearMap();
            clearCanvas();
            btn.onclick = "";
            btn.innerHTML = "Select A";
            isPathOn = true;
            ++state;
            break;
        case 1:
            btn.innerHTML = "Select B";
            ++state;
            break;
        case 2:
            var s = source;
            var d = destination;
            graph.dijkstra(
                [s.style.top.replace("px", ""), s.style.left.replace("px", "")],
                [d.style.top.replace("px", ""), d.style.left.replace("px", "")]
            );
            btn.innerHTML = "Reset";
            btn.onclick = () => { findPath(document.getElementById("find-btn")); };
            ++state;
            break;
        case 3:
            source.setAttribute("class", "point pt-cr-sm");
            destination.setAttribute("class", "point pt-cr-sm");
            btn.innerHTML = "Find path";
            state = 0;
            pathStart = source.style.top.replace("px", "") + ","
                + source.style.left.replace("px", "");
            pathEnd = destination.style.top.replace("px", "") + ","
                + destination.style.left.replace("px", "");
            source = null;
            destination = null;
            resetProcess();
            clearCanvas();
            clearMap();
            showShortestPath();
        default:
            break;
    }
}

function showShortestPath() {
    if (graph.parent != null) {
        while (graph.parent[pathEnd] != undefined){
            startProcess([pointRender, [pathEnd, "red"]]);
            if(pathEnd == pathStart) break;
            var newPath = pathEnd;
            pathEnd = graph.parent[pathEnd];
            startProcess([lineRender, [newPath, pathEnd, "yellow"]]);
        }
    }
}
