var render_map = {
    "top_offset": 0,
    "top_diff": 40,
    "t_mult_diff": 0.3,
    "t_mult": 1,
    "left_offset": 650,
    "left_diff": 350,
    "l_mult": 1,
    "l_mult_diff": 0.261,
    "node_radius": 15
}

function _(){
    document.getElementById('nodes-disp').innerHTML 
    = document.getElementById('nodes').value;
}

function treeGenerate(tree,l,r){
    if(l<=r){
        var m = Math.trunc(l + (r-l)/2);
        tree.add(m);
        treeGenerate(tree,l,m-1);
        treeGenerate(tree,m+1,r);
    }
}

class Node {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
}

class BST{
    constructor(){
        this.root = null;
        this.tableView = null;
    }

    add(value){
        if(this.root == null){
            this.root = new Node(value);
            return;
        }
        var trav = this.root;
        while(trav != null) {
            if(trav.value != value) {
                if(trav.value > value){
                    if(trav.left == null){
                        trav.left = new Node(value);
                        break;
                    }
                    else trav = trav.left;
                } 
                else if(trav.right == null){
                    trav.right = new Node(value);
                    break;
                }
                else trav = trav.right;
            }
        }
    }

    table(){
        this.tableView = [];
        this.table_r(this.root,0);
        return this.tableView;
    }

    table_r(trav,depth){
        if(trav != null){
            if(!this.tableView[depth]){
                this.tableView[depth] = [];
            }
            this.tableView[depth].push(trav.value);
            this.table_r(trav.left,depth+1);
            this.table_r(trav.right,depth+1);
        } else {
            if(!this.tableView[depth]){
                this.tableView[depth] = [];
            }
            this.tableView[depth].push(null);
        }
    }

    height(){
        return this.height_r(this.root);
    }

    height_r(trav){
        if(trav!=null){
            return 1 + Math.max(this.height_r(trav.left),this.height_r(trav.right));
        }
        return 0;
    }
}

function renderBST(){
    clearFrame();
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
            startProcessSlow([(x) => {
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
                        // drawLine(rview[i-1][parent] + render_map["node_radius"],
                        // top_offset - t_mult*top_diff + render_map["node_radius"],
                        // rview[i][j] + render_map["node_radius"],
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
                        startProcessSlow([BSTRender,[...map]]);
                    }
                    if(++step==2) {
                        step = 0;
                        ++parent;
                    }
                }
            }
}

var BSTRender = (map) => {
    var circle = _x("div",{
        "innerHTML":map[0],
        "class":"circle",
        "style":"top:"+map[1]+"px;left:"+map[2]+"px;"
     });
    frame.appendChild(circle);
    drawLine(map[3] + map[4],
    map[5] + map[4],
    map[2] + map[4],
    map[6] + map[4],"balck",1);
    /*startProcessSlow([(x) => {
        circle.style.backgroundColor = "#7aeba5";
    },[circle]]);*/
    circle.style.backgroundColor = "#7aeba5";
}