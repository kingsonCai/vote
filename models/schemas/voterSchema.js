/**
 * Created by kingson on 2019/8/31.
 */

const mongoose = require('mongoose');

const schema = new mongoose.Schema({

    vote_id:String,  // 投票id

    email:String,   // 选民邮箱

    votes:{         // 剩余投票数
        type:Number,
        default:0
    },

    create_time: {
        type:Date,
        default: Date.now
    }
});

schema.index({vote_id:1, email:1},{unique:true});

module.exports = schema;