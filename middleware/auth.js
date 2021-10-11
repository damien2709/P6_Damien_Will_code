/*
1: Vérification que l'utilisateur qui fait la requête est bien celui qui est dans la base de données, 
2: Sécurisation des différentes routes de l'application
*/
const jwtoken = require('jsonwebtoken'); 

// Paramétrage de l'authentification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; 
    const decodedToken = jwtoken.verify(token, process.env.KEYTOKEN); 
    const userId = decodedToken.userId; 
    if (req.body.userId && req.body.userId !== userId) {
      throw res.statut(403); 
    } 
    else {
      next();
    }
  } 
  catch {
    res.status(401).json({
      error: new Error('Requête invalide !')
    });
  }
};
