var option,frame,ctx;

function init(){
    frame = document.getElementById("frame");
    option = document.getElementById("input");
    ctx = document.getElementById("canvas").getContext("2d");
    ctx.lineWidth = 1;
}

function _(){
    document.getElementById('nodes-disp').innerHTML 
    = document.getElementById('nodes').value;
}

function clearFrame(){
    resetProcess();
    while(frame.firstChild)
        frame.removeChild(frame.firstChild);
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.beginPath();
}

function drawLine(x1,y1,x2,y2){
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function render(){
    clearFrame();
    switch(option.value){
        case "0":
            var top_offset = render_map["top_offset"];
            var left_offset = render_map["left_offset"];
            var top_diff = render_map["top_diff"];
            var left_diff = render_map["left_diff"];
            var l_mult = render_map["l_mult"];
            var t_mult = render_map["t_mult"];
            var l_mult_diff = render_map["l_mult_diff"];
            var t_mult_diff = render_map["t_mult_diff"];
            var tree = new BST();
            treeGenerate(tree,1,Number(document.getElementById("nodes").value));
            var view = tree.table();
            var rview = [[left_offset]];
            var circle = _x("div",{
                "innerHTML":view[0][0],
                "class":"circle",
                "style":"top:"+top_offset+"px;left:"+left_offset+"px;"
            });
            frame.appendChild(circle);
            startProcessFast([(x) => {
                circle.style.backgroundColor = "#7aeba5";
            },[circle]]);
            for(i=1;i<view.length;++i){
                t_mult += t_mult_diff;
                l_mult -= l_mult_diff;
                if(l_mult<0.12) l_mult = 0.12;
                top_offset += t_mult*top_diff;
                rview.push([]);
                for(k=0;k<Math.pow(2,i);++k) rview[i].push(0);
                var parent = 0, step = 0;
                for(j=0;j<Math.pow(2,i);++j) {
                    if(step==0)
                        rview[i][j] = rview[i-1][parent] - l_mult*left_diff;
                    else 
                        rview[i][j] = rview[i-1][parent] + l_mult*left_diff;
                    if(view[i][j]){
                        // frame.appendChild(_x("div",{
                        //     "innerHTML":view[i][j],
                        //     "class":"circle",
                        //     "style":"top:"+top_offset+"px;left:"+rview[i][j]+"px;"
                        // }));
                        // drawLine(rview[i-1][parent] + +render_map["node_radius"],
                        // top_offset - t_mult*top_diff + +render_map["node_radius"],
                        // rview[i][j] + +render_map["node_radius"],
                        // top_offset + render_map["node_radius"]);
                        var map = [
                            view[i][j],
                            top_offset,
                            rview[i][j],
                            rview[i-1][parent],
                            render_map["node_radius"],
                            top_offset - t_mult*top_diff,
                            top_offset
                        ];
                        startProcess([BSTRender,[...map]]);
                    }
                    if(++step==2) {
                        step = 0;
                        ++parent;
                    }
                }
            }
            break;
        case "1":
            break;
        case "2":
            break;
    }
}