const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controller/register');
const signin = require('./controller/signin');
const profile = require('./controller/profile');
const image = require('./controller/image');



const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
const app = express();
app.use(express.json());


app.use(cors());


app.get('/', (req, res) => {
  res.send("it is working")
})
app.post('/signin', signin.handleSignIn(db, bcrypt)
);
app.post('/register', (req, res) => {register.handleRegister(req, res, bcrypt, db)});

app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)});
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => {
  image.handleAPI(req, res);
});

const port = process.env.PORT
app.listen(port || 3001, () => {
  console.log(`server is running on ${port}` );
});
