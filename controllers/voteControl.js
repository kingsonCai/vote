/**
 * Created by kingson on 2019/8/29.
 */
const jwt = require('jsonwebtoken');
const voteService = require('../services/voteService');
const voteMgrService = require('../services/voteMgrService');
const response = require('../utils/response');
const VoteStatus = require('../constant/voteStatus');
const config = require('config');

const secret = config.get('jwt.secret');



exports.registerEmail = async function(ctx) {

    let {vote_id, email} = ctx.params;

    // 将base64编码转为utf8编码 (邮箱也许是相对比较敏感的用户信息,尽量不用明文)
    email = Buffer.from(email,'base64').toString('utf8');

    let code = await voteService.registerEmail(vote_id, email);

    response.success(ctx,{registerCode: code});
};


exports.verifyEmail = async function(ctx) {

    let {code} = ctx.params;

    let {result, email} = await voteService.verifyEmail(code);

    if(!result) {
        return response.badOperator(ctx, '邮箱验证失败');
    }

    let token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),  // 过期时间:一天
        data: {email}
    }, secret);

    ctx.set("authorization", token);
    // 返回jwt
    return response.success(ctx, {jwt:token});
};




exports.voteTo = async function(ctx) {

    let {vote_id, to} = ctx.params;

    console.log('query:', ctx.query);

    let {email} = ctx.query.voterInfo;


    let res = await voteMgrService.queryOneVote({id:vote_id});


    if(!res) {
        return response.badOperator(ctx, "投票Id不存在") ;
    }

    if(res.status != VoteStatus.published){
        let msg = (res.status === VoteStatus.over) ? '投票已结束' : '投票未开始';
        return response.badOperator(ctx, msg)
    }

    // 获取选民信息, 没有则新建
    let voterRes = await voteService.getVoterInfoOrCreate(vote_id, email, res.vote_limit);

    if(voterRes.votes <= 0){
        return response.badOperator(ctx, '已用完投票次数,不能再投票')
    }


    let voteRes = await voteService.voteTo(vote_id,email, to);

    return response.success(ctx, voteRes);

};

