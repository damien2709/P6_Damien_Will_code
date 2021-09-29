//IMPORTS
  //Modules
  const express = require('express'); //on importe module Express
  const mongoose = require('mongoose'); //on importe module mongoose
  const path = require('path'); //on importe le module Path pour pouvoir accèder au système de fichiers du serveur

    //Fichiers
  const routesSauces = require('./routes/routesSauces'); //on importe le router qui gère les routes pour les articles
  const routesUser = require('./routes/routesUser'); //on importe le router qui gère les routes pour les utilisateurs
  
  // CONNEXION BDD
  mongoose.connect('mongodb+srv://damien_will:mOXvPWqULIRUoDyL@cluster0.qhmuf.mongodb.net/Cluster0?retryWrites=true&w=majority',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
  
  //CREATION APP EXPRESS
  const app = express(); //on créé une application Express en appelant la méthode « express »
  
  //HEADERS
  // le 1er middleware va instaurer des headers pour passer la sécurité CORS et permettre aux applis extérieures et navigateurs de communiquer et échanger avec l'appli API
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      next();
    });
  
  //FONCTIONNALITES EXPRESS
  //le 2ème middleware introduit la fonction json de express qu'on pourra appeler pour traduire tout objet json en javascript pour tout type de requête (remplace body-parser dans la nouvelle version express)
  app.use(express.json());
  
  //ROUTES 
    //logique de routes : On enregistre avec app.use les routes attendus par le frontend. On remet le début de la route en 1er argument et en 2ème argument le nom de la constante représentant le routeur concerné.
  app.use('/api/auth', routesUser); //ici on gère l'indicatif des routes pour les utilisateurs (envoyé par l'appli frontend) et le routeur concerné
    
  app.use('/api/sauces', routesSauces); //ici on gère l'indicatif des routes pour les articles (envoyé par l'appli frontend) et le routeur concerné.
  
  //La route pour les fichiers est un peu différente. EN 2ème argument on indique la destination pour enregistrer les fichiers.
  app.use('/images', express.static(path.join(__dirname, 'images'))); //ici gère les requêtes qui arriveront sur la route (/images) pour les fichiers image (envoyés par l'appli frontend). On utilise la méthode static() de express pour indiquer que la destination du fichier sera un dossier statique. La méthode prend en argument le chemin du dossier, qui doit être dynamique. On créé donc le chemin en utilisant la méthode join() de Path (qu'on a importé), cette méthode prend un argument qui est composé du nom du dossier des fichiers du serveur, puis notre dossier "images". 
  
  //EXPORT
  module.exports = app; // on exporte l’application (constante) pour que l’on puisse y accéder depuis les autres fichiers. 