import { MyAPIPromise } from './electronInterProcessCommunication';

export declare global {
  interface Window {
    myAPI: MyAPIPromise;
  };
};
