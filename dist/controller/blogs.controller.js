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
const { authenticate } = require("./authentication.controller");
const moment = require('moment');
const route = (0, express_1.Router)();
route.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send("Blogr route");
    }
    catch (error) {
        res.send(error);
    }
}));
route.post("/addBlog", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.title) {
            throw new Error("Please provide blog title.");
        }
        else if (!req.body.description) {
            throw new Error("Please provide blog description.");
        }
        else if (!req.body.status) {
            throw new Error("Please provide blog status.");
        }
        else if (!req.body.category) {
            throw new Error("Please provide blog category.");
        }
        else {
            let blog = yield dbwriter.blogs.create({
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
                category: req.body.category,
                author: req.body.login_user_id
            });
            res.json({ 'res': '1', 'msg': "Blog added successfully." });
        }
    }
    catch (error) {
        res.json({ 'res': '0', 'msg': error.message });
    }
}));
route.post("/updateBlog", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.blogId) {
            throw new Error("Please provide blog id.");
        }
        else if (!req.body.title) {
            throw new Error("Please provide blog title.");
        }
        else if (!req.body.description) {
            throw new Error("Please provide blog description.");
        }
        else if (!req.body.status) {
            throw new Error("Please provide blog status.");
        }
        else if (!req.body.category) {
            throw new Error("Please provide blog category.");
        }
        else {
            if (req.body.login_user_role == "admin") {
                yield dbwriter.blogs.update({
                    title: req.body.title,
                    description: req.body.description,
                    status: req.body.status,
                    category: req.body.category,
                    modify_date: moment(new Date).format('YYYY-MM-DD HH:mm:ss')
                }, {
                    where: { id: req.body.blogId }
                });
                res.json({ 'res': '1', 'msg': "Blog updated successfully." });
            }
            else {
                var blog = yield dbwriter.blogs.findOne({
                    where: { id: req.body.blogId, author: req.body.login_user_id }
                });
                if (!blog) {
                    res.json({ 'res': '0', 'msg': "You do not have permission to update blog detail." });
                }
                else {
                    yield dbwriter.blogs.update({
                        title: req.body.title,
                        description: req.body.description,
                        status: req.body.status,
                        category: req.body.category,
                        modify_date: moment(new Date).format('YYYY-MM-DD HH:mm:ss')
                    }, {
                        where: { id: req.body.blogId }
                    });
                    res.json({ 'res': '1', 'msg': "Blog updated successfully." });
                }
            }
        }
    }
    catch (error) {
        res.json({ 'res': '0', 'msg': error.message });
    }
}));
route.delete("/deleteBlog/:blogid", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.blogid) {
            throw new Error("Please provide blog id.");
        }
        else {
            if (req.body.login_user_role == "admin") {
                yield dbwriter.blogs.destroy({
                    where: { id: req.body.blogId }
                });
                res.json({ 'res': '1', 'msg': "Blog deleted successfully." });
            }
            else {
                var blog = yield dbwriter.blogs.findOne({
                    where: { id: req.body.blogId, author: req.body.login_user_id }
                });
                if (!blog) {
                    res.json({ 'res': '0', 'msg': "You do not have permission to update blog detail." });
                }
                else {
                    yield dbwriter.blogs.destroy({
                        where: { id: req.body.blogId }
                    });
                    res.json({ 'res': '1', 'msg': "Blog deleted successfully." });
                }
            }
        }
    }
    catch (error) {
        res.json({ 'res': '0', 'msg': error.message });
    }
}));
route.post("/getAllBlogs", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var offset = 0;
        if (req.body.pageNo) {
            offset = req.body.pageNo;
        }
        var limit = 10;
        if (req.body.pageRecords) {
            offset = req.body.pageRecords;
        }
        var authorValue = 0, authorCondition = dbwriter.Sequelize.Op.ne;
        if (req.body.login_user_role == "user") {
            authorValue = req.body.login_user_id;
            authorCondition = dbwriter.Sequelize.Op.eq;
        }
        var categoryValue = null, categoryCondition = dbwriter.Sequelize.Op.ne;
        if (req.body.category) {
            categoryValue = req.body.author;
            categoryCondition = dbwriter.Sequelize.Op.eq;
        }
        var dateValue = null, dateCondition = dbwriter.Sequelize.Op.ne;
        if (!req.body.start_date || !req.body.end_date) {
            dateValue = moment(new Date()).format("YYYY-MM-DD");
            dateCondition = dbwriter.Sequelize.Op.leq;
        }
        else {
            dateValue = [req.body.start_date, req.body.end_date];
            dateCondition = dbwriter.Sequelize.Op.between;
        }
        var blogs = yield dbwriter.blogs.findAll({
            where: {
                author: { [authorCondition]: authorValue },
                category: { [categoryCondition]: categoryValue },
                publish_date: { [dateCondition]: dateValue }
            },
            offset: offset,
            limit: limit
        });
        res.json({ 'res': '1', 'msg': "Success.", "data": blogs });
    }
    catch (error) {
        res.json({ 'res': '0', 'msg': error.message });
    }
}));
module.exports = route;
