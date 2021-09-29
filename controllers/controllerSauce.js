//ON TRAITE ICI LES LOGIQUES METIER APPLIQUÉES AUX SAUCES 

//comme on va utiliser le modèle modelSauce dans cette page, on l'importe ! J'importe le modele  qui sert à implémenter un modèle de sauce dans la BDD. Attention : c'est le fichier dans le dossier models (il se nomme modelSauce.js)que l'on importe
const Sauce = require('../models/modelSauce'); 

// on va importer le package "fs" de nodeJS, qui nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
const fs = require('fs');

//LOGIQUE MéTIER POUR CRéER UN ARTICLE : pour chaque POST envoyé (donc une sauce), on va créer un "modèle" sauce (thing) que l'on va enregistrer dans la BDD. Tout ça sera encapsulé dans une fonction "createThing" qu'on exportera pour l'utiliser ailleurs. Le nom de la fonction doit expliquer clairement son rôle !
exports.createSauce = (req, res, next) => {
  //•	Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data, et non sous forme de JSON. Le corps de la requête contient une chaîne sauce , qui est simplement un objet Sauce converti en chaîne. Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.
  const sauceObject = JSON.parse(req.body.sauce);    
  delete sauceObject._id; // IMPORTANT : L'api front end envoie un ID comme champ dans le body de la requête, on n'en n'a pas besoin, le vrai id sera généré par la BDD, donc on l'enlève. 
    const sauce = new Sauce({
      userId :  sauceObject.userId,
      name : sauceObject.name,
      manufacturer : sauceObject.manufacturer,
      description :  sauceObject.description,
      mainPepper :  sauceObject.mainPepper,
      heat : sauceObject.heat,
      likes : "0", //j'initialise le compteur like à 0
      dislikes : "0",  //j'initialise le compteur dislike à 0
      usersLiked : [], //je crée le tableau qui comprendra les users qui likent
      usersDislikes : [], //je crée le tableau qui comprendra les users qui dislikent

//un raccourci javascript pour les lignes du dessus . on aurait utilisé l'opérateur "spread" :  const sauce = new Sauce ({...req.body});.

 //Comme le fichier image est traité par le middleware de Multer et que ce dernier lui attribue un nom de fichier et une extension, on utiliser une construction dynamique pour l'URL avec des backticks : on commence par le protocole (http, https), puis le host de notre serveur (localhost, nom de domaine), puis le chemin du fichier avec son nom et son extension.
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
      // on va enregistrer l'objet (la sauce) dans le BDD. La méthode save renvoie une promesse. 
      sauce.save()
        // on doit renvoyer une réponse à l'appli frontend sinon on aura l'expiration de la requête !
        .then(
          () => res.status(201).json({message : 'sauce enregistrée'})) // on envoie un statut et un message en json. 
        .catch(error => res.status(400).json({ error})); // on récupère l'erreur et on renvoie un code 400 puis un message d'erreur dans un objet. "error" est un raccourci JS qui veut dire : (error : error) 
};

//LOGIQUE MéTIER POUR MODIFIER UNE SAUCE : La fonction "updateSauce" pour une requête de type PUT permettant de modifier, mettre à jour un article identifié par son ID dans la BDD. Nous devons d'abord savoir si le user a modifié le fichier image ou pas (car si oui on aura un objet form-data, si non on aura un objet json). On cherche donc à savoir s'il y a un fichier dans la requête. Ensuite, nous utilisons la méthode updateOne() dans notre modèle/classe "Sauce"  pour modifier la sauce unique ayant le même _id que le paramètre de la requête ; La méthode updateOne() renvoie une promesse. Elle prend 2 arguments : le 1er est l'objet de comparaison donc on récupère l'id des paramètres de route, le 2ème argument est le nouvel objet ou sa nouvelle version (on utilise le spread operator).
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? //ici on utilise l'opérateur ternaire pour savoir si req.file existe (donc s'il y a un fichier dans la requête). S'il existe on aura un type d'objet (form-data) et si non un autre type d'objet (json). On résout l'équation de la sorte "{form-data} : {json}", ce qui veut dire si oui 1er objet, si non, 2ème objet. 
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }))
};

//LOGIQUE MéTIER POUR SUPPRIMER UNE SAUCE : la fonction "deleteSauce" pour une requête de type DELETE permettant de supprimer une sauce identifiée par son ID dans la BDD.Nous utilisons la méthode deleteOne() dans notre modèle/classe "Sauce" (QUI EST UN FICHIER "Sauce" DANS LA BDD !)pour modifier la sauce unique ayant le même _id que le paramètre de la requête ; La méthode updateOne() renvoie une promesse. Elle prend 1 argument : l'objet de comparaison.
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //on va chercher le fichier dont l'ID correspond à celle de la requête.
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];// on récupère l'url du fichier de l'objet qu'on splite après la partie /images/ pour récupérer le nom du fichier. Le split retourne un tableau de 2 éléments, on garde le 2ème élément qui a l'index 1 et qui est le nom du fichier.
      //ensuite on utilise la méthode unlink de fs (pour supprimer un fichier attaché à un objet). elle prend en 1er argument la chaine de caractères correspondant au chemin du fichier, en 2ème argument une fonction de callback qui sera ici la suppression de l'objet Thing de la BDD. 
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error })); // erreur serveur
};

//LOGIQUE MéTIER POUR LIRE UNE SAUCE UNIQUE : je veux renvoyer une sauce unique identifiée par son ID (créé par la BDD lors de la requête POST). Nous utilisons la méthode findOne() dans notre modèle/classe "Sauce" (QUI EST UN FICHIER "Sauce" DANS LA BDD !) pour trouver la sauce unique ayant le même _id que le paramètre de la requête ; La méthode findOne() renvoie une promesse. Elle prend comme argument l'objet de comparaison donc on récupère l'ID des paramètres de route.
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // on remarque ici l'utilisation de la méthode params de l'objet requête
        .then(thing => res.status(200).json(thing)) // on renvoie le code de la réponse et le thing demandé
        .catch(error => res.status(404).json({ error }));
};

//LOGIQUE MéTIER POUR LIRE TOUTES LES SAUCES : je veux renvoyer la liste complète des sauces, donc j'utilise la méthode find du modèle "Sauce"  La méthode find renvoie une promesse. 
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces)) //ici on renvoie en réponse un code et le tableau appelé "things" renvoyé par la BDD qui contient la liste de toutes les sauces
      .catch(error => res.status(400).json({error}));
};