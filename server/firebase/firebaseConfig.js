const admin = require("firebase-admin");
const {
  firebaseDatabaseUrl,
  firebaseServiceAccount,
} = require("../config/runtime");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
    databaseURL: firebaseDatabaseUrl,
  });
}

const getDatabase = () => admin.database();

module.exports = getDatabase;
