const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        // comentar ssl para conexiones locales
        ssl: {
            rejectUnauthorized: false
        }
    }
  });

const app = express();
app.use(bodyParser.json());
app.use(cors());

/* BACKEND PLANNING
    / --> res = this is working (root route), now return users database
    /signin --> POST = success/fail (because we're posting some data, user info)
    /register --> POST = user (sending new user info)
    /profile/:userId --> GET = user
    /image --> PUT --> user (because we're updating a score and user already exists)
*/

app.get ('/', (req, res) => {
    // res.send(database.users)
    res.send('server de la aplicacion trabajando adecuadamente!')
})

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

// Creado para borrar usuarios por id
app.delete('/deleteuser', (req, res) => {
    const { id } = req.body;
    db('users').where('id', id)
    .del()
    .returning('*')
    .then(deletedUser => {
        res.json(deletedUser[0])
    })
    .catch(err => res.status(400).json(`se obtuvo el siguiente error: ${err}`))
})

const PORT = process.env.PORT
// const PORT = 3000
app.listen(PORT, () => {
    console.log(`la aplicacion face-recognition esta corriendo en el puerto ${PORT}`);
})

// console.log(process.env)
