const mongoose = require('mongoose'); // on importe mongoose

const uniqueValidator = require('mongoose-unique-validator'); // on importe le module qu'on utilisera ensuite pour implémenter l'authentification par email unique

// avec la méthode « schema » de mongoose, on créé le schéma de données en accord avec les champs requis par l’application front-end. L’_id sera généré automatiquement par le BDD, pas la peine de le mettre dans le schéma :
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, //la clé est de type string, le champ est requis et on ajoute une condition "unique: true" qui fait que le même email ne peut pas être créé plusieurs fois. 
    password: { type: String, required: true },
  });

userSchema.plugin(uniqueValidator); //on applique au schéma user le plugin uniqueValidator en utilisant la méthode "plugin" et pour argument le plugin a appliquer. 

// pour pouvoir utiliser ce schéma dans d’autres fichiers, grâce à la méthode « model » de mongoose on va l’exporter : 
module.exports = mongoose.model('User', userSchema);