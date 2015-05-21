var glob=require("glob");
var fs=require("fs");
var unique=require("./unique");
var sortStartByPage=require("./sortstartbypage.js");

var CHIEF = "T.Gawa";

function checkBound(file){
	var dataGroup= []; //[chief proof reader, 修改字起始,長度,頁數,修改字]
	// var content=fs.readFileSync(filename,"utf8");
	// var file=null;
	// try {
	// 	file=JSON.parse(content); 
	// } catch(e) {
	// 	console.log(e);
	// 	//throw "error handling file"+filename;
	// }
	var Person_obj={}; //chief proof reader 名單
	
	 file.rows.map(function(a){

		if((a.doc.payload.type =="suggest" || a.doc.payload.type =="revision") && CHIEF==a.doc.payload.author)
		{
			var chiefmrkp=[a.doc.payload.author,
			a.doc.start,a.doc.len,a.doc.pageid,a.doc.payload.text];
            //,filename.replace(/^.*[\\\/]/, '')
            dataGroup.push(chiefmrkp);   
		}
	});  
	dataGroup=unique(dataGroup);  
	//fs.writeFileSync("mrkp0303-001.json",JSON.stringify(dataGroup,""," "),"utf8");  

	var out = sortStartByPage(dataGroup);

	return out;

}
//checkBound("./vol078/0303-001.json");
module.exports = checkBound;
// glob("./*.json",function(err,files){
//     files.map(checkBound);    
// });