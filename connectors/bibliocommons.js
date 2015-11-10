//////////////////////
// Requires
//
//////////////////////
var xml2js = require('xml2js');
var request = require('request');

//////////////////////
// Variables
//////////////////////
var reqHeader = { "Content-Type": "text/xml; charset=utf-8" };

//////////////////////////
// Function: searchByISBN
//////////////////////////
exports.searchByISBN = function (isbn, lib, callback) {
    
    var responseHoldings = [];

    // Request 1
    //
    request.get({ url: lib.Url + 'SearchCatalog/KEYWORD/' + isbn, headers: reqHeader }, function (error, msg, response) {
        xml2js.parseString(response, function (err, res) {
            if (res.searchCatalog.TotalCount[0] > 0) {
                var bibId = res.searchCatalog.Bib[0].BcId[0];

                // Request 2
                request.get({ url: lib.Url + 'currentItems/' + bibId, headers: reqHeader }, function (error, msg, response) {

                    xml2js.parseString(response, function (err, result) {

                        var libraries = {};
                        for (x = 0; x < result.CurrentItems.LibraryItem.length ; x++) {
                            var libName = result.CurrentItems.LibraryItem[x].Branch[0].Name[0];
                            if (!libraries[libName]) libraries[libName] = { available: 0, unavailable: 0 };
                            if (result.CurrentItems.LibraryItem[x].Status[0] == 'UNAVAILABLE') libraries[libName].unavailable++;
                            if (result.CurrentItems.LibraryItem[x].Status[0] == 'AVAILABLE') libraries[libName].available++;
                        }

                        for (var lib in libraries) {
                            responseHoldings.push({ library: lib, available: libraries[lib].available, onLoan: libraries[lib].onLoan });
                        }

                        callback(responseHoldings);
                    });
                });
            } else {
                callback(responseHoldings);
            }
        });
    });
};