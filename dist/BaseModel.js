"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModel = void 0;
function createModel(_collectionName, schema) {
    return {
        validate(data) {
            try {
                return schema.parse(data);
            }
            catch (error) {
                return undefined;
            }
        },
        async get(_id) {
            throw new Error("Method not implemented.");
        },
        async add(_data) {
            throw new Error("Method not implemented.");
        },
        async update(_id, _data) {
            throw new Error("Method not implemented.");
        },
        async delete(_id) {
            throw new Error("Method not implemented.");
        },
    };
}
exports.createModel = createModel;
