const mongoose = require('mongoose'); 

const uniqueValidator = require('mongoose-unique-validator'); 

//modèle de user implémenté dans la BDD
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
  });

userSchema.plugin(uniqueValidator); 

module.exports = mongoose.model('User', userSchema);