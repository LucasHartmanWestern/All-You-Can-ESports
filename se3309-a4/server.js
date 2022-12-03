const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const app = express(); // Call express function to get Express type object
app.use (express.json()); // Add middleware to enable json parsing
const port = process.env.PORT || 3000; // Specify port or use 3000 by default

var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "esports",
    database: "assignment3352",
    multipleStatements : true
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DB");
    con.query("CREATE DATABASE assignment3352", function (err, result) {
      if (err) {
      } else {
      }
    });
});

// Add various headers to each request
app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS, DELETE');
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});

// Get all the matching teams for a given search pattern matching the team name, org name, or game name
app.get('/api/v1/team', (req, res) => {

    // Received Object Structure:
    // N/A

    // Retrieve and verify input parameters
    const teamName = req.query['team_name'];
    const gameName = req.query['game_name'];
    const orgName = req.query['org_name'];

      var sql = "SELECT * FROM teams WHERE name = ? OR game = ? OR organization = ?; ";
      con.query(sql,[teamName,gameName,orgName], function (err, result) {
        if (err) {
          res.send (err);
        } else {
          res.send(result);
        }
      });

    // Sent Object Structure:
    // […, {name: string, wins: int, losses: int, organization: string}, …]
});

// Get all available game names
app.get('/api/v1/games', (req, res) => {

    // Received Object Structure:
    // N/A

    var sql = "SELECT * FROM games";
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.send(result);
    });

    // Sent Object Structure:
    // […, {game_name: string}, …]
});

// Get all available orgs names
app.get('/api/v1/orgs', (req, res) => {

    // Received Object Structure:
    // N/A

    var sql = "SELECT * FROM e_sports_orgs";
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.send(result);
    });

    // Sent Object Structure:
    // […, {org_name: string, team_count: int}, …]
});

// Get all the matching matches for a given search pattern matching the team name, org name, or game name
app.get('/api/v1/match', (req, res) => {

    // Received Object Structure:
    // N/A

    // Retrieve and verify input parameters
    const teamName = req.query['team_name'];
    const matchDate = req.query['match_date'];
    const location = req.query['location'];
    const tournament = req.query['tournament'];

      var sql = "SELECT * FROM matches WHERE match_date = ? OR team1 = ? OR team2 = ? OR location =? OR tournament = ? GROUP BY match_date ";
      con.query(sql,[matchDate,teamName,teamName,location,tournament], function (err, result) {
        if (err) {
          res.send (err);
        } else {
          res.send(result);
        }
      });

    // Sent Object Structure:
    // […, {match_date: YYYY-MM-DD, team1_name: string, team2_name: string, location: string, tournament: string, winner: int}, …]
});

// Get all announcements from specific orgs
app.get('/api/v1/announcement', (req, res) => {

    // Received Object Structure:
    // N/A

    // Retrieve and verify input parameters
    const orgName = req.query['org_name'];

      var sql = "SELECT title, author, body, creation_date FROM announcements WHERE e_sports_org IN (?); ";
      con.query(sql,[orgName], function (err, result) {
        if (err) {
          res.send (err);
        } else {
          res.send(result);
        }
      });

    // Sent Object Structure:
    // […, {title: string, author: string, body: string, creation_date: string}, …]
});

// Create announcement
app.put('/api/v1/announcement', (req, res) => {

    // Received Object Structure:
    // {title: string, author: string, body: string, creation_date: string, org: string}

    // Retrieve and verify input parameters
    const {title,author,body,creation_date,org} = req.body;
    const details = [title,author,body,creation_date,org]

      var sql = "INSERT INTO announcements VALUES (?)";
      con.query(sql,[details,title,author,body,creation_date,org], function (err, result) {
        if (err) {
          res.send (err);
        } else {
          res.send(req.body);
        }
      });

    // Sent Object Structure:
    // {title: string, author: string, body: string, creation_date: string}
});

