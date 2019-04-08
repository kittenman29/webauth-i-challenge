const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');
const Users = require('./users/users-model.js');

const server = express();

server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => {
    res.send("It's alive!");
});

server.post('/api/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 4)
    user.password = hash

    Users.add(user)
        .then(saved => {
        res.status(201).json(saved);
        })
        .catch(error => {
        res.status(500).json(error);
        });
});

server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
});

server.get('/api/users', restricted, role('admin'), (req, res) => {
    Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
  });
  
  function role(title) {
    return function(req.res.next) {
      if (req.headers.title === title) {
        next()
      } else {
        res.status(403).json({message: 'You are not authorized to view this data. Please speak with your system administrator to gain access.'})
      }
    }
  }
  
  function restricted(req, res, next) {
    const {username, password} = req.headers;
  
    if(username && password) {
      Users.findBy({username})
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next()
        } else {
          res.status(401).json({message: 'Invalid Credentials'})
        }
      })
      .catch(error => {
        res.status(500).json({message: 'Something went wrong on our end', error: error})
      })
    } else {
      res.status(400).json({message: 'No credentials provided'})
    }
  }


const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));