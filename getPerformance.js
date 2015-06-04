var fs=require("fs");
var glob=require("glob");
/*
1. change the name of chief (line 8)
2. change the output file name to the vol processed (line 120)
*/

var CHIEF = "K gyaltsen";

var getMrkp = function(item){
		return ([item.doc.start,
					item.doc.len,
					item.doc.pageid,
					item.doc.payload.text,
					item.doc.payload.author
				]);
}

var checkArrEqual = function(arr1,arr2) {
	if(arr1.length != arr2.length) return false;
	for(var i=0; i<arr1.length-1; i++){ //-1: ignore the author
		if(arr1[i] != arr2[i]) return false;
	}
	return true;
}

var accumulateCounterObj = function(obj,matchItem){
	for(var i in obj){
		if(matchItem == i) {
			return i;
		}
	}
	return null;
}

var countQtyOfEachItem = function(arr){
	var out={};
	for(var i=0; i<arr.length; i++) {
		var author = arr[i][4];
		var authorExist=accumulateCounterObj(out,author);
		if(authorExist){
			out[authorExist]++;
		} else {
			out[author] = 1;
		}
	}
	return out;
}

var getApprovedMrkpQtyOfEachPr = function(mrkpArr, approvedMrkpArr){
	var out={};
	for(var i=0; i<mrkpArr.length; i++) {
		for(var j=0; j<approvedMrkpArr.length; j++){
			if( checkArrEqual(mrkpArr[i], approvedMrkpArr[j]) ){
				var author = mrkpArr[i][4];
				var authorExist = accumulateCounterObj(out,author);
				if(authorExist){
					out[authorExist]++;
				} else {
					out[author] = 1;
				}
			}
		}
	}
	return out;
}

var getRate = function(performance){//0: precision 1:recall
	var out={};
	for(var i in performance){
		out[i] = {pr:[],
			      rate:[ [],[] ]};
		for(var j in performance[i].approvedMrkp){
			out[i].pr.push(j);
			var precision = (performance[i].approvedMrkp[j] / performance[i].allMrkp[j]).toFixed(3);
			var recall = (performance[i].approvedMrkp[j] / performance[i].chief).toFixed(3);
			out[i].rate[0].push(precision);
			out[i].rate[1].push(recall);
		}	
	}
	return out;
}

var result={};

var getPerformance = function(fn){
	var file = JSON.parse(fs.readFileSync(fn,"utf8"));
	var bampo = "lj" + fn.match(/\d+-\d+/)[0];

	var approvedMrkp = [];
	var mrkpFromPr = [];
	var qtyOfMrkpFromCpr = 0;

	for(var i=0; i<file.rows.length; i++) {
		if(file.rows[i].doc.payload.type == "revision") {
			approvedMrkp.push(getMrkp(file.rows[i]));
			qtyOfMrkpFromCpr++;
		}
		if(file.rows[i].doc.payload.type == "suggest") mrkpFromPr.push(getMrkp(file.rows[i]));
		if(file.rows[i].doc.payload.type == "suggest" && file.rows[i].doc.payload.author == CHIEF) qtyOfMrkpFromCpr++;
	}
	mrkpFromPr.sort(function(a,b){return a[0] - b[0]});
	approvedMrkp.sort(function(a,b){return a[0] - b[0]});

	var mrkpQtyOfEachPr = countQtyOfEachItem(mrkpFromPr);    
	var approvedMrkpQtyOfEachPr = getApprovedMrkpQtyOfEachPr(mrkpFromPr, approvedMrkp);

	result[bampo] = {
		chief: qtyOfMrkpFromCpr,
		allMrkp: mrkpQtyOfEachPr,
		approvedMrkp: approvedMrkpQtyOfEachPr
	};
	//console.log(approvedMrkp);
}

glob("./080/*.json",function(err,files){
	files.map(getPerformance);
	var out = getRate(result);//0: precision 1:recall
	fs.writeFileSync("vol080.js","var vol080 = "+JSON.stringify(out,"","  ")+"module.exports=vol080;","utf8");	
})

//getPerformance("./DB/vol078/0302-001.json");//./DB/0304-001.json