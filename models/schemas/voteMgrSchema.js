/**
 * Created by kingson on 2019/8/31.
 */

const mongoose = require('mongoose');

const schema = new mongoose.Schema({

    id: {
        type:String,
        index:{unique:true}
    },

    title: String,   //标题

    vote_limit: Number,  // 单个选民的投票上限

    create_time: {
        type:Date,
        default: Date.now
    },

    update_time: {
        type:Date,
        default: Date.now,
        index:true
    },

    status: {
        type:String,
        default:'0'    // '0':未开始, '1':进行中, '2':结束
    }
});


module.exports = schema;