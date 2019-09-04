/**
 * Created by kingson on 2019/8/31.
 */

module.exports = {
    mongodb:{
        url:'mongodb://127.0.0.1:27017/vote',
        options:{}
    },

    redis:{
        url:'redis://127.0.0.1:6379'
    },

    jwt:{
        secret:'$ecret'
    },

    host:"http://localhost:3000/"
};
