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
    - 私はJavaScriptの末尾の`;`は省略したくないタイプ
    - あとでやりたいメモ
      - srcフォルダに入れたい
      - TypeScriptで書きたい
      - ESModulesで書きたい

### 2.1. ちょっとした味付け１：ウィンドウが全部閉じたらアプリ終了(Windows, Linux)
- WindowsとLinuxは、ウィンドウが全部閉じられるとアプリが終了するので、それを実装
    ```javascript:my-electron-app/main.js（追記）
    app.on("windows-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
    ```
    - `window-all-closed`というイベントをトリガーに処理を実行
    - macOS(darwin)でない場合は、アプリを終了
    - Windowsの`npm run start`では、これを書かなくても終了してしまうので、試せない

### 2.2. ちょっとした味付け２：ウィンドウが全部閉じられているときにアプリがアクティブになったらウィンドウを開く(macOS)
- macOSは、ウィンドウが全部閉じられていても起動し続け、再度アプリがアクティブになったとき、ウィンドウが開くので、それを実装
    ```javascript:my-electron-app/main.js（追記）
    app.whenReady().then(() => {
        createWindow();

        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });
    ```
    - Windowsでは、アクティブになったときウィンドウがゼロという状態を試せない

## 3. バージョン番号を表示
- プリロードスクリプトを使ってレンダラーから Node.js にアクセスする
  - チュートリアルによると↑とのことだがさっぱり
- `main.js`の処理の中で`process`オブジェクトを使えば、Node.js環境からバージョン情報を得ることができるけど、`main.js`はレンダラープロセス（ウィンドウのDOMオブジェクトを描画するプロセス）には直接関与していない（別プロセス）なので、どうしましょう、という話
  - 詳しくはこちら
    - [プロセスモデル | Electron](https://www.electronjs.org/ja/docs/latest/tutorial/process-model)
- **プリロードスクリプト**という処理を使うと、レンダラープロセスに入る直前に実行され、Node.js環境と、レンダラープロセスの両方にアクセスできる
- プロジェクトのルートフォルダに、`preload.js`ファイルを作成
    ```javascript:my-electron-app/preload.js
    window.addEventListener("DOMContentLoaded", () => {
        const replaceText = (selector, text) => {
            const element = document.getElementById(selector);
            if (element) element.innerText = text;
        }
    
        for (const dependency of ["chrome", "node", "electron"]) {
            replaceText(`${dependency}-version`, process.versions[dependency]);
        }
    });
    ```
    - DOMの準備ができたら起動
      - reactの`useEffect(handler,[])`みたいなタイミングか
    - replaceTextという関数を用意しておく
      - セレクターの`innerText`にパラメーターの文字列を設定する
    - `process.versions["chrome"]`, `process.versions["node"]`, `process.versions["electron"]`を取り出して、それぞれのセレクターにそのバージョンを設定する
- 上を、`main.js`の`new BrowserWindow()`のパラメータで、呼ばれるように設定する
    ```javascript:my-electron-app/main.js（追記）
    const { app, BrowserWindow } = require('electron');
    // ファイルの先頭で Node.js の 'path' モジュールをインクルード
    const path = require('node:path');

    // 既存の createWindow() のパラメータに、webPreferencesを追加
    const createWindow = () => {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            },
        });

    win.loadFile('index.html');
    }
    // ...
    ```
    - `__dirname`からの相対パスを使えば、開発中でもリリース後でも稼働する

## 4. アプリケーションの頒布
- インストーラーのビルドモジュールをインストール
  - `npm install --save-dev @electron-forge/cli`
- 初期設定
  - `npx electron-forge import`
- ビルド
  - `npm run make`
  - 下記のファイルが作成される
    - my-electron-app\out\make\squirrel.windows\x64\my-electron-app-1.0.0 Setup.exe
