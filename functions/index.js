const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hola, mundo desde funciones");
// });

var serviceAccount = require("./serviceAccountKey.json");
const {
  beforeSnapshotConstructor,
} = require("firebase-functions/lib/providers/firestore");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://labodegabebidas.firebaseio.com",
});

const db = admin.firestore();

//=================================================
// Usuario
//=================================================
const user = express();
user.use(cors({ origin: true }));

user.use(bodyParser.urlencoded({ extended: false }));
user.use(bodyParser.json());

user.post("/login", (req, res) => {
  let body = req.body;

  admin
    .auth()
    .getUserByEmail(body.email)
    .then((user) => {
      res.json({
        user,
      });

      admin
        .auth()
        .createCustomToken(user.uid)
        .then((token) => {});
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
});

user.post("/newUser", (req, res) => {
  admin
    .auth()
    .createUser({
      email: "german@example.com",
      emailVerified: false,
      phoneNumber: "+5492215220891",
      password: "123456",
      displayName: "German Brassini",
      disabled: false,
    })
    .then((nuevoUsuario) => {
      res.status(200).json({
        ok: true,
        nuevoUsuario,
      });
    })
    .catch((error) => {
      res.status(400).json({
        ok: false,
        error,
      });
    });
});

user.get("/getUser/:uid", (req, res) => {
  const uid = req.params.uid;

  admin
    .auth()
    .getUser(uid)
    .then((user) => {
      res.status(200).json({
        ok: true,
        user: user,
      });
    })
    .catch((err) => {
      res.status(400).json({
        ok: true,
        err: err,
      });
    });
});

exports.user = functions.https.onRequest(user);

//=================================================
// Productos
//=================================================
const product = express();
product.use(cors({ origin: true }));

product.use(bodyParser.urlencoded({ extended: false }));
product.use(bodyParser.json());

product.post("/newProd", (req, res) => {
  let body = req.body;

  const docRef = db.collection("products").doc();

  const data = {
    name: body.name,
    description: body.description,
    price: body.price,
    stock: body.stock,
    demand: body.demand,
    image: body.image,
  };

  docRef.set(data).then((resp) => {
    res.status(200).json({
      ok: true,
      resp,
    });
  });
});

product.get("/getAll", (req, res) => {
  

  db.collection("products")
    .get()
    .then((snapshot) => {

      let coleccion = [];

      snapshot.forEach((doc) => {
        coleccion.push(doc.data());
      });
      res.status(200).json({
        ok: true,
        coleccion,
      });
    })
});

exports.products = functions.https.onRequest(product);
