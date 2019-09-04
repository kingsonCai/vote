/**
 * Created by kingson on 2019/9/2.
 */
const jwt = require('jsonwebtoken');
const secret = require('config').get('jwt.secret');

const response = require('../utils/response');

module.exports = async function(ctx, next) {

    let authorization = ctx.request.header.authorization;

    console.log('authorization:', authorization);

    if(!authorization) {
        return response.forbid(ctx, '没有权限投票, 请先进行邮箱验证');
    }

    let token = authorization.split(' ')[1];
    let decoded = jwt.decode(token, secret);

    ctx.query.voterInfo = decoded.data;

    console.log('voterInfo:', ctx.query.voterInfo);


    return await next()
};