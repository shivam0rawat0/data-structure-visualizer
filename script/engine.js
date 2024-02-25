var propType = {
	'class' : 0,
	'id':0,
	'style':0,
	'innerHTML' :1,
	'type':1
};
var callStack = [];
var callStack2 = [];
var processFlag = false;
var processFlag2 = false;

function _x(tag,props){
	var _tmp_ = document.createElement(tag);
    	for(let tp in props){
       		if(propType[tp]==1) _tmp_[tp] = props[tp];
    		else _tmp_.setAttribute(tp,props[tp]);
	}
	return _tmp_;
}

function startProcess(fx,data){
    callStack.push([fx,data]);
    processFlag = true;
}
setInterval(() => {
	if(processFlag){
	   if(callStack.length>0){
		   var task = callStack.shift();
		   task[0][0](task[0][1]);
	   } else {
		   processFlag = false;
	   }
	}
},20);

function startProcessSlow(fx,data){
    callStack2.push([fx,data]);
    processFlag2 = true;
}
setInterval(() => {
	if(processFlag2){
	   if(callStack2.length>0){
		   var task = callStack2.shift();
		   task[0][0](task[0][1]);
	   } else {
		   processFlag2 = false;
	   }
	}
},100);

function resetProcess(){
	processFlag = false;
	callStack = [];
	processFlag2 = false;
	callStack2 = [];
}

