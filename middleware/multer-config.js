// Gestion des fichiers envoyés par les utilisateurs. 

const multer = require('multer'); 

//dictionnaire mime_types
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Création de l'objet de configuration pour Multer. 
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); 
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); 
    const extension = MIME_TYPES[file.mimetype]; 
    callback(null, name + Date.now() + '.' + extension); 
  }
});

module.exports = multer({storage: storage}).single('image'); 