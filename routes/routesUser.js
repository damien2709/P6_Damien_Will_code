// ON CREE LE ROUTEUR QUI GERERA LES ROUTES POUR LES UTILISATEURS

const express = require('express'); 
const router = express.Router(); 
const passwordSchema = require("../middleware/passwordValidation");
const userCtrl = require('../controllers/controllerUser');

router.post('/signup', passwordSchema, userCtrl.signup); 
router.post('/login', userCtrl.login); 


module.exports = router; 