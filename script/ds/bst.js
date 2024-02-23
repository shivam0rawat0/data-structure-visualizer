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
    map[6] + map[4]);
    startProcessFast([(x) => {
        circle.style.backgroundColor = "#7aeba5";
    },[circle]]);
}