import * as express from 'express'
import * as path from 'path'
import * as admin from 'firebase-admin'

var serviceAccount = require("./private-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testproj-44bd1.firebaseio.com"
});

let app = express()

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
})

app.use('/js', express.static(path.resolve(__dirname, 'public/js')))

app.use((req, res, next) => {
  let auth: string = req.headers.authorization as string
  if ((!req.headers.authorization || !auth.startsWith('Bearer '))) {
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && auth.startsWith('Bearer ')) {
    idToken = auth.split('Bearer ')[1];
  }
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    res.locals.user = decodedIdToken;
    next();
  }).catch(error => {
    res.status(403).send('Unauthorized');
  });
})

app.get('/users', (req, res) => {
  res.status(200).send('Access granted')
})

app.get('/user/:id', (req, res) => {

})

app.listen(3001)
