import { ZodSchema } from 'zod';
declare function createServerModel<T>(collectionName: string, schema: ZodSchema<T>): {
    get(id: string): Promise<T | undefined>;
    add(data: T): Promise<string>;
    update(id: string, data: Partial<T>): Promise<void>;
    delete(id: string): Promise<void>;
    validate: (data: any) => T | undefined;
};
export { createServerModel };
