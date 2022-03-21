const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('No se permite datos en blanco');
    }

    const hash = bcrypt.hashSync(password);
    
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