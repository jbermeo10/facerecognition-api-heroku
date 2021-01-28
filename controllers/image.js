const Clarifai = require('clarifai');

// You must add your own API key here from Clarifai
let app = new Clarifai.App({apiKey: process.env.API_CLARIFAI});

const handleApiCall = (req, res) =>{
    app.models
        .predict({ id: 'd02b4508df58432fbb84e800597b8959' }, req.body.input)
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(400).json(`No se pudo conectar a Clarifai API: ${err}`))
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         user.entries++;
    //         return res.json(user.entries);
    //     }
    // })
    // if(!found) {
    //     res.status(404).json('id de usuario no registrado en la db');
    // }
    
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json(`se obtuvo el siguiente error: ${err}`))
}

module.exports = {
    handleImage,
    handleApiCall
}