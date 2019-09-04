/**
 * Created by kingson on 2019/8/29.
 */

const redis = require('../utils/redis');

const models = require('../models');
// 候选人
const candidateModel = models.getModel('candidate');
// 投票信息
const voteMgrModel = models.getModel('voteMgr');

const mongoose = require('mongoose');

class VoteMgrService {
    construct(){

    }

    // 创建投票
    async create(title, names) {

        let vote_limit = this.voterVoteLimit(names.length);

        let res = await voteMgrModel.create({id: mongoose.Types.ObjectId(), title, vote_limit});

        let {id} = res;

        // 缓存
        await redis.setVoteMgrInfoCache(id, res);

        let data = names.map(name=> {
            return {vote_id:id, name, votes:0}
        });


        return candidateModel.create(data);
    }


    // 更新投票信息
    async update(id, title, names) {

        let vote_limit = this.voterVoteLimit(names.length);

        await this.updateVoteMgr(id, {title, vote_limit, update_time: Date.now()});

        await candidateModel.remove({vote_id:id});

        let data = names.map(name=> {
            return {vote_id:id, name, votes:0}
        });

        return candidateModel.create(data);
    }


    // 更新 voteMgr 表 和 缓存
    async updateVoteMgr(id, data){

        await voteMgrModel.updateOne({id:id}, data);
        // 缓存
        let res = await voteMgrModel.findOne({id:id});
        res && await redis.setVoteMgrInfoCache(id, res);

    }


    // 设置投票状态
    async setStatus(id, status){
        await this.updateVoteMgr(id, {status});
    }


    // 查询某个投票的候选人
    async queryCandidates(condition) {
        return candidateModel.find(condition);
    }


    // 查询投票列表
    async queryVoteList(condition, projection, page, page_size) {
        return voteMgrModel.find(condition, projection).skip(page * page_size).limit(page_size).sort({update_time: -1});
    }


    // 查询某个投票信息
    async queryOneVote(condition) {
        let id = condition.id;
        let cache = await redis.getVoteMgrInfoCache(id);
        if(cache){
            return cache;
        }

        let res = await voteMgrModel.findOne(condition);

        redis.setVoteMgrInfoCache(id, res);

        return res;

    }


    // 删除投票信息
    async delete(id){
        await voteMgrModel.remove({id:id});
        return candidateModel.remove({vote_id:id});
    }

    // 选民投票上限
    voterVoteLimit(candidateNum){
        let voteLimit = Math.round(candidateNum/2);
        // 2 <= voteLimit <= 5
        voteLimit = Math.min(Math.max(2, voteLimit), 5);
        return voteLimit;
    }
}


module.exports = new VoteMgrService();