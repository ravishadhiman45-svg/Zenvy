const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    fullname:String,
    email:String,
    password:String,
    picture:String,
    isadmin:Boolean,
    contact:Number,
    orders:{
        type:Array,
        default:[],
    },
    cart :{
        type:Array,
        default:[],
    }

})

module.exports = mongoose.model('user',userSchema)