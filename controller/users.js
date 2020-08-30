const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateOrSecretKey = process.env.key;

const User = require('../models/user');


function signup(req, res, next) {

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) {
            return res.status(500).json({
                error : err
            })
        } else {
            const user = new User({
                _id : new mongoose.Types.ObjectId(),
                name : req.body.name,
                email : req.body.email,
                password : hash,
                userRole : req.body.userRole
            })
            user.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json(result);
                })
                .catch( err => {
                        console.log(err)
                        res.status(500).json({
                            message : "User Creation Failed",
                            error : err
                        })
                    }
                );
        }
    })
}

function signin(req, res, next) {
    User.find({email : req.body.email})
        .exec()
        .then(user => {
                if(user.length < 1) {
                    return res.status(401).json({
                        message : "Auth Failed"
                    })
                }

                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if(err) {
                        return res.status(401).json({
                            message : "Auth Failed",
                        })
                    }

                    if (result) {
                        const token = jwt.sign({
                                email : user[0].email,
                                userRole : user[0].userRole,
                                userId : user[0]._id
                            },
                            privateOrSecretKey,
                            {
                                expiresIn: 300
                            })
                        return res.status(200).json({
                            message : "Auth Successful",
                            token : token
                        })
                    }
                    res.status(401).json({
                        message : "Auth Failed"
                    })
                })
            }
        )
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error : err
            })
        });
}


module.exports = {
    signup,
    signin
}