const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    name:String,
    image:Buffer,
    price:{
        type:Number,
        default:0,
    },
    discount:{
        type:Number,
        default:0,
    },
    bgColor:String,
    panelColor:String,
    textColor:String,
})

module.exports = mongoose.model('product',productSchema)