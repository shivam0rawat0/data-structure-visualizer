var graph = null;
var prev = null;

var isMapOn = false;
var isConnectOn = false;
var isPathOn = false;
var isPoint = false;

var point_count = 0;
var imgMap = {
    "0":"img/gta-vice-city.png",
    "1":"img/custom.png"
}
var state = 0;
var source = null,destination;

function toggleMapping(btn){
    if(isMapOn){
        btn.innerHTML = "Add node";
        isMapOn = false;
    } else {
        btn.innerHTML = "Stop";
        isMapOn = true;
    }
}

function toggleConnect(btn){
    if(isConnectOn){
        clearCanvas();
        btn.innerHTML = "Add edge";
        isConnectOn = false;
    } else {
        btn.innerHTML = "Stop";
        isConnectOn = true;
    }
}

function loadMap(){
    var opt = document.getElementById("map-input").value;
    if(opt>-1){
        document.getElementById("map-bg").src = imgMap[opt];
        graph = new Graph();
        graph.edges = edges[opt];
        graph.nodes = nodes[opt];
        if(frame.childNodes.length>0)
            clearFrame();
        for(var x in graph.nodes){
            var cx = x.split(",");
            frame.appendChild(_x("div",{
                "id":graph.nodes[x],
                "class":"point pt-cr-sm",
                "onclick":"setPoint(this)",
                "onmouseover":"setSize(this,true)", 
                "onmouseout":"setSize(this,false)",
                "style":"top:"+Number(cx[0])+"px;left:"+Number(cx[1])+"px;"
            }))
        }
    }
}

function captureMouse(e){
    if(isMapOn){
        if(!isPoint){
            ++point_count;
            frame.appendChild(_x("div",{
                "id":"p"+point_count,
                "class":"point pt-cr-sm",
                "onclick":"setPoint(this)",
                "onmouseover":"setSize(this,true)", 
                "onmouseout":"setSize(this,false)",
                "style":"top:"+(e.clientY - 95 + Math.round(pageYOffset))+"px;left:"
                +(e.clientX - 5)+"px;"
            }));
            graph.addNode(
                [e.clientY - 95 + Math.round(pageYOffset),e.clientX - 5],
                "p"+point_count
            );
        } else {
            isPoint = false;
        }
    }
}

function setSize(point, expand){
    if(isPathOn){
        if(expand) {
            point.setAttribute("class","point pt-cr-md");
        }
        else {
            point.setAttribute("class","point pt-cr-sm");
        }
    }
}

function setPoint(point){
    isPoint = true;
    if(isConnectOn){
        if(prev == null){
            prev = point;
            prev.style.backgroundColor = "rgb(126, 235, 79)";
        } else {
            var a = [prev.style.top.replace("px",""),prev.style.left.replace("px","")];
            var b = [point.style.top.replace("px",""),point.style.left.replace("px","")];
            graph.addEdge(a,b);
            graph.addEdge(b,a);
            drawLine(Number(a[1]) + 5,Number(a[0])+ 5,Number(b[1])+ 5,Number(b[0])+ 5,"blue",2);
            prev.style.backgroundColor = "transparent";
            prev = null;
        }
    }
    if(isPathOn){
        if(source == null){
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

class Graph{
    constructor(){
        this.nodes = {};
        this.edges = {};
        this.visited = null;
    }

    addNode(s,element){
        this.nodes[s] = element;
    }

    addEdge(s,d){
        if(!this.edges[s]){
            this.edges[s] = {};
        }
        if(!this.edges[s][d]){
            this.edges[s][d] = 1;
        }
    }

    dfs(j,k){
        this.visited = {};
        j = j[0]+","+j[1];
        k = k[0]+","+k[1];
        this.dfs_r(j,k);
    }

    dfs_r(j,k){
        if(this.visited[j] == undefined){
            if(j == k) return true;
            this.visited[j] = 1;
            startProcess([pointRender,[j,"#FFFF00"]]);
            for(var x in this.edges[j]){
                startProcess([lineRender,[x,j,"red"]]);
                if(this.dfs_r(x,k)) return true;
            }
            startProcess([pointRender,[j,"transparent"]]);
        }
    }
}

function pointRender(p){
    document.getElementById(graph.nodes[p[0]]).style.backgroundColor = p[1];
}

function lineRender(pts){
    var a = pts[0].split(",");
    var b = pts[1].split(",");
    drawLine(Number(a[1]) + 5,Number(a[0])+ 5,Number(b[1])+ 5,Number(b[0])+ 5,pts[2],2);
}

function findPath(btn){
    switch(state){
        case 0:
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
            graph.dfs(
                [s.style.top.replace("px",""),s.style.left.replace("px","")],
                [d.style.top.replace("px",""),d.style.left.replace("px","")]
                );
            btn.innerHTML = "Reset";
            btn.onclick = () =>{findPath(document.getElementById("find-btn"));};
            ++state;
            break;
        case 3:
            source.setAttribute("class","point pt-cr-sm");
            destination.setAttribute("class","point pt-cr-sm");
            resetProcess();
            clearCanvas();
            btn.innerHTML = "Find path";
            for(var x in graph.nodes)
                pointRender([x,"transparent"]);
            state = 0;
            source = null;
            destination = null;
        default:
            break;
    }
}
  