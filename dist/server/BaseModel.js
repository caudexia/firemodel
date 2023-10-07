"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModel = void 0;
/**
 * Creates a base model with common methods for data validation and manipulation.
 *
 * @template T - The type of the data model.
 * @param {string} _collectionName - The name of the Firestore collection.
 * @param {ZodSchema<T>} schema - The Zod schema for data validation.
 * @returns {ModelMethods<T>} - The methods associated with the model.
 */
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
