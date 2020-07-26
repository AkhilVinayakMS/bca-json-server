const express = require("express");
const actualData = require("../data/page_one_actualdata")
const _ = require('lodash')
const moment = require('moment')

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
      const minDate = _.min(actualData.map((rec) => moment(rec.BlockTime)) )
      const maxDate = _.max(actualData.map((rec) => moment(rec.BlockTime)) )

    res.send({
        currencyValues,minWalletRunningBalance,maxWalletRunningBalance,distinctWalletAddresses,minDate,maxDate
    });
});
module.exports = filterRouter;
