var fs=require("fs");
var glob=require("glob");
var vol=process.argv[2];
var rename = function(item){
	var newfn=item.replace(".txt",".json");
	fs.rename(item,newfn);
	//console.log(newfn);	
}

if(!vol) {
	console.log("please enter the volume")
} else {
	glob("./" + vol + "/*.txt",function(err,files){
		files.map(rename);
	});
}
