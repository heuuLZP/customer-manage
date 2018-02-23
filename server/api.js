const models = require('./db');
const express = require('express');
const router = express.Router();

/************** 创建(create) 读取(get) 更新(update) 删除(delete) **************/

// 获取客户资料列表
router.post('/v1/customer/list',(req,res) => {
    // 获取查询
    let keyword =  req.body.keyword;
    // 通过电话查询
    let query = keyword ? {tel: keyword} : {};
    let page = parseInt(req.body.page);
    let pageCount = 0;
    let pageSize = 10;
    // 通过模型去查找数据库
    models.Customer.count(query).exec((err, count) => {
        pageCount = Math.ceil(count / pageSize);
        // 当前页数不能大于总页数pages
        page = Math.min(page, pageCount);
        // 当前页数不能小于1
        page = Math.max(1, page);

        models.Customer.find(query).skip((page-1)*pageSize).limit(pageSize).exec((err, data) => {
            if (err) {
                res.status(400);
                res.json({ 
                    code: 400,
                    msg: "查询失败" 
                });
            } else {
                res.json({
                    code: 200,
                    msg: "",
                    list: data,
                    page: {
                        dataCount: count, // 总条数
                        currentPage: page, // 当前页
                        pageCount: pageCount, // 分页数量
                        pageSize: pageSize // 每页数量
                    }
                });
            }
        })
    })
});


// 添加一条客户资料
router.post('/v1/customer/add',(req,res) => {
    // 通过模型去查找数据库
    let newCustomer = {
        name : req.body.name,
        tel :  req.body.tel,
        carNumber :  req.body.carNumber,
        carStyle :  req.body.carStyle,
        date :  req.body.date,
        type :  req.body.type,
        detail :  req.body.detail
    }
    
    models.Customer.create(newCustomer, (err) => {
        if(err) {
            res.status(400);
            res.json({ 
                code: 400,
                msg: "添加失败" 
            });
        } else {
            res.json({ 
                code: 200, 
                msg: "添加成功" 
            });
        }
    })
});

module.exports = router;