//Delete announcement
app.post('/api/v1/announcement', (req, res) => {

    // Received Object Structure:
    // {title: string, author: string, body: string, creation_date: string, org: string}

    // Retrieve and verify input parameters
    const {title,author,body,creation_date,org} = req.body;

      var sql = "DELETE FROM announcements WHERE title=? AND author=? AND body=? AND creation_date=? AND e_sports_org=?;"
      con.query(sql,[title,author,body,creation_date,org,title,author,body,creation_date,org], function (err, result) {
        if (err) {
          res.send (err);
        } else {
          res.send(req.body);
        }
      });

    // Sent Object Structure:
    // {title: string, author: string, body: string, creation_date: string}
});

//View bets for a given match
app.get('/api/v1/bets', (req, res) => {

  // Received Object Structure:
  // {match_date: YYYY-MM-DD, match_location: string, team_name: string, holder: int}

  // Retrieve and verify input parameters
  const matchDate = req.query['match_date'];
  const matchLoc = req.query['match_location'];
  const teamName = req.query['team_name'];
  const holder = req.query['holder'];

    var sql = "SELECT holder, amount, match_location, match_date, team FROM bets WHERE match_date=? AND match_location=? AND team=? AND holder=?;  ";
    con.query(sql,[matchDate,matchLoc,teamName,holder], function (err, result) {
      if (err) {
        res.send (err);
      } else {
        res.send(result);
      }
    });

  // Sent Object Structure:
  //  […, {holder: int, amount: float, match_location: string, match_date: YYYY-MM-DD, team: string}, …]
});

//Make a bet on behalf of a user.
app.put('/api/v1/bets', (req, res) => {

  // Received Object Structure:
  // {amount: float, holder: int, match_location: string, match_date: YYYY-MM-DD, team: string}

  // Retrieve and verify input parameters
  const {amount,holder,match_location,match_date,team} = req.body;

    var sql = "INSERT INTO bets (amount, holder, match_location, match_date, team, odds) VALUES (?,?,?,?,?, (SELECT ROUND((RAND()*(ABS(wins-losses))+wins+1), 1) FROM teams ORDER BY RAND () LIMIT 1)); ";
    con.query(sql,[amount,holder,match_location,match_date,team], function (err, result) {
      if (err) {
        res.send (err);
      } else {
        res.send(req.body);
      }
    });

  // Sent Object Structure:
  //  {holder: int, amount: float, match_location: string, match_date: YYYY-MM-DD, team: string}
});

//Add match results
app.post('/api/v1/match/results', (req, res) => {

  // Received Object Structure:
  // {match_location: string, match_date: string, team1: string, team2: string, result: 1 or 2}

  // Retrieve and verify input parameters
  const {match_location,match_date,team1,team2,result} = req.body;

    var sql = "UPDATE matches SET winner=? WHERE location=? AND match_date=? AND team1=? AND team2=?"
    var sql2 = "UPDATE teams, matches "+
    "SET teams.wins = "+
       "(SELECT count(team1) FROM matches WHERE winner =1 AND team1 = teams.name) + "+
       "(SELECT count(team2) FROM matches WHERE winner =2 AND team2 = teams.name), "+
    "teams.losses = "+
       "(SELECT count(team2) FROM matches WHERE winner =1 AND team2 = teams.name) + "+
       "(SELECT count(team1) FROM matches WHERE winner =2 AND team1 = teams.name) "+
    "WHERE teams.name = matches.team1 OR teams.name = matches.team2 "
    var sql3 = "UPDATE players, teams,player_teams "+
    "SET players.wins = teams.wins, players.losses = teams.losses "+
    "WHERE teams.name = player_teams.team "+
       "AND player_teams.player = players.player_id "+
       "AND (teams.wins > 0 or teams.losses>0); "
    con.query(sql+";"+sql2+";"+sql3,[result,match_location,match_date,team1,team2], function (err, result) {
      if (err) {
        res.send (err);
      } else {
        res.send(req.body);
      }
    });

  // Sent Object Structure:
  // Endpoint output: {match_location: string, match_date: string, team1: string, team2: string, result: 1 or 2}
});

