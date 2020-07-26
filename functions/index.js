// Importacion de estructuras
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");




// Requerimiento de middlewares
const cors = require("cors");
const bodyParser = require("body-parser");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const csrf = require("csurf");

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hola, mundo desde funciones");
});

var serviceAccount = require("./keys/serviceAccountKey.json");
const {
  beforeSnapshotConstructor,
} = require("firebase-functions/lib/providers/firestore");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://labodegabebidas.firebaseio.com",
});

const db = admin.firestore();


//=================================================
// Mercado Pago
//=================================================
var mp = express();

const PaymentController = require("./controllers/PaymentController");
 //importamos el controller

const PaymentService = require("./services/PaymentService"); 
//importamos el service

const PaymentInstance = new PaymentController(); 
// Permitimos que el controller pueda usar el service

mp.use(logger('dev'));
mp.use(express.json());
mp.use(express.urlencoded({ extended: false }));
mp.use(cookieParser());
mp.use(express.static(path.join(__dirname, 'public')));

mp.post("/payment/new", (req, res) => 
  PaymentInstance.getMercadoPagoLink(req, res) 
);

mp.post("/webhook", (req, res) => PaymentInstance.webhook(req, res)); 

exports.mp = functions.https.onRequest(mp);



