// ON CREE LE ROUTEUR QUI GERERA LES ROUTES POUR LES UTILISATEURS

const express = require('express'); //on aura besoin d'express et de ses fonctions pour créer le router donc on l'importe.
const router = express.Router(); // on créé un routeur avec la méthode Routeur() de Express.

//on importe le controller "user" (qui gère les logiques métier concernant les utilisateurs) défini dans le fichier user.js du dossier controllers
const userCtrl = require('../controllers/controllerUser');

router.post('/signup', userCtrl.signup); // la route pour l'enregistrement de nouveaux utilisateurs
/*router.post('/login', userCtrl.login); */ // la route pour connecter les utilisateurs déjà enregistrés


module.exports = router; //on exporte le router de ce fichier.