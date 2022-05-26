"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { dbwriter } = require("../config/dbconfig");
const { encrypt, decrypt } = require("./authentication.controller");
const jwt = require('jsonwebtoken');
const route = (0, express_1.Router)();
route.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send("From User route");
    }
    catch (error) {
        res.send(error);
    }
}));
route.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.first_name) {
            throw new Error("Please provide user's first name.");
        }
        else if (!req.body.last_name) {
            throw new Error("Please provide user's last name.");
        }
        else if (!req.body.email_address) {
            throw new Error("Please provide user's email address.");
        }
        else if (!req.body.password) {
            throw new Error("Please provide user's password.");
        }
        else if (!req.body.dob) {
            throw new Error("Please provide user's dob.");
        }
        else if (!req.body.role) {
            throw new Error("Please provide user's role.");
        }
        else {
            let user = yield dbwriter.users.findOne({
                where: { email: req.body.email_address }
            });
            if (user) {
                res.json({ 'res': '0', 'msg': "User email address already exist." });
            }
            else {
                var pass = yield encrypt(req.body.password);
                let user = yield dbwriter.users.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email_address,
                    password: pass,
                    dob: req.body.dob,
                    role: req.body.role
                });
                res.json({ 'res': '1', 'msg': "User registered successfully." });
            }
        }
    }
    catch (error) {
        res.json({ 'res': '0', 'msg': error.message });
    }
}));
route.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.email_address) {
            throw new Error("Please provide user's email address.");
        }
        else if (!req.body.password) {
            throw new Error("Please provide user's password.");
        }
        else {
            let user = yield dbwriter.users.findOne({
                where: { email: req.body.email_address }
            });
            if (user) {
                if (decrypt(user.password) == req.body.password) {
                    var token = jwt.sign({
                        'userId': user.id,
                        'email': user.email,
                        'role': user.role
                    }, process.env.JWT_SECRET);
                    res.json({ 'res': '1', 'msg': "User logged in successfully.", 'data': { user: user, token: token } });
                }
                else {
                    res.json({ 'res': '0', 'msg': "User credential invalid." });
                }
            }
            else {
                res.json({ 'res': '0', 'msg': "User does not exist." });
            }
        }
    }
    catch (error) {
        res.json({ 'res': '0', 'msg': error.message });
    }
}));
module.exports = route;
