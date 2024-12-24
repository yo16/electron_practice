# electron_practice

- electronの練習
- Electron公式
  - [Build cross-platform desktop apps with JavaScript, HTML, and CSS | Electron](https://www.electronjs.org/ja/)
  - [クイック スタート | Electron](https://www.electronjs.org/ja/docs/latest/tutorial/quick-start)
  - github: [electron/electron: :electron: Build cross-platform desktop apps with JavaScript, HTML, and CSS](https://github.com/electron/electron)
    - 2024/12/5(3 weeks ago)に、v33.3.0がリリースされている
    - 現在も頻繁に更新されている

# 記録
## 準備
- 公式HPに日本語のチュートリアルがあったので、それに従う
  - [クイック スタート | Electron](https://www.electronjs.org/ja/docs/latest/tutorial/quick-start)

## 1. 初期環境
- `npm init`で静かにスタート
  - `mkdir my-electron-app && cd my-electron-app`
  - `npm init`
    - entry pointは、`main.js`でなければならない
    - author と description は、アプリのパッケージ化で使うからちゃんと書く
- 開発環境として`electron`をインストール
  - `npm install --save-dev electron`
- `package.json`の start に、electronを起動できるコマンドを追記
    ```package.json
    {
        "scripts": {
            "start": "electron ."
        }
    }
    ```
    - `npm run start`（`npm start`に省略可能）で起動
    - まだなにもないので、起動はできないけど

## 2. 始めのページ
- プロジェクトのルートフォルダに、`index.html`ファイルを作成
    ```html:my-electron-app/index.html
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <div>
            We are using Node.js <span id="node-version"></span>,
            Chromium <span id="chrome-version"></span>,
            and Electron <span id="electron-version"></span>.
        </div>
        <div>日本語もokだよね？？</div>
    </body>
    </html>
    ```
    - 念のため `lang="ja"` にして、日本語も入れておいた
    - `<span id="node-version"></span>`が空なのはわざとで、あとでJavaScriptから入れるんだそう
    - あとでやりたいメモ（チュートリアルが終わって余裕があったら）
      - `index.html`は、`public`フォルダに入れたい
- プロジェクトのルートフォルダに、`main.js`ファイルを作成
    ```javascript:my-electron-app/main.js
    const { app, BrowserWindow } = require("electron");

    const createWindow = () => {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
        });

        win.loadFile("index.html");
    }
    
    app.whenReady().then(() => {
        createWindow();
    });
    ```
    - `app`がreadyになったら、いろいろ起動し始める
    - 上のコードが最低限のコードで、ここまで準備できたら、`npm start`で起動できるはず
      - できた！
    - あとでやりたいメモ
      - srcフォルダに入れたい
      - TypeScriptで書きたい
      - ESModulesで書きたい
