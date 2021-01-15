# Commentary of training002
node.jsで、Expressを利用したWebサーバーの構築方法を学習しました。  
Udemyの `Node.js速習講座 Part2 <Express編>` の前半の内容をベースにしています。  
後半のRESTfulアプリケーションの作成は後日取り組みます。

## Express
node.jsでWebサーバーを構築・動作させるためのフレームワークです。  
npmで簡単にインストールできます。  
以下のコマンドを、プロジェクトのディレクトリで実行するだけで準備完了です。  
※ 事前にnode と npm のインストールは必要ですが
~~~bash
npm install express --save
~~~

## Expressの使いかた
~~~javascript
const express = require("express");
const app = express();
~~~
ほかのモジュールと同じく、requireで読込します。  
実際に処理を受け持つ変数appに、 express()を代入して初期化を行います。

## get(): GETリクエストに対応する
`get()` で、GETリクエストに処理する内容を設定できます。
~~~javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => { /* ルートディレクトリ("/")へのGETリクエストに対する処理を記述 */
	res.send("send from node.js Express.\n"); /* resはレスポンス(response)の頭文字 */
});

app.listen(18080); /* listenポートを18080に指定 */
~~~
こんな感じにjsファイルを作成します。ここでは `server.js` というファイルを作ったことにします。  
この記述内容をlocalhostでWebサーバーとして動作させてみます。  

~~~bash
$ node server.js & # <- 最後に&を付けることで、server.jsを別のプロセスで動作させる
[1] 14441
$ curl localhost:18080 > &1 # <- localhostからのレスポンスを標準出力に表示
send from node.js Express. # <- res.send() で設定した内容が表示された
$ kill -KILL 1441 # <- 使い終わったら、起動したnodeのプロセス を終了する
~~~
上記のコードブロックでは、標準出力に表示する方法を示してみました。  
実際に動作確認するなら、ブラウザ起動してhttp://localhost:18080/ にアクセスするだけでも大丈夫です。  
`node server.js` で、node.jsがWebサーバとして起動していれば、テキストメッセージが表示されます。

## リクエストに対してファイルを返す
リクエストに対して、テキストではなくサーバ上のファイルを返すためには、  
`espress.static()`をミドルウェアとして登録します。  

### ミドルウェア
ミドルウェアは、リクエストを受けてからクライアント(ブラウザ)へレスポンスされるまでに通過する処理です。  
`app.use()`で、ミドルウェアを登録できます。  

### express.static()
レスポンスする静的ファイルを設置するディレクトリを登録する関数です。  
慣例として、"public"を使うことが多いようです。  


~~~javascript
const express = require("express");
const app = express();

/* リクエストされたファイルがpublicディレクトリ内にあれば、それをレスポンスするように設定する */
app.use(express.static(__dirname + "/public"));

app.listen(18080);
~~~
  
これで、publicディレクトリに作成したファイルを参照するようになりました。  
public ディレクトリに簡単なhtmlファイルを作成して、レスポンスされるか確認してみます。  

~~~html
<!DOCTYPE html>
<html>
	<head>
		<title>foo.html</title>
	</head>
	<body>
		<h1>foo.html</h1>
	</body>
</html>
~~~
これを `/public/foo.html` として保存します。  
そして、ブラウザでhttp://localhost:18080/foo.html にアクセスするか、  
ターミナルで`curl localhost:18080.foo.html >&1` を実行します。  
設定がうまくできていれば、htmlファイルの内容が返ってきます。

## ミドルウェアをカスタマイズする
パッケージにある関数だけでなく、自分でミドルウェアを作成することもできます。  
app.use() には、req, res, nextの3つの引数を持つ関数を登録します。  
reqはリクエストで、ブラウザからのリクエスト情報が入っています。  
resはレスポンスに関するもので、サーバからレスポンスとして送信する内容を作るための変数や関数が含まれます。  
nextはミドルウェアの処理の終わりを示す関数で、最後に必ず実行する必要があります。  
next() を付けないとミドルウェアの処理が終了せず、レスポンスが返らなくなってしまいます。  
~~~javascript
const express = require("express");
const app = express();

app.use((req, res, next) => {
	console.log("my first middleware.");
	console.log(req.url); /* 標準出力に、リクエストされたURLを表示する */
	next(); /* 最後に必ずnext() を記述する */
});

app.use((req, res, next) => {
	console.log("my second middleware.");	
	console.log(new Date().toString()); /* 標準出力に、サーバーがリクエストを受け取った日時を表示する */
	next(); 
});

app.use(express.static(__dirname + "/public"));

app.get("/middleware_test.html", (req, res) => {
	res.send("middleware test success.\n");
});

app.listen(18080);

~~~
  
