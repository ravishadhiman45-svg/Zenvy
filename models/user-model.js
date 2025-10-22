const { ref } = require('joi')
const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    fullname:String,
    email:String,
    password:String,
    image:String,
    isadmin:Boolean,
    contact:Number,
    orders:{
        type:Array,
        default:[],
    },
    cart :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product',
    }]

})

module.exports = mongoose.model('user',userSchema)