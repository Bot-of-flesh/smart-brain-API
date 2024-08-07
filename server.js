import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';
import register from './controllers/register.js';
import signin from './controllers/signin.js';
import image from './controllers/image.js'

const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DBurl,
      ssl:{rejectUnauthorized: false},
      host: process.env.DBhost,
      port: 5432,
      user: process.env.DBuser,
      password: process.env.DBpw,
      database: process.env.DBname,
    },
  });

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('success');
})

app.post('/signin', (req, res) => {signin(req, res, db, bcrypt)});

app.post('/register', (req, res) => {register(req,res, db, bcrypt)});

app.get('/profile/:id', (req, res) => {profile(req, res, db)});

app.put('/image', (req, res) => {image.handleImage(req, res, db)});

app.post('/imageURL', (req, res) => {image.handleApiCall(req, res)});

app.listen(process.env.port || 3000, () => {
    console.log(`app is running on port ${process.env.port}`)
});