こんな感じに記述して、リクエストを送ってみると、node.jsサーバを起動したターミナルの標準出力にミドルウェアの処理結果が表示されます。  
~~~bash
$ node server.js &
[1] 6379
$ curl localhost:18080/middleware_test.html
my first middleware.
/middleware_test.html
my second middleware.
Sun Jan 10 2021 03:38:57 GMT+0900 (Japan Standard Time)
middleware test success.
$ kill -KILL 6379
~~~

最初に記述したミドルウェアと、次に記述したミドルウェアの処理を通過して、レスポンスが返ってきているのがわかります。  

## テンプレートエンジンの活用
パッケージとして提供されているミドルウェアとして、出力する内容の共通部分を再利用できるするためのテンプレートエンジンがあります。  
LaravelでいうところのBladeです。  
node.jsで利用できるテンプレートエンジンはいくつかの種類があるようですが、ここではHandlerbarsを試してみます。  
詳しくはこちらで。  
https://handlebarsjs.com/  

Handlerbarsはシンプルですがあまり多機能ではなく、シェアも大きくないようなのであまり深く扱いません。
Udemyの講座ではpartialとかhelperもすこし扱うのですが、commentaryでは割愛します。  
ソースの方には作ったものがあるので、興味があればそちらをご覧いただければ嬉しいです。  

ここでは、`show_ipadress.html`にアクセスされたときに、`show_ipaddress.hbs`のテンプレートを使って  
ipアドレスを動的にレンダリングすることを試してみます。  

### Handlerbarsのインストールと読込み、レンダリングの設定
Handlerbarsは、`hbs` という名称でnpmパッケージとして配布されていますので、npm でインストールします。
~~~bash
npm install hbs --save
~~~
Handlerbarsを利用するには、以下の処理を追加します。
1. requireでhbsパッケージを読込み
2. 分割ファイル(partials)を設置するディレクトリを指定(分割ファイルを使わないなら無くてもOK)
3. expressのテンプレートエンジン(view engine)として登録

さらに、`app.get()`でのレスポンスの指定の際に、`res.render()` でテンプレートファイルに紐づけます。  
第2引数には、テンプレートファイル内で利用するデータをJSON形式で渡すことができるので、  
ここでreq内にあるクライアントのip情報を渡しておきます。

~~~javascript
const express = require("express");
const app = express();

const hbs = require("hbs"); /* <- 1．requireでhbsパッケージを読込み */
hbs.registerPartials(__dirname + "/views/partials"); /* 2. 分割ファイル(partials)を設置するディレクトリを指定 */
app.set("view engine", "hbs"); /* <- 3. expressのテンプレートエンジン(view engine)として登録 */

/* show_ipaddress.htmlのGETリクエストに対するレスポンスを設定 */
app.get("/show_ipaddress.html", (req, res) => {
        res.render("show_ipaddress", {
                ipAddress: req.ip /* .hbs テンプレートファイル内でipの値が利用できるように、JSONで渡しておく */
        });
});

app.listen(18080);
~~~

### Handlerbarsのテンプレートファイル
Handlerbarsでは、拡張子`.hbs`のファイルを`/views/` ディレクトリに設置することで読込できます。  

以下の内容で、`/views/show_iptables.hbs`を作成します。
~~~html
<!DOCTYPE html>
<html>
        <head><title>show_ipaddress</title></head>
        <body>
                <h1>show_ipaddress</h1>
                <section>your IP address -> {{ipAddress}}</section>
        </body>
</html>
~~~

### 動作を確認
以上で必要な内容は作れたので、動作を確認してみます。
~~~bash
$ node server.js &
[1] 12537
$ curl localhost:18080/show_ipaddress.html
<!DOCTYPE html>
<html>
        <head><title>show_ipaddress</title></head>
        <body>
                <h1>show_ipaddress</h1>
                <section>your IP address -> ::ffff:127.0.0.1</section>
        </body>
</html>
$ kill -KILL 12537
~~~
`show_ipaddress.hbs` に `{{ipAddress}}` と記述していた部分が、IPアドレス(ローカルからのアクセスなので127.0.0.1)に置き換わっています。  

node.jsで利用できるテンプレートエンジンやフレームワークは他にもっと多機能なものがあるので、最初に学習するならそっちの方がいいかと。  
自分もあまりHandlerbarsは掘り下げないと思います…

## まとめ
training002で取り組んだ内容は以上です。
Expressの触りの部分だけですが、ルーティングの設定からログデータの保存まで、本当にJavaScriptだけで実装できるので驚いてます。  
ApacheやNginxでやるような、複雑な処理の実装はまだつくれないので、すぐに実用的な環境では利用できないですが、  
今後に向けてできることを増やしていきます。