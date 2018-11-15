// implement your API here

// import axios from 'axios'; ES2015 modules

const express = require('express'); //CommonJS
const cors = require('cors');
const greeter = require('./greeter.js');
const db = require('./data/db.js');
const server = express();
server.use(cors());

// middleware
server.use(express.json()); // teaches express how to parse the JSON request body

server.get('/', (req, res) => {
  res.json('ALIVE');
});

server.get('/greet', (req, res) => {
  res.json({ hello: 'stranger' })
});

// server.get('/api/users', (req, res) => {
//   console.log(req.query);
//   res.send('done');
// })
server.get('/api/users', (req, res) => {
  console.log(req.query);
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "We failed you, can't get the users", error: err });
    });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "We failed you, can't get the user", error: err })
    })
})

server.post('/api/users', async (req, res) => {
  console.log('body:', req.body);
  try {
    const userData = req.body;
    const userId = await db.insert(userData);
    const user = await db.findById(userId.id);
    res.status(201).json(user);
  } catch (error) {
    let message = 'error creating the user';
    if (error, errno === 19) {
      message = 'please provide both the name and the bio';
    }
    res.status(500).json({ message, error });
  }
});

server.put('/api/users/:id', (req, res) => {
  console.log(res)
  const { id } = req.params;
  const changes = req.body;
  db.update(id, changes)
    .then(count => {
      if (count) {
      res.status(200).json({ message: `user ${count} was updated`});
    } else {
      res.status(404).json({ message: 'user not found' });
    }
    })
    .catch(error => {
      res.status(500).json({ message: 'error updating the user!!!!', error })
    });
});

server.delete('/api/users/:id', (req, res) => {
  db.remove(req.params.id)
    .then(count => {
      res.status(200).json(count);
    })
    .catch(err => {
      res.status(500).json({ message: 'error deleting user', err });
    });
});

server.get('/greet/:person', greeter);

const port = 9000;
server.listen(port, () => console.log(`\n *===the server is alive on port ${port}!===* \n`));