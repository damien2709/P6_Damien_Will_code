//ON TRAITE ICI LES LOGIQUES METIER APPLIQUÉES AUX UTILISATEURS

const User = require('../models/modelUser'); 

const bcrypt = require('bcrypt'); 

const jwtoken = require('jsonwebtoken');

require('dotenv').config(); 

//on va créer et exporter la fonction "signup" pour l'enregistrement de nouveaux utilisateurs. 
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //fonction pour hascher le mot de passe
        .then(hash => {
            const user = new User ({
                email: req.body.email,
                password: hash
            }); 
            user.save() 
                .then(() => res.status(201).json({ message: "utilisateur créé !" })) 
                .catch(error => res.status(400).json({ error }))       
        }) 
        .catch(error => res.status(500).json({ error })); 
};

//on va créer et exporter la fonction "login" pour connecter des utilisateurs existants. 
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            }
            else{ 
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if(!valid){
                            return res.status(401).json({ error: 'Mot de passe incorrect !' });
                        }
                        res.status(200).json({
                            userId: user._id,
                            token : jwtoken.sign({userId: user._id}, process.env.KEYTOKEN, {expiresIn: '24h'})
                        });
                    })
                    .catch(error => res.status(500).json({ error})); 
            }
        })
        .catch(error => res.status(500).json({ error })); 
};