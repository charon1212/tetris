import { contextBridge, ipcRenderer } from 'electron';
import { MyAPI } from './electronInterProcessCommunication'

const createInvoke = (key: string) => (...args: any) => ipcRenderer.invoke(key, ...args);
const myAPI: { [key in keyof MyAPI]: (...args: any) => Promise<any> } = {
  callSample: createInvoke('callSample'),
  writeFile: createInvoke('writeFile'),
  readFile: createInvoke('readFile'),
};
contextBridge.exposeInMainWorld('myAPI', myAPI);
