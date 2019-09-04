/**
 * Created by kingson on 2019/9/4.
 */

// 请在test目录外,也即在vote目录中跑本测试用例(这样才能正确读取到配置信息)

const axios = require('axios');
const assert = require('assert');
const config = require('config');

const Host = config.get('host');
const VoteStatus = require('../constant/voteStatus');


let session = {voteList:[], voteDict:{}};


/** 投票信息管理 api **/

describe('voteMgr api', function() {


    it('create vote info', async function() {
        let data = {
            "title": "选举班长投票",
            "names": ["小明","小芳","小凯"]
        };
        let res = await axios.post(`${Host}vote_mgr`, data);

        assert.equal(res.data.code, 200);
        for(let item of res.data.data){
            assert.notEqual(data.names.indexOf(item.name), -1);
        }

    });

    it('get vote info list', async function() {

        let res = await axios.get(`${Host}vote_mgr/`);

        //console.log('res.data:', res.data);

        assert.equal(res.data.code, 200);
        session.voteList = res.data.data;

    });

    it('get one vote info', async function() {

        let voteId = session.voteList[0].id;

        let res = await axios.get(`${Host}vote_mgr/${voteId}`);

        assert.equal(res.data.code, 200);

    });


    it('modify vote info', async function() {

        let voteId = session.voteList[0].id;

        let data = {
            "title": "选举班长投票1",
            "names": ["小明","小芳","小北"]
        };
        let res = await axios.put(`${Host}vote_mgr/${voteId}`, data);

        assert.equal(res.data.code, 200);

    });


    it('modify vote status, from unpublish to published, success', async function() {

        let voteId = session.voteList[0].id;

        let res = await axios.put(`${Host}vote_mgr/${voteId}/status/${VoteStatus.published}`);

        assert.equal(res.data.code, 200);

    });

    it('modify vote status, from published to unpublish fail', async function() {

        let voteId = session.voteList[0].id;

        let res = await axios.put(`${Host}vote_mgr/${voteId}/status/${VoteStatus.unpublish}`);

        assert.equal(res.data.code, 400);

    });


    it('delete vote after published , fail', async function() {

        let voteId = session.voteList[0].id;

        let res = await axios.delete(`${Host}vote_mgr/${voteId}`);

        assert.equal(res.data.code, 400);

    });


});


/***  用户投票 api  **/


describe('vote api', function() {


    it('register with email', async function() {

        let email = "kingson_cai@163.com";

        let emailBase64 = Buffer.from(email).toString('base64');

        let voteId = session.voteList[0].id;

        let res = await axios.post(`${Host}vote/${voteId}/register/${emailBase64}`);

        assert.equal(res.data.code, 200);


        session.registerCode = res.data.data.registerCode;

    });


    it('click verify link', async function() {

        let registerCode = session.registerCode;

        let res = await axios.get(`${Host}vote/verify/${registerCode}`);

        //console.log('res.data:', res.data);

        assert.equal(res.data.code, 200);

        let token = res.data.data.jwt;

        session.token = token;

    });


    it('get one vote info', async function() {

        let voteId = session.voteList[0].id;

        let res = await axios.get(`${Host}vote_mgr/${voteId}`);

        assert.equal(res.data.code, 200);

        session.voteDict[voteId] = res.data.data;

    });


    it('vote for candidate, do not take token, fail', async function() {


        let voteId = session.voteList[0].id;

        let to = session.voteDict[voteId].candidates[0]._id;


        let res = await axios.post(`${Host}vote/${voteId}/vote_to/${to}`);

        assert.equal(res.data.code, 403);

    });



    it('vote for candidate, take token, success', async function() {

        let token = session.token;

        let voteId = session.voteList[0].id;

        let to = session.voteDict[voteId].candidates[0]._id;

        console.log('to:', to);

        let res = await axios.post(`${Host}vote/${voteId}/vote_to/${to}`,null,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        assert.equal(res.data.code, 200);

    });

});


