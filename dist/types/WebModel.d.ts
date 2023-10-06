import { ZodSchema } from 'zod';
import { query as firestoreQuery } from 'firebase/firestore';
declare function createWebModel<T>(collectionName: string, schema: ZodSchema<T>): {
    get(id: string): Promise<T | undefined>;
    add(data: T): Promise<string>;
    update(id: string, data: Partial<T>): Promise<void>;
    delete(id: string): Promise<void>;
    subscribeToRealtimeUpdates(callback: (items: T[]) => void, queryFn?: ((query: ReturnType<typeof firestoreQuery>) => ReturnType<typeof firestoreQuery>) | undefined): import("@firebase/firestore").Unsubscribe;
    validate: (data: any) => T | undefined;
};
export { createWebModel };
