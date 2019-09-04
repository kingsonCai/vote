const router = require('koa-router')();

const voteMgrControl = require('../controllers/voteMgrControl');

router.prefix('/vote_mgr');

// 创建投票
router.post('/', voteMgrControl.create);

// 更新投票信息
router.put('/:id', voteMgrControl.update);

// 查询投票列表
router.get('/', voteMgrControl.queryVoteList);

// 查询具体某个投票数据
router.get('/:id', voteMgrControl.query);

// 需要投票状态, 分别有三种状态: 未开始, 进行中, 结束
router.put('/:id/status/:status', voteMgrControl.setStatus);

// 删除
router.delete('/:id', voteMgrControl.delete);


module.exports = router;
