const express = require('express')
const router = express.Router()
const ProductModel = require('../models/product-model')
const isLoggedIn = require('../middleware/isLoggedIn')
const userModel = require('../models/user-model')
router.get('/',(req,res)=>{
    let error = req.flash("error")
    let success = req.flash("success")
    res.render("index",{error , success,islogin:false})
})

router.get('/shop',isLoggedIn,async(req,res)=>{
    let products = await ProductModel.find()
     let success = req.flash("success")
    res.render("shop",{products,success})
})
router.get('/addtocart/:productId',isLoggedIn , async(req,res) =>{
    let user = await userModel.findOne({email:req.user.email})
    if( user.cart.includes(req.params.productId)){
        req.flash("error","Product already in cart")
        return res.redirect('/shop')
    }else{
         user.cart.push(req.params.productId)
    }
    await user.save()
    req.flash("success","Product added to cart successfully")
    res.redirect('/shop')
})
router.get('/cart',isLoggedIn,async(req,res)=>{
    let user = await userModel.findOne({email:req.user.email}).populate('cart')
    let totalBill = 0;
    user.cart.forEach(product => {
        const price = product.price || 0;
        const discount = product.discount || 0
        const discountedPrice = price - discount;
        const finalPrice = discountedPrice + 20; 
         totalBill += finalPrice;// Adding platform fees of 20
    });
    res.render('cart',{user,totalBill})
})

router.get('/account',isLoggedIn,async(req,res)=>{
    let user = await userModel.findOne({email:req.user.email})
    res.render('account',{user})
})

router.get('/delete/:productId',isLoggedIn,async(req,res)=>{
    try{
        let user = await userModel.findOne({email:req.user.email})
        user.cart = user.cart.filter(productId => productId.toString() !== req.params.productId);
        await user.save();
        req.flash("success","Product removed from cart successfully")
        res.redirect('/cart')
    }catch(err){
        req.flash("error","Error in removing product from cart")
        res.redirect('/cart')
    }  
})
module.exports = router