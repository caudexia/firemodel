import { ZodSchema } from 'zod';

interface ModelMethods<T> {
    validate: (data: any) => T | undefined;
    get: (id: string) => Promise<T | undefined>;
    add: (data: T) => Promise<string>;
    update: (id: string, data: Partial<T>) => Promise<void>;
    delete: (id: string) => Promise<void>;
}

/**
 * Creates a base model with common methods for data validation and manipulation.
 * 
 * @template T - The type of the data model.
 * @param {string} _collectionName - The name of the Firestore collection.
 * @param {ZodSchema<T>} schema - The Zod schema for data validation.
 * @returns {ModelMethods<T>} - The methods associated with the model.
 */
export function createModel<T>(_collectionName: string, schema: ZodSchema<T>): ModelMethods<T> {
  return {
    validate(data: any): T | undefined {
      try {
        return schema.parse(data);
      } catch (error) {
        return undefined;
      }
    },
    async get(_id: string): Promise<T | undefined> {
      throw new Error("Method not implemented.");
    },
    async add(_data: T): Promise<string> {
      throw new Error("Method not implemented.");
    },
    async update(_id: string, _data: Partial<T>): Promise<void> {
      throw new Error("Method not implemented.");
    },
    async delete(_id: string): Promise<void> {
      throw new Error("Method not implemented.");
    },
  };
}
