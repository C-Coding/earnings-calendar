const CountryList = require('./CountryList.json');


module.exports = new Map(CountryList.map(function (item) {
    return [item.id, item];
}))