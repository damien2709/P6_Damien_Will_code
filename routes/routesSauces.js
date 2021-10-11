// ON CREE LE ROUTEUR QUI GERERA LES ROUTES POUR LES SAUCES.

const express = require('express'); 

const router = express.Router(); 

const auth = require('../middleware/auth'); 

const multer = require('../middleware/multer-config'); 


const sauceCtrl = require('../controllers/controllerSauce');

// ROUTE POST 
router.post('/', auth, multer, sauceCtrl.createSauce); 

//ROUTE POST POUR LES LIKES.
router.post('/:id/like', auth, sauceCtrl.manageLike); 
  
// ROUTE PUT.  
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
    
//ROUTE DELETE.  
router.delete('/:id', auth, sauceCtrl.deleteSauce);
    
// ROUTE GET  pour 1 ID.
router.get('/:id', auth, sauceCtrl.getOneSauce);
    
// ROUTE GET. 
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router; 