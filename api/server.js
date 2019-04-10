const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const configureKnex = require('../database/dbConfig.js')

const server = express();

const sessionConfig = {
  name: 'monster', // defaults to 'sid'
  secret: ' keep it secret, keep it safe!',
  cookie: {
    masAge: 1000 * 60 * 10, // milliseconds
    secure: false, // use cookie over https only. To dynamically change this from true to false for production environment, put it in a .env file
    httpOnly: true, // false meanse JS can't access the cookie on the client
  },
  resave: false, // avoid recreating unchanged sessions
  saveUninitialized: false, // GDPR compliance

  // This library is used to let your sessions persist in the database instead 
  // of logging you out whenever
  // something in the database changes
  store: new KnexSessionStore({ 
    knex: configureKnex,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 30, // delete expired sessions after 30 minutes
  })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
    res.send("Server is working");
  });
  
module.exports = server;