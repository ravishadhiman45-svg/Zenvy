const mongoose = require('mongoose')
const ownerSchema = mongoose.Schema({
    fullname : String,
    email : String,
    password : String,
    image : String,
    contact : Number,
    gstin :String,
    products:{
        type:Array,
        default:[],
    }
})
module.exports = mongoose.model('owner',ownerSchema)