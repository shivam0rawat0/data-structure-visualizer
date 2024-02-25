var option,frame,canvas,mapBG,ctx;
var menu = null;

function init(){
    frame = document.getElementById("frame");
    renderBtn = document.getElementById("render");
    option = document.getElementById("input");
    canvas = document.getElementById("canvas");
    mapBG = document.getElementById("map-bg");
    frame.style.height = "1080px";
    frame.style.width = screen.width+"px";
    canvas.setAttribute("width",screen.width);
    mapBG.setAttribute("width",screen.width);
    ctx = canvas.getContext("2d");
    ctx.lineWidth = 1;
}

function clearContainer(){
    while(frame.firstChild)
        frame.removeChild(frame.firstChild);
}

function clearFrame(){
    resetProcess();
    if(option.value!=2) clearContainer();
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.beginPath();
}

function drawLine(x1,y1,x2,y2,lcolor,lwidth){
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = lcolor;
    ctx.lineWidth = lwidth;
    ctx.stroke();
}

function load(){
    if(menu != null) {
        var inputs = document.getElementsByClassName("menu"+menu);
        for(i=0;i<inputs.length;++i)
            inputs[i].classList.add("hidden");
    }
    menu = option.value;
    var active = document.getElementsByClassName("menu"+option.value); 
    for(i=0;i<active.length;++i)
            active[i].classList.remove("hidden");
    if(option.value == 2){
        graph = new Graph();
        state = 0;
    } else {
        clearFrame();
    }
}