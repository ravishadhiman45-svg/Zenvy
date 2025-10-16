const mongoose = require('mongoose')
const ownerSchema = mongoose.Schema({
    fullname : String,
    email : String,
    password : String,
    picture : String,
    contact : Number,
    gstin :String,
    products:{
        type:Array,
        default:[],
    }
})