/**
 * Created by kingson on 2019/8/29.
 */

const crypto = require('crypto');
const config = require('config');
const redis = require('../utils/redis');
const emailUtil = require('../utils/email');

const Host = config.get('host');

// 候选人
const voterModel = require('../models').getModel('voter');
const candidateModel = require('../models').getModel('candidate');

class VoteMgrService {
    construct(){

    }

    async registerEmail(vote_id, email) {

        let codeStr = email + Date.now() + Math.random();
        let code = crypto.createHash('sha1').update(codeStr).digest('hex');

        let cache = email + '::' + vote_id;

        await redis.setCodeCache(code, cache);

        emailUtil.send(email, Host + `vote/verify/${code}`)

        return code
    }


    async verifyEmail(code) {

        let cache = await redis.getCodeCache(code);
        if(!cache){
            return {result:false}
        }

        const [email] = cache.split('::');


        return {result:true, email};
    }


    // todo 投票计数操作丢到redis消息队列中
    async voteTo(vote_id, email, to) {
        console.log('vote_id, email, to:', vote_id, email, to);
        // 候选人被投票数加1
        let res = await candidateModel.updateOne({_id:to},{$inc:{votes:1}});
        if(res.ok)
        // 选民剩余投票数减1
        await voterModel.updateOne({vote_id:vote_id, email}, {$inc:{votes:-1}});

        return await candidateModel.find({_id:to}, "_id name votes");
    }




    // 获取投票者信息
    async getVoterInfoOrCreate(vote_id, email, vote_limit){

        let res =  await voterModel.findOne({vote_id:vote_id, email});

        if(!res) {
            return await this.addVoter(vote_id, email, vote_limit);
        }

        return res;
    }


    // 创建投票者信息
    async addVoter(vote_id, email, vote_limit){
        return await voterModel.create({vote_id, email, votes:vote_limit, create_time:Date.now()});
    }

}


module.exports = new VoteMgrService();