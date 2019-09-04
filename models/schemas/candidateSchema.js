/**
 * Created by kingson on 2019/8/31.
 */

const mongoose = require('mongoose');

const schema = new mongoose.Schema({

    vote_id:{   // 投票id
        type:String,
        index:true
    },

    name:String,    // 候选人名字

    votes:Number,   // 被投票数

    create_time: {
        type:Date,
        default: Date.now
    }
});

module.exports = schema;