//IMPORTS
  const express = require('express'); 
  require('dotenv').config(); 
  const mongoose = require('mongoose'); 
  const path = require('path'); 
  const helmet = require("helmet"); 
  const rateLimit = require("express-rate-limit"); 
 
  const routesSauces = require('./routes/routesSauces'); 
  const routesUser = require('./routes/routesUser'); 

  // CONNEXION BDD
  mongoose.connect(`mongodb+srv://${process.env.CONNECTBDDNAME}:${process.env.CONNECTBDDPW}@cluster0.qhmuf.mongodb.net/${process.env.CONNECTBDDPROJECT}?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
  
  //CREATION APP EXPRESS
  const app = express(); 
  
  // Paramétrage de la limite de requêtes vers le serveur 
  const limiter = rateLimit({
    max: 100, //max 100 requêtes
    windowMs: 15 * 60 * 1000, // 15 mn (15x60 000ms)
    message: "Trop de requêtes depuis cette IP"
});

app.use(limiter);

  //paramétrage spécifique des entêtes 

app.use(helmet());
  
  //HEADERS

  app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      next();
    });
  
  //FONCTIONNALITE EXPRESS
  app.use(express.json())
  
  //ROUTES 
  app.use('/api/auth', routesUser) 
    
  app.use('/api/sauces', routesSauces) 
  
  
  app.use('/images', express.static(path.join(__dirname, 'images'))) 

  //EXPORT
  module.exports = app; 