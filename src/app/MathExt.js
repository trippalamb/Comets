Array.prototype.divide = function(div){
    var out = [];
    for(var i = 0; i <this.length; i++){
        out[i] = this[i] / div;
    }
    return out;
}
Array.prototype.multiply = function(mul){
    var out = [];
    for(var i = 0; i <this.length; i++){
        out[i] = this[i] * mul;
     }
    return out;
}

function unit(arr){
    return arr.divide(magnitude(arr));
}

function magnitude(arr){
    var sum = 0;
    for(var i = 0; i <arr.length; i++){
        sum += Math.pow(arr[i], 2);
    }
    
    return Math.sqrt(sum);
}
