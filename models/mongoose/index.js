/**
 * Created by kingson on 2019/8/31.
 */

const mongoose = require('mongoose');
const config = require('config');

let {url,options} = config.get('mongodb');

mongoose.connect(url, options);


exports.getModel = function(name){
    const schema = require(`../schemas/${name}Schema`);
    return mongoose.Mongoose.models(name, schema)
};
