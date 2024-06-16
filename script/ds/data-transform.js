var NE = {};
for(edge in graph.edges){
  NE[edge] = {};
  var cood = edge.split(",");
  cood[0] = Number(cood[0]);
  cood[1] = Number(cood[1]);
  var mod = grapg.edges[edge];
  for(nl in mod){
    var ncood = nl.split(",");
    ncood[0] = Number(ncood[0]);
    ncood[1] = Number(ncood[1]);
    var X = Math.pow(Math.abs(ncood[0] - cood[0]),2);
    var Y = Math.pow(Math.abs(ncood[1] - cood[1]),2);
    var nlen = Number(Math.pow(X + Y,0.5).toFixed());
    NE[edge][nl] = nlen;
  }
}