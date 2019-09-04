/**
 * Created by kingson on 2019/8/31.
 */

const mongoose = require('mongoose');
const config = require('config');

let {url,options={}} = config.get('mongodb');
console.log(`mongodb url:${url}`);

mongoose.connect(url, Object.assign({
    useNewUrlParser: true
}, options));


/**
 * 获取model
 * @param name
 * @returns {null}
 */
exports.getModel = function(name){
    const schema = require(`./schemas/${name}Schema`);
    return mongoose.model(name, schema);
};


/**
 * 生成对象Id
 * @returns {*}
 */
exports.genObjectId = function() {
    return mongoose.Types.ObjectId();
};
