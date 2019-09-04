const router = require('koa-router')();

const voteControl = require('../controllers/voteControl');

const voteVerifyMiddleware = require('../middleware/voteVerify');

router.prefix('/vote');

// 注册邮箱
router.post('/:vote_id/register/:email', voteControl.registerEmail);

// 验证邮箱
router.get('/verify/:code', voteControl.verifyEmail);

// 投票
router.post('/:vote_id/vote_to/:to', voteVerifyMiddleware, voteControl.voteTo);


module.exports = router;
