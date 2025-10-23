const express = require('express')
const router = express.Router()
const upload = require('../config/multer-config')
const productModel = require('../models/product-model')
router.post('/create',upload.single('image'),async(req,res)=>{
    try{
        let {price,name, discount,bgColor, panelColor,textColor,} = req.body;
        let image = req.file.buffer;
        let productCreated = await productModel.create({
            name,
            price,
            discount,
            bgColor,
            panelColor,
            textColor,
            image
        })
        req.flash('success','Product created successfully')
        res.redirect('/owners/admin')
    }catch(err){
        req.flash('error','Error in creating product')
        console.log(err)
        res.redirect('/owners/admin')
    }
})
module.exports = router