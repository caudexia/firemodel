import { ZodSchema } from 'zod';
interface ModelMethods<T> {
    validate: (data: any) => T | undefined;
    get: (id: string) => Promise<T | undefined>;
    add: (data: T) => Promise<string>;
    update: (id: string, data: Partial<T>) => Promise<void>;
    delete: (id: string) => Promise<void>;
}
export declare function createModel<T>(_collectionName: string, schema: ZodSchema<T>): ModelMethods<T>;
export {};
