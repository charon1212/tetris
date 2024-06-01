/**
 * ■ ■ ■ このファイルの使い方 ■ ■ ■
 * このファイルは、以下のElectronドキュメントを元に、メインプロセス <=> レンダラープロセス間の通信をTypeScript上で適切に定義するための物である。
 * cite: https://www.electronjs.org/ja/docs/latest/tutorial/ipc
 * このファイル上にプロセス間の通信の型定義などを記載し、メインプロセス側とレンダラープロセス側で共有することで、同じ型定義を適用する。
 * そのため、他の型定義をインポートしないようにするか、両プロセスの配置場所から見て同じ相対パスに配置すること。（または、共通の置き場所に配置すること）
 */

/** ★DomainType(PJごとに要編集。共有が必要な型定義を記述。) */
export type Sample = { name: string, };

/** ★API (PJごとに要編集。関数をMyAPIに追記) */
export type MyAPI = {
  callSample: (sample: Sample) => void,
  writeFile: (filePath: string, content: string) => void,
  readFile: (filePath: string) => Buffer,
};

/** Renderer API (Promise) */
type WrapPromise<T extends (...args: any[]) => any> = ReturnType<T> extends PromiseLike<any> ? (...args: Parameters<T>) => ReturnType<T> : (...args: Parameters<T>) => Promise<ReturnType<T>>;
export type MyAPIPromise = { [key in keyof MyAPI]: WrapPromise<MyAPI[key]> };

/**
 * ★Main
 *
 * ```ts:subscribeIpcMainHandler.ts
 * import { ipcMain } from 'electron';
 * import { MyAPI } from './electronInterProcessCommunication'
 * // 任意にインポート。fsモジュールなども呼んでOK
 *
 * const subscriptions: MyAPI = {
 *   //TODO: IMPLEMENTATION
 *   key1: () => {},
 *   key2: () => {},
 * };
 *
 * // electron起動の中で、この関数を呼び出す。
 * // package.jsonの"main"プロパティに指定したエントリーポイントからの処理内で実行されていればOK。
 * export const subscribeIpcMainHandler = () => {
 *   for(let key in subscriptions) ipcMain.handle(key, (_event, ...args) => subscriptions[key](...args));
 * };
 * ```
 *
 * ★Preload
 *
 * ```ts:preload.ts
 * import { contextBridge, ipcRenderer } from 'electron';
 * import { MyAPI } from './electronInterProcessCommunication'
 *
 * const createInvoke = (key: string) => (...args: any) => ipcRenderer.invoke(key, ...args);
 * const myAPI: { [key in keyof MyAPI]: (...args: any) => Promise<any> } = {
 *   key1: createInvoke('key1'),
 *   key2: createInvoke('key2'),
 * };
 * contextBridge.exposeInMainWorld('myAPI', myAPI);
 * ```
 *
 * ★Renderer
 *
 * ```ts:global.d.ts
 * import { MyAPIPromise } from './electronInterProcessCommunication';
 *
 * export declare global {
 *   interface Window {
 *     myAPI: MyAPIPromise;
 *   };
 * };
 * ```
 */
