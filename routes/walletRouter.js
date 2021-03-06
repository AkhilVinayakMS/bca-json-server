const express = require("express");
const walletBalence = require("../data/walletBalence");
const scatterData = require("../data/scatterPlot");
const lineData = require("../data/lineData");
const actualData = require("../data/page_one_actualdata");
const paginate = require("../utils/pagination");
const csv = require("csvtojson");
const moment = require("moment");

const csvFilePath =
    "/Users/akhil.pillai1/dev/bca-fake-rest-server/Nodejs-rest-api-project-structure-Express/routes/bca_data_all.csv";

const walletRouter = express.Router();
function filterFunction(query, fullDataArray, isLatestBalance) {
    const {
        currency,
        startDate,
        endDate,
        walletId,
        fromBalance,
        toBalance
    } = query;
    let currencyArray = !currency
        ? fullDataArray
        : fullDataArray.filter(data => data.Currency == currency);
    let walletArray = !walletId
        ? currencyArray
        : currencyArray.filter(data => data.Address == walletId);
    let balanceFilterArray;
    if(isLatestBalance){
     balanceFilterArray =
        !fromBalance && !toBalance
            ? walletArray
            : walletArray.filter(
                data =>
                    Number(data.LatestBalance) >= fromBalance &&
                    Number(data.LatestBalance) <= toBalance
            );
    }else{
        balanceFilterArray =
        !fromBalance && !toBalance
            ? walletArray
            : walletArray.filter(
                data =>
                    Number(data.RunningBalance) >= fromBalance &&
                    Number(data.RunningBalance) <= toBalance
            );
    }
    let startDateFilterArray = !startDate
        ? balanceFilterArray
        : balanceFilterArray.filter(
            data =>
                moment(data.BlockTime, "DD-MM-YY hh:mm") >
                moment(startDate, "DD-MM-YY")
        );
    let endDateFilterArray = !endDate
        ? startDateFilterArray
        : startDateFilterArray.filter(
            data =>
                moment(data.BlockTime, "DD-MM-YY hh:mm") < moment(endDate, "DD-MM-YY")
        );
        return endDateFilterArray
}
// Graph 1.1
walletRouter.get("/latestbalance", async (req, res) => {
    // const {inviteId, action} = req.params;
    // const fullDataArray = await csv().fromFile(csvFilePath)
    const fullDataArray = actualData;
    const { skip, limit } = req.query;
    let endDateFilterArray = filterFunction(req.query,fullDataArray,true);

    if (!skip && !limit) {
        paginatedData = endDateFilterArray;
    } else {
        paginatedData = paginate(
            endDateFilterArray,
            Number(limit),
            Number(skip) + 1
        );
    }
    const result = [];
    paginatedData.map(data => {
        result.push({
            address: data.Address,
            balance: data.LatestBalance
        });
    });

    res.send({
        data: result
    });
});
// graph 1.2
walletRouter.get("/scatterbalance", async (req, res) => {
    // const {inviteId, action} = req.params;
    const { skip, limit } = req.query;
    let paginatedData;
    const fullDataArray = actualData;
    const endDateFilterArray = filterFunction(req.query, fullDataArray, false)
    if (!skip && !limit) {
        paginatedData = endDateFilterArray;
    } else {
        paginatedData = paginate(
            endDateFilterArray,
            Number(limit),
            Number(skip) + 1
        );
    }
    const result = [];
    paginatedData.map(data => {
        result.push({
            date: data.BlockTime.substring(0, 8),
            address: data.Address,
            balance: data.LatestBalance
        });
    });

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
    const { skip, limit, walletId } = req.query;
    const specificBalance = [];
    actualData.map(data => {
        if (data.Address == walletId) {
            specificBalance.push({
                date: data.BlockTime.substring(0, 8),
                address: data.Address,
                balance: data.LatestBalance
            });
        }
    });
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
