const express = require("express");
const walletBalence = require("../data/walletBalence");
const scatterData = require("../data/scatterPlot");
const lineData = require("../data/lineData");
const actualData = require("../data/page_one_actualdata")
const paginate = require("../utils/pagination");
const csv = require('csvtojson')

const csvFilePath= '/Users/akhil.pillai1/dev/bca-fake-rest-server/Nodejs-rest-api-project-structure-Express/routes/bca_data_all.csv'

const walletRouter = express.Router();


// Graph 1.1
walletRouter.get("/latestbalance", async (req, res) => {
    // const {inviteId, action} = req.params;
    // const fullDataArray = await csv().fromFile(csvFilePath)
    const fullDataArray = actualData;
    const { skip, limit } = req.query;
    let paginatedData;
    if (!skip && !limit) {
        paginatedData = fullDataArray;
    } else {
        paginatedData = paginate(fullDataArray, Number(limit), Number(skip) + 1);
    }
    const result=[]
    paginatedData.map((data)=>{
        result.push({
            address:data.Address,
            balance:data.LatestBalance
        })
    })

    res.send({
        data: result
    });
});
// graph 1.2 
walletRouter.get("/scatterbalance", async (req, res) => {
    // const {inviteId, action} = req.params;
    const { skip, limit } = req.query;
    let paginatedData;
    if (!skip && !limit) {
        paginatedData = actualData;
    } else {
        paginatedData = paginate(actualData, Number(limit), Number(skip) + 1);
    }
    const result = [];
    paginatedData.map((data)=>{
        result.push({
            date:data.BlockTime.substring(0,8),
            address:data.Address,
            balance:data.LatestBalance
        })
    })

    res.send({
        data: result
    });
});

//Graph 2.2
walletRouter.get("/linedata", async (req, res) => {
    // const {inviteId, action} = req.params;
    const { skip, limit } = req.query;
    let paginatedData;
    if (!skip && !limit) {
        paginatedData = lineData;
    } else {
        paginatedData = paginate(lineData, Number(limit), Number(skip) + 1);
    }

    res.send({
        data: paginatedData
    });
});
walletRouter.get("/runningbalance/walletId", async (req, res) => {
    // const {inviteId, action} = req.params;
    const { skip, limit ,walletId} = req.query;
    const specificBalance =[]
    actualData.map(data=>{
        if(data.Address == walletId ){
            specificBalance.push({
                date:data.BlockTime.substring(0,8),
                address:data.Address,
                balance:data.LatestBalance
            })
        }
    })
    let paginatedData;
    if (!skip && !limit) {
        paginatedData = specificBalance;
    } else {
        paginatedData = paginate(specificBalance, Number(limit), Number(skip) + 1);
    }

    res.send({
        data: paginatedData
    });
});


walletRouter.get("/csv", async (req, res) => {
    const jsonArray = await csv().fromFile(csvFilePath);

    res.send({
        data: jsonArray
    });
});
module.exports = walletRouter;
