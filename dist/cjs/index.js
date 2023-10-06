"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebModel = exports.useServerModel = exports.BaseModel = void 0;
const BaseModel = __importStar(require("./BaseModel"));
exports.BaseModel = BaseModel;
let _Server;
let _Web;
if (typeof window === 'undefined') {
    Promise.all([
        Promise.resolve().then(() => __importStar(require('./ServerInit'))),
        Promise.resolve().then(() => __importStar(require('./ServerModel')))
    ]).then(([ServerInit, ServerModel]) => {
        _Server = { ...ServerInit, ...ServerModel };
    });
}
else {
    Promise.all([
        Promise.resolve().then(() => __importStar(require('./WebInit'))),
        Promise.resolve().then(() => __importStar(require('./WebModel')))
    ]).then(([WebInit, WebModel]) => {
        _Web = { ...WebInit, ...WebModel };
    });
}
const useServerModel = () => {
    if (typeof window !== 'undefined') {
        throw new Error("Server functionality is not available in the client environment.");
    }
    if (!_Server) {
        throw new Error("Server functionality has not been initialized.");
    }
    return _Server;
};
exports.useServerModel = useServerModel;
const useWebModel = () => {
    if (typeof window === 'undefined') {
        throw new Error("Web functionality is not available in the server environment.");
    }
    if (!_Web) {
        throw new Error("Web functionality has not been initialized.");
    }
    return _Web;
};
exports.useWebModel = useWebModel;
