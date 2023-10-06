import * as BaseModel from './BaseModel';
export { BaseModel };
let _Server;
let _Web;
export const useServerModel = async () => {
    if (typeof window !== 'undefined') {
        throw new Error("Server functionality is not available in the client environment.");
    }
    const ServerInit = await import('./ServerInit');
    const ServerModel = await import('./ServerModel');
    _Server = { ...ServerInit, ...ServerModel };
    if (!_Server) {
        throw new Error("Server functionality has not been initialized.");
    }
    return _Server;
};
export const useWebModel = async () => {
    if (typeof window === 'undefined') {
        throw new Error("Web functionality is not available in the server environment.");
    }
    const WebInit = await import('./WebInit');
    const WebModel = await import('./WebModel');
    _Web = { ...WebInit, ...WebModel };
    if (!_Web) {
        throw new Error("Web functionality has not been initialized.");
    }
    return _Web;
};
