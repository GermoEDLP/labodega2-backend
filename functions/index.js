const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://labodegabebidas.firebaseio.com"
});
const db = admin.firestore();


exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hola, "+request.nombre);
});

//=================================================
// User
//=================================================
const user = express();

user.use(cors({origin: true}));

user.post('/newUser', (req, res) => {

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

user.get('/getUser/:uid', (req, res) => {
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

exports.user = functions.https.onRequest(user);
