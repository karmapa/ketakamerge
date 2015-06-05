var injectKetaka=function(start,end,text,mrkps) {
  var out=text;
  if(!mrkps)return out;
  //console.log(text);
  for(var i=0; i<mrkps.length; i++){//mrkps[chief,mrkpStart,mrkpLen,mrkpPb,mrkpText]
  	var mrkpStart = mrkps[i][1], mrkpLen = mrkps[i][2], mrkpText = mrkps[i][4];
    //console.log(mrkpStart);
  	out = out.substr(0,mrkpStart-start)+mrkpText+out.substr(mrkpStart-start+mrkpLen+1);
  }

  console.log(out);
	return out;
}

var text = " བུའི་ཆོས་ཀྱི་སྒོ་དག་བསྟན་པའི་དུས་ནི་འདི་ལགས། ཚོང་ནི་འདི་ལགས་ཀྱིས་དེ་ལྟ་བུའི་ཆོས་ཀྱི་སྒོ་དག་བཤད་ཅིང་དེ་ལྟ་བུའི་ཆོས་བསྟན་པ་ཉེ་བར་བསྒྲུབ་ཏུ་གསོལ་། བྱང་ཆུབ་སེམས་དཔའ་འདི་དག་ཀྱང་ཇི་ལྟར་བསམ་གྱིས་མི་ཁྱབ་པའི་སྨོན་ལམ་ཡོངས་སུ་རྫོགས་ཤིང་ཐམས་ཅད་ཀྱང་སྐྱེ་བ་གཅིག་གིས་ཐོགས་པ་དགེ་བའི་རྩ་བ་ཡོངས་སུ་སྨིན་པ་ཤ་སྟག་ལགས་";
var m = [["",15,2,0,"XXXXX"],["",10,0,0,"XXXXX"],["",5,2,0,"XXXXX"]];
// var m = [[ 'T.Gawa', 1158, 6, 7, 'ཀྱིས། ' ],
//   [ 'T.Gawa', 807, 5, 7, 'བཅོམ་' ],
//   [ 'T.Gawa', 801, 6, 7, 'གསོལ། ' ],
//   [ 'T.Gawa', 783, 2, 7, '' ],
//   [ 'T.Gawa', 780, 3, 7, 'དག་' ],
//   [ 'T.Gawa', 137, 7, 7, 'གསོལ། ' ],
//   [ 'T.Gawa', 45, 4, 7, 'ཚོད་' ]];
injectKetaka(0,1000,text,m);