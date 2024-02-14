"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDto = void 0;
class BaseDto {
    body;
    constructor(body) {
        this.body = body;
    }
    assignBody = () => Object.assign(this, this.body);
}
exports.BaseDto = BaseDto;
