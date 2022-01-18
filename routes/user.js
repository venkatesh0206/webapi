var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    config = require('../config/database'),
    User = require('../models/user'),
    md5 = require('md5'),
    jwt = require('jsonwebtoken');





router.post('/add-user', function (req, res) {
    let data = req.body;
    let newData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: md5(data.password)
    }

    User.count({ phone: data.phone }, function (err, phoneCount) {
        if (err) {
            res.send({
                success: false,
                msg: err.message
            })
        } else if (phoneCount) {
            res.send({
                success: false,
                msg: "You have this Phone already"
            })
        } else {
            User.create(newData, function (err, addUser) {
                if (err) {
                    res.send({
                        success: false,
                        msg: err.message
                    })
                }
                else {
                    res.send({
                        success: true,
                        msg: addUser
                    })
                }
            })
        }
    })
})


router.post('/edit-user', function (req, res) {
    let data = req.body;
    let query = {
        _id: data.id
    }
    let update = {
        name: data.name,
        email: data.email,

    }
    User.updateOne(query, update, function (err, update_user) {
        if (err) {
            res.send({
                success: false,
                msg: err.message
            })
        }
        else if (update_user.nModified) {
            res.send({
                success: true,
                msg: 'Updated Successfully'
            })
        }
        else {
            res.send({
                success: true,
                msg: 'No Changes Found'
            })
        }
    })
})

router.get('/find-user/:phone', function (req, res) {
    User.findOne({
        phone: req.params.phone
    }, function (err, user) {
        if (err) {
            res.json({
                success: false,
                msg: 'No Admin found'
            });
        } else {
            if (!user) {
                res.json({
                    success: false,
                    msg: 'No Admin found'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'Admin Found'
                });
            }
        }
    })

});

router.post('/delete-user', function (req, res) {
    var id = req.body.id;
    User.remove({
        _id: id
    }, (err, deleted) => {
        if (err) {
            res.json({
                success: false,
                msg: err
            });
        } else {
            if (deleted) {
                res.json({
                    success: true,
                    msg: deleted
                });
            } else {
                res.json({
                    success: false,
                    msg: 'Something went wrong'
                });
            }
        }
    });
});

router.post('/login', function (req, res) {
    let data = req.body;
    User.getUserByMobile(data.phone, function (err, phoneExist) {
        if (err) {
            res.send({ success: false, error: err });
        } else if (phoneExist) {
            if (md5(data.password) === phoneExist.password) {
                let token = jwt.sign({ username: phoneExist._id, iat: new Date().valueOf() }, 'secret', { expiresIn: '15m' });
                let query = {
                    _id: phoneExist._id
                }
                let update = {
                    token: token,
                    updatedDate: new Date().valueOf(),

                }
                User.updateOne(query, update, function (err, update_user) {
                    if (err) {
                        res.send({
                            success: false,
                            msg: err.message
                        })
                    }
                    else if (update_user.nModified) {
                        res.send({
                            success: true,
                            msg: update_user
                        })
                    }
                    else {
                        res.send({
                            success: true,
                            msg: 'No Changes Found'
                        })
                    }
                })

            } else {
                res.send({ success: false, msg: "Invalid Password" });
            }
        } else {
            res.send({ success: false, msg: "No User Found" })
        }

    })

})


router.post('/forgot-password', function (req, res) {
    const data = req.body;
    User.getUserByMobile(data.phone, function (err, phoneExist) {
        if (err) {
            res.send({ success: false, msg: err });
        } else if (phoneExist) {
            let url = 'http://localhost:3000/token' += phoneExist.token;
            res.send({success: true, data : url})

        }else {
            res.send({success:false, msg : "No User Found"})
        }
    })

})

module.exports = router;
