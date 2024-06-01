import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";
import { subscribeIpcMainHandler } from "./subscribeIpcMainHandler";

// Electronアプリの起動処理。
// Windowを作成して、appUrlで指定するコンテンツを表示する。
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // 開発環境ではlocalhost:3000を、それ以外はルートのindex.htmlを描画する。
  if (app.isPackaged) { // 本番ビルド
    const appUrl = url.format({ pathname: path.join(__dirname, "../index.html"), protocol: "file:", slashes: true, });
    win.loadURL(appUrl);
  } else { // 開発ビルド
    win.loadURL('http://localhost:3000');
  }
};

// ウィンドウがすべて閉じられたら、アプリを終了する。
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// アプリケーションの起動処理。
app.whenReady().then(() => {
  createWindow();
  // Mac版のための処理。Windows等と違ってウィンドウを閉じてもバックプロセスでアプリが動き続けるため、アクティブ状態になったときに再度ウィンドウを出す必要がある。
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

subscribeIpcMainHandler();
