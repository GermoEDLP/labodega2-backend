var express = require('express');
const admin = require("firebase-admin");


var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://labodegabebidas.firebaseio.com"
});

var app = express();



app.post('/newUser', (req, res) => {

    admin.auth().createUser({
        email: 'german.brassini@gmail.com',
        emailVerified: false,
        phoneNumber: '+11234567890',
        password: '123456',
        displayName: 'German Brassini'
      })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          res.status(200).json(userRecord);
        })
        .catch(function(error) {
          res.status(400).json(error);
        });

});

app.get('/getUser/:uid', (req, res) => {
    const uid = req.params.uid;

    admin.auth().getUser(uid)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).json({
                message: 'No se encontro el usuario especificado',
                err
            })
        })
});

module.exports = app;