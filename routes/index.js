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

router.get('/shop', isLoggedIn, async (req, res) => {
  const { sort } = req.query;
  let query = ProductModel.find();
  if (sort) {
    let sortFix = sort.split(',').join(" ");
    query = query.sort(sortFix);
  }
  const products = await query;
  let success = req.flash("success");
  let error = req.flash("error");
  res.render("shop", { products, success, error });
});

router.get('/discounted', isLoggedIn, async (req, res) => {
    const products = await ProductModel.find({ discount: { $gt: 0 } }); 
    let success = req.flash("success");
    let error = req.flash("error");
    res.render("shop", { products, success, error });
}
)

router.get('/addtocart/:productId', isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    const productId = req.params.productId;
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
      req.flash("success", "Product quantity increased");
    } else {
      user.cart.push({ product: productId, quantity: 1 });
      req.flash("success", "Product added to cart successfully");
    }

    await user.save();
    res.redirect('/shop');
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong while adding to cart");
    res.redirect('/shop');
  }
});

router.get('/cart', isLoggedIn, async (req, res) => {
  try {
    // Fetch user and populate products inside cart
    const user = await userModel
      .findOne({ email: req.user.email })
      .populate('cart.product');

    if (!user || !user.cart || user.cart.length === 0) {
      return res.render('cart', { user: { cart: [] }, totalBill: 0, quantity: 0 });
    }

    let totalBill = 0;

    user.cart.forEach((item) => {
      if (!item.product) return; // skip if product was deleted
      const price = item.product.price || 0;
      const discount = item.product.discount || 0;
      const finalPrice = (price - discount + 20) * (item.quantity || 1);
      totalBill += finalPrice;
    });

    res.render('cart', {
      user,
      totalBill,
      quantity: user.cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
    });
  } catch (err) {
    console.error('Error loading cart:', err);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
});

router.get('/increase/:productId',isLoggedIn,async(req,res)=>{
    try{
        let user = await userModel.findOne({email:req.user.email})
        let cartItem = user.cart.find(item => item.product.toString() === req.params.productId);    
        if (cartItem) {
            cartItem.quantity += 1;
            await user.save();
        }       
        res.redirect('/cart')
        }catch(err){
            req.flash("error","Error in increasing quantity")
            res.redirect('/cart')       
        }
})
router.get('/decrease/:productId',isLoggedIn,async(req,res)=>{
    try{
        let user = await userModel.findOne({email:req.user.email})      
        let cartItem = user.cart.find(item => item.product.toString() === req.params.productId);
        if (cartItem && cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            await user.save();
        }   
        res.redirect('/cart')
        }catch(err){
            req.flash("error","Error in decreasing quantity")
            res.redirect('/cart')
        }
})
router.get('/account',isLoggedIn,async(req,res)=>{
    let user = await userModel.findOne({email:req.user.email})
    res.render('account',{user})
})

router.get('/wishlist/:productId',isLoggedIn,async(req,res)=>{
    const user = await userModel.findOne({email:req.user.email})
    if(user.wishlist.includes(req.params.productId)){
        req.flash("error","Product already in wishlist")
        return res.redirect('/shop')
    }else{
            user.wishlist.push(req.params.productId)
    }
    await user.save()
    req.flash("success","Product added to wishlist successfully")   
    res.redirect('/shop')
})
router.get('/wishlist',isLoggedIn,async(req,res)=>{
    let user = await userModel.findOne({email:req.user.email}).populate('wishlist')
    let error = req.flash("error")
    res.render('wishlist',{user,error})
})
router.get('/delete/:productId',isLoggedIn,async(req,res)=>{
    try{
        let user = await userModel.findOne({email:req.user.email})
        user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
        await user.save();
        req.flash("success","Product removed from cart successfully")
        res.redirect('/cart')
    }catch(err){
        req.flash("error","Error in removing product from cart")
        res.redirect('/cart')
    }  
})

router.get('/remove/:productId',isLoggedIn,async(req,res)=>{
    try{
        let user = await userModel.findOne({email:req.user.email})
        user.wishlist = user.wishlist.filter(productId => productId.toString() !== req.params.productId);
        await user.save();
        res.redirect('/wishlist')
    }catch(err){
        req.flash("error","Error in removing product from wishlist")
        res.redirect('/wishlist')
    }           
})
module.exports = router