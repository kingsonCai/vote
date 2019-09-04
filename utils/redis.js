/**
 * Created by kingson on 2019/9/1.
 */

const Redis = require('ioredis');
const config = require('config');

const {url} = config.get('redis');


const redis = new Redis(url);


const DEFAULT_TIMEOUT = 24 * 3600; // 默认是一天


async function getCache(key){
    let cache = await redis.get(key);
    return JSON.parse(cache);
}

async function setCache(key, value){
    return redis.set(key, JSON.stringify(value));
}

async function setCacheInTimeout(key, value, timeout){
    timeout = timeout || DEFAULT_TIMEOUT;
    return redis.set(key, JSON.stringify(value), 'EX', timeout);
}


exports.getCodeCache = async function(code) {

    return getCache("Code::" + code)
};

exports.setCodeCache = async function(code, email) {
    return setCache("Code::" + code, email);
};


exports.getVoteMgrInfoCache = async function(id) {

    return getCache("VoteMgrInfo::" + id)
};

exports.setVoteMgrInfoCache = async function(id, info) {
    let timeout = 7 * 24 * 3600;  // 一周过期
    return setCacheInTimeout("VoteMgrInfo::" + id, info, timeout);
};