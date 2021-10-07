//ON TRAITE ICI LES LOGIQUES METIER APPLIQUÉES AUX UTILISATEURS

const User = require('../models/modelUser'); //on importe le fichier modèle "user"

const bcrypt = require('bcrypt'); //on importe le module de hashage Bcrypt pour la sécurité du mot de passe

const jwtoken = require('jsonwebtoken');

//on va créer et exporter la fonction "signup" pour l'enregistrement de nouveaux utilisateurs. On va en 1er, hascher le mot de passe (fonction asynchrone qui prend du temps), puis ensuite avec le hasch créé, on va remplacer le mot de passe créé par l'utilisateur et on va enregistrer le user dans la BDD:
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //fonction pour hascher le mot de passe, avec en 1er argument le mot de passe du corps de la requête qui sera passé par le frontend, puis en 2ème argument le nb de fois qu'on exécute l'algorithme de haschage. La fonction est asynchrone et renvoie une promesse. 
        .then(hash => {
            const user = new User ({
                email: req.body.email,
                password: hash
            }); 
        //on créé un nouvel utilisateur avec le modèle Mongoose, on remplace le password par le hash créé. 
            user.save() //on enregistre l'utilisateur (fonction asynchrone)
                .then(() => res.status(201).json({ message: "utilisateur créé !" })) // si je colle la réponse de statut de la réponse avec, ça ne marche pas! L'API ne s'y attend pas ?
                .catch(error => res.status(400).json({ error }))       
        }) 
        .catch(error => res.status(500).json({ error })); // on récupère l'erreur et on renvoie un code 500 (pb de serveur) puis un message d'erreur dans un objet. "error" est un raccourci JS qui veut dire : (error : error) 
};

//on va créer et exporter la fonction "login" pour connecter des utilisateurs existants. On va utiliser la méthode findOne() de notre modèle/classe Mongoose "User" (QUI EST UN FICHIER "USER" DANS LA BDD !) pour trouver un seul utilisateur de la BDD. Pour trouver l'utilisateur avec son email unique, on recherche dans le fichier ""User" de la BDD le user qui a le même email que celui fourni dans la requête. La méthode renvoie une promesse. 
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        // on doit vérifier si on a un résultat (trouvé un user existant dans la BDD)
        .then(user => {
            if(!user){
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            }
            //si on a un user, on va comparer le mot de passe de la requête avec celui du user dans la BDD (qui est hasché). On utilise la méthode "compare()" de bcrypt. La fonction retourne une promesse dont la valeur de retour est un boolean. Si la valeur est false, on va renvoyer un message d'erreur, si c'est ok, on va créer et renvoyer un objet user comprenant l'ID et un token généré par jsonwebtoken grace à sa méthode sign() qui prend comme 1er argument les données que l'on veut encoder (le payload), comme 2ème argument la clé secrète pour l'encodage, comme 3ème argument un délai d'expiration.
            else{ 
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if(!valid){
                            return res.status(401).json({ error: 'Mot de passe incorrect !' });
                        }
                        res.json({
                            userId: user._id,
                            token : jwtoken.sign({userId: user._id}, 'RANDOM_TOKEN_SECRET', {expiresIn: '24h'})
                        });// si je colle la réponse de statut de la réponse avec, ça ne marche pas!
                    })
                    .catch(error => res.status(500).json({ error})); //si erreur serveur
            }

        })// on renvoie le code de la réponse et le user demandé

        .catch(error => res.status(500).json({ error })); // si on a un problème de connexion seulement car Mongoose va déjà nous dire s'il n'a pas trouvé de user. 
};