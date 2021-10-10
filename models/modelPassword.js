const passwordValidator = require("password-validator")

const passwordSchema = new passwordValidator();

//mise en place des règles pour le mot de passe
passwordSchema
.is().min(8) //contient au minimum 8 caractères
.has().uppercase() //contient au minimum 1 majuscule
.has().lowercase() //contient au minimum 1 minuscule
.has().digits() //contient au minimum 1 chiffre
.has().symbols() //contient au minimum un symbole
.has().not().spaces() //ne contient pas d'espaces 
.is().not().oneOf(['Passw0rd', 'Password123']) //refuse ces mots de passe

module.exports = passwordSchema;