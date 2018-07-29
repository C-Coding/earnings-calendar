const CountryList = require('./CountryList.json');


const CountryObj={};
CountryList.forEach(function(item){
    CountryObj[item.id]=item;
})


module.exports={
    CountryList,
    CountryObj
}