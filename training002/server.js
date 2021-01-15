const fs = require("fs");
const logfile = "./log/access.log"

const express = require("express");
const app = express();

app.use((req, res, next) => {
	console.log("my first middleware.");
	console.log(req.url); /* 標準出力に、リクエストされたURLを表示する */
	console.log(req.ip);
	next(); 
});

app.use((req, res, next) => {
	console.log("my second middleware.");
	console.log(new Date().toString()); /* 標準出力に、サーバーがリクエストを受け取った日時を表示する */
	next(); 
});

/* もうちょっと実践的に…簡易なアクセスログを取得するミドルウェアを設定 */
app.use((req, res, next) => {
	const time = new Date().toString();
	const url = req.url;
	fs.appendFile(logfile, `${time}: ${url}\n`, (err) => {
		console.error("write log failed.");
	});
	next();
});

/*
** 静的ファイルをレスポンスする: express.static()
** app.use()で、ミドルウェア( = クライアントへレスポンスを返すまでに通過する中間の処理)を登録できる
** "__dirname" は、エントリーポイントのファイルがあるディレクトリを指すグローバル変数
** ここでは、/public ディレクトリの中にリクエストされたファイルと一致するものがあればそれをレスポンスするように設定している
*/
app.use(express.static(__dirname + "/public"));

/*
** 静的ファイルをレスポンスする: express.static()
** app.use()で、ミドルウェア( = クライアントへレスポンスを返すまでに通過する中間の処理)を登録できる
** "__dirname" は、エントリーポイントのファイルがあるディレクトリを指すグローバル変数
** ここでは、/public ディレクトリの中にリクエストされたファイルと一致するものがあればそれをレスポンスするように設定している
*/
app.use(express.static(__dirname + "/public"));

/*
** テンプレートエンジンとしてHandlerbarsを利用する準備
** 1. requireで読込
** 2. 分割ファイル(partials)を設置するディレクトリを指定
** 3. expressのテンプレートエンジン(view engine)として登録
*/
const hbs = require("hbs"); 
hbs.registerPartials(__dirname + "/views/partials");
// app.set("view engine", "hbs"); <- helper関数を追加するので、setをうしろに変更

/* hbsにhelper関数を登録する(getCurrentYear()) */
hbs.registerHelper("getCurrentYear", () => {
	return (new Date().getFullYear());
});

/* hbsにhelper関数を登録する(getCurrentYear()) */
hbs.registerHelper("upperCase", (str) => {
	return (str.toUpperCase());
});

app.set("view engine", "hbs");

/* staticで指定されたディレクトリがある場合、app.get()でパスを指定しても、ディレクトリ内のファイルの参照が優先される */
// app.get("/", (req, res) => { 
// 	res.send("<h1>Hello, Express!</h1>");
// });

app.get("/about.html", (req, res) => {
	res.render("about.hbs", { /* about.html へのアクセスがあった場合、/views/about.hbs の内容をレンダリングしてレスポンスする */
		title: "this is about page",
	});
});


app.get("/show_ipaddress.html", (req, res) => {
	res.render("show_ipaddress.hbs", { /* about.html へのアクセスがあった場合、/views/about.hbs の内容をレンダリングしてレスポンスする */
		ipAddress: req.ip,
		title: req.url
	});
});

app.get("/middleware_test.html", (req, res) => {
	res.send("middleware test success. look at terminal stdout.\n");
});

/* staticで指定されたディレクトリ内にファイルが存在しない場合、app.get()で個別に指定された内容が参照される */
app.get("/sub-dir/page.html", (req, res) => {
	console.log(req.url);
	res.send("<h1>sub-dir/page.html</h1>");
});

app.get("/about2.html", (req, res) => {
	res.send("<p>this is sent from res.send() method, as response of \"about2.html\".</p>");
});

/* 
** 複数のリクエストのパターンにマッチするものを指定することもできる
** 最初にマッチしたパターンでレスポンスしてしまうようなので、詳細度が低いものは最後に書く
*/
app.get("/*", (req, res) => {  /* 第一引数に"*" を含めて指定すると、ワイルドカードとして機能する */
	res.render("base.hbs", {
		basedir: req.basedir,
		title: req.url,
	});
});

app.listen(18080);