import * as BaseModel from './BaseModel';
export { BaseModel };
let _Server;
let _Web;
if (typeof window === 'undefined') {
    Promise.all([
        import('./ServerInit'),
        import('./ServerModel')
    ]).then(([ServerInit, ServerModel]) => {
        _Server = { ...ServerInit, ...ServerModel };
    });
}
else {
    Promise.all([
        import('./WebInit'),
        import('./WebModel')
    ]).then(([WebInit, WebModel]) => {
        _Web = { ...WebInit, ...WebModel };
    });
}
export const useServerModel = () => {
    if (typeof window !== 'undefined') {
        throw new Error("Server functionality is not available in the client environment.");
    }
    if (!_Server) {
        throw new Error("Server functionality has not been initialized.");
    }
    return _Server;
};
export const useWebModel = () => {
    if (typeof window === 'undefined') {
        throw new Error("Web functionality is not available in the server environment.");
    }
    if (!_Web) {
        throw new Error("Web functionality has not been initialized.");
    }
    return _Web;
};
