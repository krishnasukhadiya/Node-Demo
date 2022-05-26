import { Router } from "express";
const { dbwriter } = require("../config/dbconfig");
const { authenticate } = require("./authentication.controller");
const moment = require('moment');
const route = Router();

route.get("/", async (req, res) => {
    try {
        res.send("Blogr route");
    } catch (error) {
        res.send(error)
    }
});

route.post("/addBlog", authenticate, async (req, res) => {
    try {
        if (!req.body.title) {
            throw new Error("Please provide blog title.")
        } else if (!req.body.description) {
            throw new Error("Please provide blog description.")
        } else if (!req.body.status) {
            throw new Error("Please provide blog status.")
        } else if (!req.body.category) {
            throw new Error("Please provide blog category.");
        } else {
            let blog = await dbwriter.blogs.create({
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
                category: req.body.category,
                author: req.body.login_user_id
            });
            res.json({ 'res': '1', 'msg': "Blog added successfully." });
        }
    } catch (error: any) {
        res.json({ 'res': '0', 'msg': error.message });
    }
});

route.post("/updateBlog", authenticate, async (req, res) => {
    try {
        if (!req.body.blogId) {
            throw new Error("Please provide blog id.")
        } else if (!req.body.title) {
            throw new Error("Please provide blog title.")
        } else if (!req.body.description) {
            throw new Error("Please provide blog description.")
        } else if (!req.body.status) {
            throw new Error("Please provide blog status.")
        } else if (!req.body.category) {
            throw new Error("Please provide blog category.");
        } else {
            if (req.body.login_user_role == "admin") {
                await dbwriter.blogs.update({
                    title: req.body.title,
                    description: req.body.description,
                    status: req.body.status,
                    category: req.body.category,
                    modify_date: moment(new Date).format('YYYY-MM-DD HH:mm:ss')
                }, {
                    where: { id: req.body.blogId }
                });
                res.json({ 'res': '1', 'msg': "Blog updated successfully." });

            } else {
                var blog = await dbwriter.blogs.findOne({
                    where: { id: req.body.blogId, author: req.body.login_user_id }
                })
                if (!blog) {
                    res.json({ 'res': '0', 'msg': "You do not have permission to update blog detail." });
                } else {
                    await dbwriter.blogs.update({
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
    } catch (error: any) {
        res.json({ 'res': '0', 'msg': error.message });
    }
});

route.delete("/deleteBlog/:blogid", authenticate, async (req, res) => {
    try {
        if (!req.params.blogid) {
            throw new Error("Please provide blog id.")
        } else {
            if (req.body.login_user_role == "admin") {
                await dbwriter.blogs.destroy({
                    where: { id: req.body.blogId }
                });
                res.json({ 'res': '1', 'msg': "Blog deleted successfully." });

            } else {
                var blog = await dbwriter.blogs.findOne({
                    where: { id: req.body.blogId, author: req.body.login_user_id }
                })
                if (!blog) {
                    res.json({ 'res': '0', 'msg': "You do not have permission to update blog detail." });
                } else {
                    await dbwriter.blogs.destroy({
                        where: { id: req.body.blogId }
                    });
                    res.json({ 'res': '1', 'msg': "Blog deleted successfully." });
                }
            }
        }
    } catch (error: any) {
        res.json({ 'res': '0', 'msg': error.message });
    }
});

route.post("/getAllBlogs", authenticate, async (req, res) => {
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
        } else {
            dateValue = [req.body.start_date, req.body.end_date];
            dateCondition = dbwriter.Sequelize.Op.between;
        }


        var blogs = await dbwriter.blogs.findAll({
            where: {
                author: { [authorCondition]: authorValue },
                category: { [categoryCondition]: categoryValue },
                publish_date: { [dateCondition]: dateValue }
            },
            offset: offset,
            limit: limit
        });
        res.json({ 'res': '1', 'msg': "Success.", "data": blogs });
    } catch (error: any) {
        res.json({ 'res': '0', 'msg': error.message });
    }
});

module.exports = route