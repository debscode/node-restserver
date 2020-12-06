const { response } = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const express = require('express');
const app = express();
const User = require('../models/user');

app.get('/users', function (req, res) {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ status: true }, 'name email role status img')
        .skip(from)
        .limit(limit)
        .exec((error, users) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            User.count({ status: true }, (error, count) => {
                res.json({
                    ok: true,
                    users,
                    total_reg: count
                });
            });
        })
});

app.post('/users', function (req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((error, userDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.put('/users/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, userDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.delete('/users/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    //Permanent delete
    //User.findByIdAndRemove(id, (error, userDB) => {
    let changeStatus = {
        status: false
    }
    //Update status to delete (softdelete)
    User.findByIdAndUpdate(id, changeStatus, { new: true }, (error, userDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Ususraio no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            user: userDB
        })
    })
});

module.exports = app;