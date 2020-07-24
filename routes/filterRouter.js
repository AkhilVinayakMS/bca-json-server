const express = require("express");
const actualData = require("../data/page_one_actualdata")
const _ = require('lodash')

const filterRouter = express.Router();
filterRouter.get("/limits/all", async (req, res) => {
    
    var distinctCurrencyArray = _.countBy(actualData, function(t){
        return t.Currency;
      });
      var distinctWalletAddressesArray = _.countBy(actualData, function(t){
        return t.Address;
      });
      const distinctWalletAddresses=Object.keys(distinctWalletAddressesArray)
      const currencyValues = Object.keys(distinctCurrencyArray)
      const minWalletRunningBalance =  _.min(actualData.map((rec) => rec.RunningBalance)) 
      const maxWalletRunningBalance =  _.max(actualData.map((rec) => rec.RunningBalance)) 
    res.send({
        currencyValues,minWalletRunningBalance,maxWalletRunningBalance,distinctWalletAddresses
    });
});
module.exports = filterRouter;
