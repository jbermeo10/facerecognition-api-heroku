const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('No se permite datos en blanco');
    }
    // Adding a user to database.users array
    // database.users.push({
    //     id: '125',
    //     name: name,
    //     email: email,
    //     password: password,
    //     entries: 0,
    //     joined: new Date()
    // })
    // res.json(database.users[database.users.length-1]);

    // Asynchronous way
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash)
    // });

    // Synchronous way
    const hash = bcrypt.hashSync(password);
    // bcrypt.compareSync("bacon", hash); // true
    // bcrypt.compareSync("veggies", hash); // false
    
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginemail => {
            return trx('users')
            .returning('*')
            .insert({
                name: name,
                email: loginemail[0],
                joined: new Date()
            })
            .then(newuser => {
                res.json(newuser[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json(`error de registro el cual es: ${err}`))
}

module.exports = {
    handleRegister: handleRegister
}