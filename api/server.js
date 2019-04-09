const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
// const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
  name: 'monster',
  secret: ' keep it secret, keep it safe!',
  cookie: {
    masAge: 1000 * 60 * 10, // milliseconds
    secure: false, // use cookie over https only. To dynamically change this from true to false for production environment, put it in a .env file
    httpOnly: true, // false meanse JS can't access the cookie on the client
  },
  resave: false, // avoid recreating unchanged sessions
  saveUninitialized: false, // GDPR compliance
}


server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
    res.send("Server is working");
  });
  
  module.exports = server;