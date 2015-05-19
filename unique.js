var unique = function(arr){
	var n = {},r=[];
	for(var i = 0; i < arr.length; i++) 
	{
		if (!n[arr[i]]) 
		{
			n[arr[i]] = true; 
			r.push(arr[i]); 
		}
	}
	return r;
};
module.exports=unique;