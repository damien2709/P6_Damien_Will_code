// ON CREE LE ROUTEUR QUI GERERA LES ROUTES POUR LES UTILISATEURS

const express = require('express'); 
const router = express.Router(); 

const passwordSchema = require("../middleware/passwordValidation");

const userCtrl = require('../controllers/controllerUser');

router.post('/signup', passwordSchema, userCtrl.signup); // la route pour l'enregistrement de nouveaux utilisateurs
router.post('/login', userCtrl.login); // la route pour connecter les utilisateurs déjà enregistrés


module.exports = router; 