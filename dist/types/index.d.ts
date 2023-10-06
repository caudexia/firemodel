import * as BaseModel from './BaseModel';
export { BaseModel };
type ServerInitType = typeof import('./ServerInit');
type ServerModelType = typeof import('./ServerModel');
type WebInitType = typeof import('./WebInit');
type WebModelType = typeof import('./WebModel');
export declare const useServerModel: () => ServerInitType & ServerModelType;
export declare const useWebModel: () => WebInitType & WebModelType;
