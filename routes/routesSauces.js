// ON CREE LE ROUTEUR QUI GERERA LES ROUTES POUR LES SAUCES.

const express = require('express'); //on aura besoin d'express et de ses fonctions pour créer le router donc on l'importe.

const router = express.Router(); // on créé un routeur avec la méthode Routeur() de Express.

const auth = require('../middleware/auth'); //on importe le middleware qu'on a crée pour la validation du token et du userID.

const multer = require('../middleware/multer-config'); //on importe notre middleware (multer) qui va gérer le post des fichiers.

//on importe le controller "controllerSauce.js" (qui gère les logiques métier concernant les sauces).
const sauceCtrl = require('../controllers/controllerSauce');

// ROUTE POST = le middleware va traiter les envois de sauces via une requête POST. On fait passer la route post par le router donc : "router.post". En 1er argument, on paramétre la route qui est définie ailleurs (/api/stuff), on laisse juste un slash. En 2ème argument on ajoute le middleware qui va nous permettre de protéger nos routes, (donc "auth"), puis en 3ème argument on appelle le middleware multer pour gérer les fichiers (que pour la route POST ou PUT), en 4ème argumant on appelle la logique métier, donc les instructions à appliquer, à travers le controller "stuffCtrl" auquel on applique la fonction "createThing" créée dans le fichier "controllers/stuff.js". On ne met pas les () à la fonction car on n'est pas en train de l'appeler mais juste de l'appliquer à la route !
router.post('/', auth, multer, sauceCtrl.createSauce); 

//ROUTE POST POUR LES LIKES.
//router.post('/:id/like', auth, sauceCtrl.createLike); 
  
// ROUTE PUT.  
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
    
//ROUTE DELETE.  
router.delete('/:id', auth, sauceCtrl.deleteSauce);
    
// ROUTE GET  pour 1 ID.
router.get('/:id', auth, sauceCtrl.getOneSauce);
    
// ROUTE GET. 
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router; //on exporte le router de ce fichier.