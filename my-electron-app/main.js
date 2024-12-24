const { app, BrowserWindow } = require("electron");
const path = require('node:path');

// ウィンドウを作る
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    });

    win.loadFile("index.html");
}

// windowが全部閉じたらアプリ終了
app.on("windows-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        // ウィンドウが１つも開かれていなかったら、ウィンドウを作る
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});
