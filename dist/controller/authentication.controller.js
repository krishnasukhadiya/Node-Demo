"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const jwt = require('jsonwebtoken');
const algorithm = 'aes-256-ctr';
const password = '%%^FDTVDF23435FDF%%';
function encrypt(text) {
    var cypher = crypto_1.default.createCipher(algorithm, password);
    var crypted = cypher.update(text, 'utf8', 'hex');
    crypted += cypher.final('hex');
    return crypted;
}
function decrypt(text) {
    var decipher = crypto_1.default.createDecipher(algorithm, password);
    var decoded = decipher.update(text, 'hex', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
}
function authenticate(req, res, next) {
    var token = req.headers.authorization ? req.headers.authorization.split(" ") : [];
    if (token.length == 0 || token[0] != "Bearer" || token[1] == "") {
        return res.json({ 'res': '1', 'msg': "Token  is required." });
    }
    else {
        jwt.verify(token[1], process.env.JWT_SECRET, (err, data) => {
            if (err) {
                return res.json({ 'res': '1', 'msg': err });
            }
            else {
                req.body.login_user_id = data.userId;
                req.body.login_user_email = data.email;
                req.body.login_user_role = data.role;
                return next();
            }
        });
    }
}
module.exports = { encrypt, decrypt, authenticate };
