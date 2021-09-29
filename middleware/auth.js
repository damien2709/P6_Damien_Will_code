const jwtoken = require('jsonwebtoken'); //on importe le module jsonwebtoken

// on va créer et exporter le middleware suivant, responsable de la validation du token et de l'userID envoyés par l'appli frontenddans sa requête.  On utilise try et catch. 
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // on va chercher le header "autorization" de le requête envoyée par l'appli frontend. Il va nous renvoyer un tableau. On va spliter ce tableau (bearer en index [0] et le token en index [1]) pour ne récupérer que le token donc l'index [1]. 
    const decodedToken = jwtoken.verify(token, 'RANDOM_TOKEN_SECRET'); // on va décoder le token. On utilise la méthode "verify" du package jsonwebtoken qui prend en 1er argument le token et en 2ème la clé secrète paramétrée dans le controller user, dans la fonction "login".  
    const userId = decodedToken.userId; //on récupère le userID qui était dans le token
    // On va ensuite vérifier que l'userID de la requête correspond bien à celui qui est dans le token. Si on a un userID dans le corps de la requête et si ce userID est différent du userID, alors on retournera une erreur. On utilise "throw" pour renvoyer l'erreur vers le catch. Et si tout va bien (else), on passera au prochain middleware grace à next().
    if (req.body.userId && req.body.userId !== userId) {
      throw 'ID Utilisateur invalide !';
    } else {
      next();
    }
  } 
  // s'il des erreurs surviennent dans les opérations ci-dessus, le bloc catch va les capter, évitant ainsi de bloquer la requête. 
  catch {
    res.status(401).json({
      error: new Error('Requête invalide !')
    });
  }
};
