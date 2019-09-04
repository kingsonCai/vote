/**
 * Created by kingson on 2019/9/2.
 */


const response = require('../utils/response');

module.exports = async function(ctx, next) {

    try{
        return await next()
    }catch(error) {
        return response.error(ctx, error);
    }

};