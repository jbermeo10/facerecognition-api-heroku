const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('No se permite datos en blanco');
    }
    // // Load hash from your password DB.
    // bcrypt.compare("apples", '$2a$10$WKrBJJXWHUDXK5GtaY6aI.KDSYop8TomZXLKneCqI5Nm6eFRNMO6y', function(err, resp) {
    //     // res == true
    //     console.log('first guess', resp);
    // });
    // bcrypt.compare("veggies", '$2a$10$WKrBJJXWHUDXK5GtaY6aI.KDSYop8TomZXLKneCqI5Nm6eFRNMO6y', function(err, resp) {
    //     // res = false
    //     console.log('second guess', resp);
    // });

    // Checking again every single user within database.users array
    // let found = false;
    // database.users.forEach((user) => {
    //     if (user.email === req.body.email) {
    //         found = true;
    //         if (user.password === req.body.password) {
    //             console.log('acceso exitoso');
    //             return res.json(user);
    //         } else {
    //             return res.status(400).json('contraseña incorrecta');
    //         }
    //     }
    // })
    // if(!found) {
    //     res.status(404).json('usuario no registrado en la db');
    // }
    // 
    // Checking just again the first user 'John'
    // if (req.body.email === database.users[0].email &&
    //     req.body.password ===  database.users[0].password) {
    //         console.log('acceso exitoso');
    //         res.json(database.users[0]);
    //     } else {
    //         res.status(400).json('error datos incorrectos');
    //     }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            // console.log(isValid);
            if (isValid){
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        // console.log(user)
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json(`no se pudo obtener el usuario, error: ${err}`))
            
            } else {
                res.status(400).json(`usuario o contraseña incorrectos, error: ${err}`)
            }
        })
        .catch(err => res.status(400).json(`usuario o contraseña incorrectos, error: ${err}`))
}

module.exports = {
    handleSignin: handleSignin
}