app.put('/api/v1/user/create', async (req, res) => {

  // Received Object Structure:
  // {name: string, password: string, email: string}

  // Retrieve and verify input parameters
  const {name,password,email} = req.body;

  var existsCheck = `SELECT * FROM generic_users WHERE name = ? OR email = ?`;
    con.query(existsCheck,[name,email], function (err, result) {
      if (err) throw err;
      if (result.length) res.status(400).send('Username or Email already taken');
      else {
        var sql = `INSERT INTO generic_users (name, email, password) VALUES(?,?,?)`;
        var sql2 = "SELECT user_id, name, access_level FROM generic_users WHERE name = ? AND email = ?"
        con.query(sql+";"+sql2,[name,email,password,name,email], async function (err, result) {
          if (err) {
            res.status(500);
            throw err;
          }
          const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (5 * 60 * 60), // 5 hour expiry
            name: req.body.name,
            password: req.body.password
          }, process.env.JWT_KEY || 'se3309');

          res.send({jwt: token});
        });
      }
    });
  // Sent Object Structure:
  //  JWT with {user_id: int, name: string, access_level: int}
});

app.post('/api/v1/user/login', async (req, res) => {

  // Received Object Structure:
  // {email: string, password: string}

  // Retrieve and verify input parameters
  const {email,password} = req.body;

  var sql = `SELECT * FROM generic_users WHERE email = ? AND password = ?`;
  con.query(sql,[email,password], function (err, result) {
    if (err) res.status(500).send(err);
    if (result.length) {
        const token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (5 * 60 * 60), // 5 hour expiry
          name: result[0].name,
          access_level: result[0].access_level
        }, process.env.JWT_KEY || 'se3309');

        res.send({jwt: token});

    }
    else res.status(401).send("Invalid Credentials");
  });

  // Sent Object Structure:
  // JWT with {user_id: int, name: string, access_level: int}
});

app.post('/api/v1/user/guest', async (req, res) => {

  // Received Object Structure:
  // {match_location: string, match_date: string, team1: string, team2: string, result: 1 or 2}

  // Retrieve and verify input parameters
  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (5 * 60 * 60), // 5 hour expiry
    name: 'guest',
    access_level: 0
  }, process.env.JWT_KEY || 'se3309');

  res.send({jwt: token});

  // Sent Object Structure:
  //JWT with {user_id: 0, name: “guest”, access_level: 1}
});

app.get('/api/v1/user', async (req, res) => {

  // Received Object Structure:
  // N/A

  let token = req.header('Authorization');
  jwt.verify(token, process.env.JWT_KEY || 'se3309', (err, decoded) => {
    if (err) res.status(500);
    if (decoded.access_level < 3) res.status(401).send("Not authorized");

    var sql = `SELECT name, email,account_balance, access_level FROM generic_users;`;
    con.query(sql, function (err, result) {
      if (err) res.status(500).send(err);
      else {
        res.status(200).send(result);
      }
    });
  });

  // Sent Object Structure:
  // Endpoint output: […, {name: string, email: string, account_balance: float, access_level: int}, …]
});

app.post('/api/v1/user', async (req, res) => {

  //Input: {name: string, email: string, access_level: int}

  const{name,email,access} = req.body;
  let token = req.header('Authorization');
  jwt.verify(token, process.env.JWT_KEY || 'se3309', (err, decoded) => {
    if (err) res.status(500);
    if (decoded.access_level !== 3) res.status(401);
    else {
        var sql = `UPDATE generic_users SET access_level = ? WHERE (username = ?) AND (email = ?)`;
        var sql2 = "SELECT name, email,account_balance, access_level FROM generic_users WHERE name = ? AND email = ?"
        con.query(sql+";"+sql2,[access,name,email,name,email], function (err, result) {
          if (err) throw err;
          else res.status(200).send(result[1]);
        });
    }
  });
  //Output:{name: string, email: string, account_balance: float, access_level: int}
});

// Listen to the specified port
app.listen(port, () => console.log(`Listening on port ${port}...`));
