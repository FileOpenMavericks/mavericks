module.exports = {
  countData: function (data, category) {
    // Split the category by . so that we can access children
    var path = category.split('.')

        //Make labelMap - associative array
        var labelMap = new Array();
        //Loop the each data to get a session
        for(let i = 0; i < data.length; i++){
            let session = data[i];
            let key = session[path[0]];
            for(let j = 1; j < path.length; j++){
                key = key[path[j]];
            }

            if(labelMap[key]){
                ++labelMap[key];
            }else{
                labelMap[key] = 1;
            }
        }
        return labelMap;
    }
}
