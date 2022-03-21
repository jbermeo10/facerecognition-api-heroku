const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('No se permite datos en blanco');
    }
    
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