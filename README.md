## これは何か
xKxAxKxが勉強用に作っているTwitterのクローンアプリです
サーバサイドはDjango、フロントはAngularで作ってるけど
今いじっている最中なのでマトモに動きません（特にフロント）

将来的にはLaravel,Rails,React,Vueのバージョンも作りたい

## 環境
### Django
Python: 3.6.2
#### インストール
```
$ pip install -r  django_app/requirement_pip.txt
```

### Angular
Node: 6.14.1
npm: 3.10.10
#### インストールとかセッティングとか
```
$ cd ngApp
$ npm install
$ npm i -S auth0-lock angular2-jwt
$ npm i -D @types/auth0-lock
```

/ngApp/.angular-cli.jsonの編集
```
"apps": [
  {
    "styles": [
      "styles.css",
      "styles.scss",
      "../node_modules/bootstrap/dist/css/bootstrap.css"
    ],
```
