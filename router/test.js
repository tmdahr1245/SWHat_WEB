const virus_total = require('./virus_total');
virus_total("84c82835a5d21bbcf75a61706d8ab549").then(function(ret){
    console.log(ret);
})