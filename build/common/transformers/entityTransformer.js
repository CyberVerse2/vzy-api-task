"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityTransformer = void 0;
function EntityTransformer(user) {
    delete user["password"];
    return user;
}
exports.EntityTransformer = EntityTransformer;
