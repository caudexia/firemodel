import * as BaseModel from './BaseModel';
export { BaseModel };

type ServerInitType = typeof import('./ServerInit');
type ServerModelType = typeof import('./ServerModel');
type WebInitType = typeof import('./WebInit');
type WebModelType = typeof import('./WebModel');

let _Server: ServerInitType & ServerModelType | undefined;
let _Web: WebInitType & WebModelType | undefined;

export const useServerModel = async (): Promise<ServerInitType & ServerModelType> => {
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

export const useWebModel = async (): Promise<WebInitType & WebModelType> => {
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
