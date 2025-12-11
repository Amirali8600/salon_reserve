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
exports.BaseQuery = void 0;
class BaseQuery {
    constructor(model) {
        this.model = model;
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(filter).exec();
        });
    }
    find(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find(filter).exec();
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.create(data);
        });
    }
    update(filter, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOneAndUpdate(filter, updateData, { new: true }).exec();
        });
    }
    updateMany(filter, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.updateMany(filter, updateData).exec();
            return { modifiedCount: result.modifiedCount };
        });
    }
    delete(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOneAndDelete(filter).exec();
        });
    }
    deleteMany(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.deleteMany(filter).exec();
        });
    }
}
exports.BaseQuery = BaseQuery;
