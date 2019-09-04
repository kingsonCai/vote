/**
 * Created by kingson on 2019/8/29.
 */

const _ = require('lodash');
const voteMgrService = require('../services/voteMgrService');
const response = require('../utils/response');
const VoteStatus = require('../constant/voteStatus');


exports.create = async function(ctx) {

    let {title, names} = ctx.request.body;


    let res = await voteMgrService.create(title, names);

    res = res.map(item => _.pick(item, ['_id', 'vote_id', 'name', 'votes', 'create_time']) );

    response.success(ctx,res)
};


exports.update = async function(ctx) {

    const id = ctx.params.id;

    let {title,names} = ctx.request.body;

    let res = await voteMgrService.queryOneVote({id:id});
    if(!res){
        return response.badOperator(ctx, `投票ID:${id}不存在`);
    }

    if(res.status != VoteStatus.unpublish){
        return response.badOperator(ctx, `投票已发布,不能再修改`);
    }

    await voteMgrService.update(id, title, names);

    return response.success(ctx);
};


exports.query = async function(ctx) {

    const id = ctx.params.id;

    let voteInfo = await voteMgrService.queryOneVote({id:id});

    console.log('voteInfo:', voteInfo);

    if(!voteInfo) {
        return response.badOperator(ctx, `投票ID:${id}不存在`);
    }

    let {title, status} = voteInfo;

    let res = await voteMgrService.queryCandidates({vote_id:id});

    res = res.map(item => _.pick(item, ['_id', 'vote_id', 'name', 'votes', 'create_time']) );

    return response.success(ctx, {title, status, candidates:res});
};



exports.queryVoteList = async function(ctx) {

    const {page=0, page_size=10} = ctx.query;

    let res = await voteMgrService.queryVoteList({}, 'id title status update_time vote_limit', +page, +page_size);

    return response.success(ctx, res);
};


exports.setStatus = async function(ctx) {

    const {id, status} = ctx.params;

    // 只能修改为已发布或已结束状态
    if(![VoteStatus.published, VoteStatus.over].includes(status)){
        return response.badOperator(ctx, `不能设置状态为:${status}`)
    }

    await voteMgrService.setStatus(id, status);

    return response.success(ctx, {status});

};


exports.delete = async function(ctx) {


    const {id} = ctx.params;

    let res = await voteMgrService.queryOneVote({id:id});


    if(res && res.status != VoteStatus.unpublish){
        return response.badOperator(ctx, '已经发布的投票,无法删除')
    }

    await voteMgrService.delete(id);

    return response.success(ctx, {});

};