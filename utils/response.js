/**
 * Created by kingson on 2019/9/1.
 */


exports.success = function(ctx, data) {
    return ctx.body = {
        code:200,
        data
    }
};


exports.fail = function(ctx, error, code) {
    return ctx.body = {
        code: code || 500,
        msg: error
    }
};


exports.badOperator = function(ctx, error) {
    return ctx.body = {
        code: 400,
        msg: error
    }
};

exports.error = function(ctx, error) {
    return ctx.body = {
        code: 500,
        msg: error.message || error
    }
};

exports.forbid = function(ctx, error) {
    return ctx.body = {
        code: 403,
        msg: error
    }
};