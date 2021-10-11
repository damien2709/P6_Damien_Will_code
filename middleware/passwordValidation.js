const passwordSchema = require("../models/modelPassword"); 

//module (middleware) de vérification de password. 
module.exports = (req, res, next) => {
    if(!passwordSchema.validate(req.body.password)){
        res.status(400).json({ error : "Mot de passe non valide : " + passwordSchema.validate(req.body.password, {list : true})}); // 
    }
    else{
        next();
    }
}