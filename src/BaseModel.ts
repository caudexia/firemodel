import { ZodSchema, ZodTypeDef } from 'zod';

interface ModelMethods<IInput, IOutput> {
  validate: (data: Partial<IInput>) => IOutput | undefined;
  get: (id: string) => Promise<IOutput | undefined>;
  add: (data: IInput) => Promise<string>;
  update: (id: string, data: Partial<IInput>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

/**
 * Creates a base model with common methods for data validation and manipulation.
 * 
 * @template IInput - The type of the data model used for input.
 * @template IOutput - The type of the data model used for output.
 * @param {string} _collectionName - The name of the Firestore collection.
 * @param {ZodSchema<IInput>} schema - The Zod schema for data validation.
 * @returns {ModelMethods<IInput, IOutput>} - The methods associated with the model.
 */
export function createModel<IInput, IOutput>(_collectionName: string, schema: ZodSchema<IOutput, ZodTypeDef, IInput>): ModelMethods<IInput, IOutput> {
  return {
    validate(data: Partial<IInput>): IOutput | undefined {
      try {
        return schema.parse(data);
      } catch (error) {
        return undefined;
      }
    },
    async get(_id: string): Promise<IOutput | undefined> {
      throw new Error("Method not implemented.");
    },
    async add(_data: IInput): Promise<string> {
      throw new Error("Method not implemented.");
    },
    async update(_id: string, _data: Partial<IInput>): Promise<void> {
      throw new Error("Method not implemented.");
    },
    async delete(_id: string): Promise<void> {
      throw new Error("Method not implemented.");
    },
  };
}
