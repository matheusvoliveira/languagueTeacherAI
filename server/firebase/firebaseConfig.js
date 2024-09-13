const admin = require('firebase-admin');
const serviceAccount = require('../config/nathan-stripe-firebase-adminsdk-ixj3e-0acfd9b6fa.json');

// Verifique se o Firebase já foi inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nathan-stripe.firebaseio.com", // Insira o seu databaseURL aqui
  });
}

// Cria e exporta uma função que retorna a referência do banco de dados
const getDatabase = () => admin.database();

module.exports = getDatabase;
