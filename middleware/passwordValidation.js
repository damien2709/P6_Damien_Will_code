const passwordSchema = require("../models/modelPassword"); // Je récupère mon modèle de password défini dans le fichier modelPassword

//on exporte le module (middleware) de vérification de password. SI le password n'est pas valide (donc false avec la méthode validate() de password-validator) on indique que le mot de passe n'est pas validé et on affiche la liste des règles à respecter. SI le password est validé, on passe au middleware suivant. 
module.exports = (req, res, next) => {
    if(!passwordSchema.validate(req.body.password)){
        res.status(400).json({ error : "Mot de passe non valide : " + passwordSchema.validate(req.body.password, {list : true})}); // 
    }
    else{
        next();
    }
}