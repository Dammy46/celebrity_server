const handleRegister = (req, res, bcrypt, db) => {
     const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('information required before registering ');
  } 

  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into('logins')
      .returning('email')
      .then((loginsEmail) => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginsEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    res.status(404).json('unable to register');
  });
};

module.exports = {
  handleRegister: handleRegister,
};
