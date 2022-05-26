import { Router } from "express";
const { dbwriter } = require("../config/dbconfig");
const { encrypt, decrypt } = require("./authentication.controller");
const jwt = require('jsonwebtoken');
const route = Router();


route.get("/", async (req, res) => {
    try {
        res.send("From User route");
    } catch (error) {
        res.send(error)
    }
});


route.post("/register", async (req, res) => {
    try {
        if (!req.body.first_name) {
            throw new Error("Please provide user's first name.")
        } else if (!req.body.last_name) {
            throw new Error("Please provide user's last name.")
        } else if (!req.body.email_address) {
            throw new Error("Please provide user's email address.")
        } else if (!req.body.password) {
            throw new Error("Please provide user's password.")
        } else if (!req.body.dob) {
            throw new Error("Please provide user's dob.")
        } else if (!req.body.role) {
            throw new Error("Please provide user's role.")
        } else {
            let user = await dbwriter.users.findOne({
                where: { email: req.body.email_address }
            })
            if (user) {
                res.json({ 'res': '0', 'msg': "User email address already exist." });
            } else {
                var pass = await encrypt(req.body.password)
                let user = await dbwriter.users.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email_address,
                    password: pass,
                    dob: req.body.dob,
                    role: req.body.role
                })
                res.json({ 'res': '1', 'msg': "User registered successfully." });
            }
        }
    } catch (error: any) {
        res.json({ 'res': '0', 'msg': error.message });
    }
});



route.post("/login", async (req, res) => {
    try {
        if (!req.body.email_address) {
            throw new Error("Please provide user's email address.")
        } else if (!req.body.password) {
            throw new Error("Please provide user's password.")
        } else {
            let user = await dbwriter.users.findOne({
                where: { email: req.body.email_address }
            })
            if (user) {
                if (decrypt(user.password) == req.body.password) {
                    var token = jwt.sign({
                        'userId': user.id,
                        'email': user.email,
                        'role': user.role
                    }, process.env.JWT_SECRET);
                    res.json({ 'res': '1', 'msg': "User logged in successfully.", 'data': { user: user, token: token } });
                } else {
                    res.json({ 'res': '0', 'msg': "User credential invalid." });
                }
            } else {
                res.json({ 'res': '0', 'msg': "User does not exist." });
            }
        }
    } catch (error: any) {
        res.json({ 'res': '0', 'msg': error.message });
    }
});

module.exports = route;