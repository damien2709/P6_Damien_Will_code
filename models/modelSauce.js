const mongoose = require('mongoose'); // on importe mongoose
// avec la méthode « schema » de mongoose, on créé le schéma de données en accord avec les champs requis par l’application front-end. L’_id sera généré automatiquement par le BDD, pas la peine de le mettre dans le schéma :

const saucesSchema = mongoose.Schema({
  userId: { type: String, required: true }, //l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
  name: { type: String, required: true }, //la clé est de type string, le champ est requis. Nom de la sauce.
  manufacturer: { type: String, required: true }, //fabricant de la sauce.
  description: { type: String, required: true }, //description de la sauce.
  mainPepper: { type: String, required: true }, //le principal ingrédient épicé de la sauce.
  imageUrl: { type: String, required: true }, //l'URL de l'image de la sauce téléchargée par l'utilisateur.
  heat: { type: Number, required: true },//nombre entre 1 et 10 décrivant la sauce.
  likes: { type: Number, required: true },//nombre d'utilisateurs qui aiment (= likent) la sauce.
  dislikes: { type: Number, required: true },//nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce
  usersLiked: {type: String},//[ "String <userId>" ]— tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce.
  usersDisliked: {type: String},//[ "String <userId>" ]— tableau des identifiants des utilisateurs qui n'ont pas aimé (= liked) la sauce.
});

// pour pouvoir utiliser ce schéma dans d’autres fichiers, grâce à la méthode « model » de mongoose on va l’exporter : 
module.exports = mongoose.model('Sauces', saucesSchema);