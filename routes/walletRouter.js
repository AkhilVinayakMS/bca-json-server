const express = require('express');;
const walletBalence = require('../data/walletBalence')
const paginate = require('../utils/pagination')
// import walletBalence from '../data/walletBalence';
// import paginate from '../utils/pagination'
const walletRouter = express.Router();


walletRouter.get('/latestbalence',async(req,res)=>{
    // const {inviteId, action} = req.params;
    const {skip, limit} = req.query;
    let paginatedData;
    if(!skip && !limit){
        paginatedData = walletBalence;
    }else{
        paginatedData = paginate(walletBalence,Number(limit),Number(skip)+1)
    }

    // // try {
    // //   result = await InviteActionNewUser(inviteId, action);
    // // } catch (err) {
    // //   return;
    // // }
    
    res.send({
      data: paginatedData,
    });
})
module.exports = walletRouter;