# 全端 Express + Webpack + Live-Reload 開發環境 for Three.js CAD
## 全端測試使用
### 系統安裝
這裡是安裝開發環境所需的所有套件，並且使用supervisor套件省去重新載入的時間。
```cmd
npm install
npm install supervisor -g
```
### 執行測試
這裡將會根據webpack.config的設定，並啟動webpack hot middleware協助開發人員快速調教。
```cmd
npm start
```
---
## 產品包裝 與 測試發布
### 系統安裝
這裡需要安裝所有套件，包含測試包裝的套件。
```cmd
npm install
```
## 包裝 與 執行服務
這裡會清除public目錄下所有資料，並且根據webpack.production.config的設定，接著重新生成bundle檔案，最後執行服務。
```cmd
npm run production
```
---
## 正式產品發布
### 系統安裝 (install-production.bat)
這裡僅需要安裝少許系統所需的檔案。
```bat
SET NODE_ENV=production
npm install
```
### 執行服務 (start-production.bat)
這裡需要事先生成public目錄下所有檔案。
```bat
SET NODE_ENV=production
node app.js
```