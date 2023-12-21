const mongoose = require("mongoose");
const {Schema} = mongoose;
const userSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }, 
    id:{
        type: String,
        required: true
    },
    coin:{
        type: String,
        required: true
    }
})
module.exports = mongoose.model('watchlist',userSchema);