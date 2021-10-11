//ON TRAITE ICI LES LOGIQUES METIER APPLIQUÉES AUX SAUCES 

const Sauce = require('../models/modelSauce'); 

const fs = require('fs');

//POST : LOGIQUE MéTIER POUR CRéER UN ARTICLE : pour chaque POST envoyé (donc une sauce), on va créer un "modèle" sauce (thing) que l'on va enregistrer dans la BDD. 
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);    
  delete sauceObject._id; 
    const sauce = new Sauce({
      userId :  sauceObject.userId,
      name : sauceObject.name,
      manufacturer : sauceObject.manufacturer,
      description :  sauceObject.description,
      mainPepper :  sauceObject.mainPepper,
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //construction dynamique pour l'URL 
      heat : sauceObject.heat,
      likes : 0, //j'initialise le compteur like à 0
      dislikes : 0,  //j'initialise le compteur dislike à 0
      usersLiked: [],//je crée le tableau vide des users qui vont liker
      usersDisliked: [] //je crée le tableau vide des users qui vont disliker
  });
      // on va enregistrer l'objet (la sauce) dans le BDD. 
      sauce.save()
        .then(() => res.status(201).json({message : 'sauce enregistrée'}))
        .catch(error => res.status(400).json({ error})); 

};

//PUT : LOGIQUE MéTIER POUR MODIFIER UNE SAUCE : La fonction "updateSauce" pour une requête de type PUT permettant de modifier, mettre à jour un article identifié par son ID dans la BDD. 
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) 
    .then(sauce => {
      if(req.file){
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`../images/${filename}`, () => {
          const sauceObject = {...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`};
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée !'})) 
          .catch(error => res.status(400).json({ error }))
          
        })
      }
      else{
        const sauceObject = {...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée !'})) //si j'ajoute le code de statut Ca ne fonctionne pas !
          .catch(error => res.status(400).json({ error }))
      }
  })
}

//POST : LOGIQUE MéTIER POUR AJOUTER OU MODIFIER les likes d'une SAUCE
exports.manageLike = (req, res, next) => {
  const userVote = req.body.userId; 
  Sauce.findOne({_id : req.params.id})
    .then(sauce => {
      if(req.body.like == 1){
          Sauce.updateOne(
            { _id: req.params.id }, 
            { $push: {usersLiked : req.body.userId}, $inc : {likes: +1} } 
          )
            .then( ()=> res.status(201).json({ message: 'Like pris en compte'}))
            .catch(error => res.status(400).json({ error }));
      }
      
      if(req.body.like == -1){
        Sauce.updateOne(
          { _id: req.params.id }, 
          { $push: {usersDisliked : userVote}, $inc : {dislikes: +1} } 
        )
          .then( ()=> res.status(201).json({ message: 'Dislike pris en compte'}))
          .catch(error => res.status(400).json({ error }));
      }
       
      if(req.body.like == 0){
        if (sauce.usersLiked.includes(userVote)){
          Sauce.updateOne({_id : req.params.id}, {
            $pull : { usersLiked : userVote}, $inc : {likes : -1 } 
          })
            .then(() => res.status(200).json({message : "Like annulé !"}))
            .catch(error => res.status(400).json({error}))
      }
        if (sauce.usersDisliked.includes(userVote)){
          Sauce.updateOne({_id : req.params.id}, {
            $pull : { usersDisliked : userVote}, $inc : {dislikes : -1 }
          })
            .then(() => res.status(200).json({message : "Dislike annulé!"}))
            .catch(error => res.status(400).json({ error }))
        }
      }
        
    })
    .catch(error => res.status(500).json({ error}))
}

//DELETE : LOGIQUE MéTIER POUR SUPPRIMER UNE SAUCE : la fonction "deleteSauce" pour une requête de type DELETE permettant de supprimer une sauce identifiée par son ID dans la BDD.
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) 
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`../images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error })); // erreur serveur
};

//GET : LOGIQUE MéTIER POUR LIRE UNE SAUCE UNIQUE 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) 
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//GET : LOGIQUE MéTIER POUR LIRE TOUTES LES SAUCES 
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces)) 
      .catch(error => res.status(400).json({error}));
};

