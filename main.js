var fs=require("fs");
var xml4kdb=require("ksana-indexer").xml4kdb;
var tokenize=require("ksana-analyzer").getAPI("simple1").tokenize;
var mkdirp=require("./mkdirp.js");
var filelist = fs.readFileSync("./jiangkangyur.lst","utf8").split(/\r?\n/);
var getMrkp = require("./getallmrkp.js");
//res.tags=[ [tags of seg 0 ], [tags of seg 1] ... ]
//res.texts [ {n:segid, t:"text"} , {n:segid, t:"text}, ]
//inject tags back to text

//tag [realpos, tagname, attribute, vpos==0 ]
var trim=function(text) {
	var out=text;
	if(text[1] == " ") {
		out = text[0]+text.substr(2);
		//out = text.substr(2);
	}
	return out;
}

var beginWithSpace=function(text){
	if(text[1] == " ") return true;
	else return false;
}
var beginWithNewline=function(text){
	if(text[1] == "\n") return true;
	else return false;
}

var injectKetaka=function(start,end,text,mrkps) {
  var out=text;
  if(!mrkps)return out;
  for(var i=0; i<mrkps.length; i++){//mrkps[chief,mrkpStart,mrkpLen,mrkpPb,mrkpText]
  	var mrkpStart = mrkps[i][1], mrkpLen = mrkps[i][2], mrkpText = mrkps[i][4];
  	//console.log(mrkpStart,mrkpText);
  	//out = out.substr(0,mrkpStart-start)+"XXX"+mrkpText+'XXX'+out.substr(mrkpStart-start+mrkpLen);
    //if(mrkpText == " །") console.log(mrkpStart-start+2,mrkpStart-start+mrkpLen+2);
    //console.log(mrkpStart);
  	out = out.substr(0,mrkpStart-start+1)+mrkpText+out.substr(mrkpStart-start+mrkpLen+1);
  }
  //100      110     start and end
  //abcdefghijklmn   <-- text in XML

  // sort by s
  //s:105, l: 2, t="xyz"   //ketaka revision record
  //abcdexyzhi       <---output
  //out += text.substr(0,start);

	return out;
}

var injectTag=function(seg,tags,pageid,mrkps) {
	var text = seg.t;
	var bws = beginWithSpace(text);
	var bwn = beginWithNewline(text);

	var out="", last=0,i=0, j=0;
	var mrkp = mrkps.filter(function(item){return item[0][3]===pageid})[0] ||[];
	if(bws || bwn) mrkp = mrkp.map(function(item){return [ item[0],item[1]+1,item[2],item[3],item[4] ]});
	// if(pageid == 3){
	// 	console.log(tags);
	// 	console.log(mrkp);
	// }
	while (i<tags.length && tags[i][0]>=last) {
		
		var m = mrkp.filter(function(item){ return (last <= item[1] && item[1] < tags[i][0]) });
		out+=injectKetaka(last, tags[i][0], text.substring(last,tags[i][0]), m);
		var tagname=tags[i][1];
		out+='<'+tagname;

		var attributes=tags[i][2];
		if (attributes) out+=" "+attributes; //has attribute
		out+='>';

		last=tags[i][0];
		i++;
	}
	m = mrkp.filter(function(item){ return last <= item[1] });
	out+=injectKetaka(last,text.length-1,text.substring(last),m);
	//console.log(out);
	return out;
}

var processFile = function(res,mrkps,vol,bampo) {
	var out=[];
	for(var i=0; i<res.tags.length; i++){
		var r=injectTag(res.texts[i],res.tags[i],i+1,mrkps);
		out.push(r);
	}
	var d = new Date();
	var date = d.toString().substr(4,11).replace(/ /g,"").toLowerCase();
	mkdirp.sync("../jiangkangyur_"+date+"/"+vol);
	fs.writeFileSync("../jiangkangyur_"+date+"/"+vol+"/"+bampo+".xml",out.join(""),"utf8");
	console.log("All files have been exported to xml, please see ../jiangkangyur_"+date+"/"+vol);
}

filelist.map(function(file){//file:../jiangkangyur/078/lj0302_001.xml
	file=file.trim();
	var vol = file.match(/\/(\d+)\//)[1];
	var bampo = file.match(/lj\d+_\d+/)[0];
	var m=JSON.parse(fs.readFileSync("./"+vol+"/"+bampo.replace("lj","").replace("_","-")+".json","utf8"));
	var mrkps=getMrkp(m);
	//console.log(mrkps);
	var bampoText=fs.readFileSync(file,"utf8").replace(/\r?\n/g,"\n");//./lj0302_001.xml
	var res=xml4kdb.parseXML(bampoText,{segsep:"pb.id"});
	processFile(res,mrkps,vol,bampo);
});
// var r=injectTag(res.texts[2],res.tags[2],3);
// console.log(r);