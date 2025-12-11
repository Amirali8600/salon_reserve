"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQuery = void 0;
const base_query_1 = require("./base.query");
const user_model_1 = require("../model/user.model");
class UserQuery extends base_query_1.BaseQuery {
    constructor() {
        super(user_model_1.User);
    }
    findbyPhone(phone) {
        return this.findOne({ phone });
    }
}
exports.UserQuery = UserQuery;
