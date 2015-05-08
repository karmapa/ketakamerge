var fs=require("fs");
var xml4kdb=require("ksana-indexer").xml4kdb;
var tokenize=require("ksana-analyzer").getAPI("simple1").tokenize;

var lj0302_001=fs.readFileSync("./lj0302_001.xml","utf8");

var res=xml4kdb.parseXML(lj0302_001,{segsep:"pb.id"});

//res.tags=[ [tags of seg 0 ], [tags of seg 1] ... ]
//res.texts [ {n:segid, t:"text"} , {n:segid, t:"text}, ]
//inject tags back to text

//tag [realpos, tagname, attribute, vpos==0 ]

var injectKetaka=function(start,end,text,ketakajson) {
  var out="";
  //100      110     start and end
  //abcdefghijklmn   <-- text in XML

  // sort by s
  //s:105, l: 2, t="xyz"   //ketaka revision record
  //abcdexyzhi       <---output

	return out;
}

var injectTag=function(seg,tags) {
	var text=seg.t;
	var out="", last=0,i=0;
	//tagoffset = tags[i][0]

	while (i<tags.length && tags[i][0]>=last) {
		
		out+=injectKetaka(last,tags[i][0],text.substring(last,tags[i][0]));


		var tagname=tags[i][1];
		out+='<'+tagname;

		var attributes=tags[i][2];
		if (attributes) out+=" "+attributes; //has attribute
		out+='>';
		last=tags[i][0];
		i++;
	}
	out+=injectKetaka(last,text.length-1,text.substring(last));
	return out;
}
//console.log(res.texts[2])
//console.log(res.tags[2])
var r=injectTag(res.texts[2],res.tags[2]);
console.log(r)
