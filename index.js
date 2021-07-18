const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const session = require("express-session");
const app = express();
const pool = dbConnection();

app.set("view engine", "ejs");
app.use(express.static("public"));
// Need to pass data using POST method
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('trust proxy', 1) // trust first proxy
// session
app.use(session({
  secret: 'topsecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// populates drop downs
app.get("/", async (req, res) => {
  let sql = `SELECT DISTINCT genre FROM game ORDER BY genre ASC`;
  let sql2 = `SELECT DISTINCT platform FROM game ORDER BY platform ASC`;
  let sql3 = `SELECT DISTINCT mode FROM game ORDER BY mode ASC`;
  let rows = await executeSQL(sql);
  let rows2 = await executeSQL(sql2);
  let rows3 = await executeSQL(sql3);

  res.render("index", {"genres": rows, "platforms": rows2, "modes": rows3});
});

// renders login page
app.get("/login", function (req, res) {
	res.render("login", {"error":""});
});

// gets game table rows by search input of title
app.get("/searchByTitle", async function(req, res){

  let title = req.query.title;
  //console.log(title);
  let sql = `SELECT gameId, title, genre, platform, mode, price, releaseDate, image FROM game where title LIKE ?`; 
  let params = [`%${title}%`];
  let rows = await executeSQL(sql, params);

  res.send(rows);
});

// gets game table rows by platform
app.get("/searchByPlatform", async function(req, res){

  let platform_id = req.query.platform;
	console.log(platform_id);
  let sql = `SELECT gameId, title, genre, platform, mode, price, releaseDate, image FROM game where platform LIKE ?`; 
  let params = [`%${platform_id}%`];
  let rows = await executeSQL(sql, params);

  res.send(rows);
});

// gets game table rows by mode
app.get("/searchByMode", async function(req, res){

  let mode_id = req.query.mode;
  console.log(mode_id);
  let sql = `SELECT gameId, title, genre, platform, mode, price, releaseDate, image FROM game where mode = ?`; 
  let params = [`${mode_id}`];
  let rows = await executeSQL(sql, params);

  res.send(rows);
});

// gets game table rows by genre
app.get("/searchByGenre", async function(req, res){

  let genre_id = req.query.genre;
  console.log(genre_id);
  let sql = `SELECT gameId, title, genre, platform, mode, price, releaseDate, image FROM game where genre = ?`; 
  let params = [`${genre_id}`];
  let rows = await executeSQL(sql, params);
	
  res.send(rows);
});

// gets game table rows by price
app.get("/searchByPrice", async function(req, res){

  let price_id = req.query.price;
  console.log(price_id);
  let price_split = price_id.split("-");
  let sql = `SELECT gameId, title, genre, platform, mode, price, releaseDate, image FROM game where price >= ? AND price <= ?`; 
  let params = [`${price_split[0]}`, `${price_split[1]}`];
  let rows = await executeSQL(sql, params);

	res.send(rows);
});

// gets all wishlist items for specific user
app.get("/wishlist", isAuthenticated, async function(req, res) {

	let sql = "SELECT gameId, title, genre, platform, MODE, price, releaseDate, image FROM game NATURAL JOIN wishlist WHERE userId = ?";
	let params = [req.session.user];
	console.log(params);
	let rows = await executeSQL(sql, params);
	res.render("wishlist", {"games": rows, "id": req.session.user});
});

//middleware functions
function isAuthenticated(req, res, next){

  //checks whether the user is not authenticated
  if (!req.session.authenticated) {
    res.redirect("/");
  } else {
    next();
  }
}

// api, gets game info
app.get("/api/getGameInfo", async function(req, res){

  let gameId = req.query.gameId;
  let sql = `SELECT * FROM game WHERE gameId = ${gameId}`;
  let rows = await executeSQL(sql);
  //console.log(rows);
  res.send(rows);
});

// api, verifies user login 
app.post("/api/login",  async function(req, res){
  let username = req.body.username;
  let password = req.body.password;
  console.log(password);

  let hashedPwd = "";

  let sql = "SELECT * FROM user WHERE username = ?";  
  let rows = await executeSQL(sql, [username]);

  if (rows.length > 0) {
     hashedPwd = rows[0].password;
  }

  let pwdMatch = await bcrypt.compare(password, hashedPwd);

  if (pwdMatch) {
     req.session.authenticated = true;
		 req.session.user = rows[0].userId;
     res.send({"authentication":"success"}); 
  } else {
    res.send({"authentication":"fail"});
  }
});

// adds game to wishlist
app.post("/addToWishlist", async function(req, res) {
	
	let sql = "INSERT INTO wishlist (gameId, userId) VALUES (?, ?)";
	let params = [req.body.gameId, req.session.user];
	let rows = await executeSQL(sql, params);
	res.render("wishlist");
});

// to delete game off wishlist
app.get("/wishlist/delete", async function(req, res) {
	let gameId = req.query.gameId;
	let userId = req.query.userId;
	let sql = `DELETE FROM wishlist WHERE gameId = ? && userId = ?`;
	let params = [gameId, userId];
	let rows = await executeSQL(sql, params);
	res.redirect("/wishlist");
});

app.get("/logout", isAuthenticated, function(req, res){
  req.session.destroy();
  res.redirect("/");
});

// tests DB
app.get("/dbTest", async function(req, res){
  let sql = "SELECT CURDATE()";
  let rows = await executeSQL(sql);
  res.send(rows);
});

// executes sql
async function executeSQL(sql, params){
  return new Promise (function (resolve, reject) {
    pool.query(sql, params, function (err, rows, fields) {
    if (err) throw err;
      resolve(rows);
    });
  });
}

// DB connection
function dbConnection(){
   const pool  = mysql.createPool({
      
      host: "ao9moanwus0rjiex.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "pjywnujztg045qy5",
      password: "tn6qrlufhtjx14fj",
      database: "j7gqglvyr4heqvxi", 
      port: "3306"
   }); 
   return pool;
} 

//start server
app.listen(process.env.PORT || 5000, () => {
console.log("Expresss server running...")  
});