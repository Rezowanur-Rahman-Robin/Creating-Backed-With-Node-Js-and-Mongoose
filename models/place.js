const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placesSchema = new Schema({
    title:{type: String , required : true},
    description: {type: String, required: true},
    image: {type: String , required : true },
    address: {type: String, required: true},
    location : {
        lat: { type: Number, required: true},
        lng:{type: Number, required: true},
    },
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});


module.exports = mongoose.model('Place', placesSchema);//here, model(a name, schema) ; the name should be start with uppercase and singular.Inside database it will convert into lowercase and plural forms.
