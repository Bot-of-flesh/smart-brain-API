const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password} = req.body;
    if(!name || !email || !password){
         return res.status(400).json('incorrect form submission');
    }
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user => res.json(user[0]))
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
   
    .catch(err => res.status(400).json('unalbe to register'));
}


export default handleRegister;