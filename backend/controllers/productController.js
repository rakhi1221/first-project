const Product =require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");


//Create Product--ADMIN
exports.createProduct=catchAsyncErrors(async(req,res,next)=>{
    req.body.user=req.user.id
    
    
    const product =await Product.create(req.body);
    res.status(210).json({
        success:true,
        product 
    });
});

//GET ALL PRODUCTS
exports.getAllProducts=catchAsyncErrors(async(req,res,next)=>{
  
   
   const resultPerPage=5;
   const productCount=await Product.countDocuments();


    const apiFeature= new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
    const products =await apiFeature.query;
    res.status(200).json({
        success:true,
        products,
    });

});
//GET Product details
exports.getProductDetails =catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
  
  if(!product)
    {
        return next(new ErrorHandler("Product not found",404));

    }
    res.status(200).json({
        success:true,
        product,
        productCount,
   });
});

//UPDATE PRODUCT--ADMIN

exports.updateProduct = catchAsyncErrors(async(req,res,next)=>{
    let product=await  Product.findById(req.params.id);
    if(!product)
    {
        return next(new ErrorHandler("Product not found",404));

    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product
    });
});

//Delete Product

exports.deleteProduct=catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    
    if(!product)
      {
          return next(new ErrorHandler("Product not found",404));
  
      }
     await product.deleteOne();
     res.status(200).json({
          success:true,
          message:"Product Deleted Succesfully"
     });
  });

  //create new review or update the review
  exports.createProductReview=catchAsyncErrors(async (req,res,next)=>{
   
    const {rating,comment,productId}=req.body;
    const review={
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),
    comment,
   } 
   //search product jiska review 
   const product =await Product.findById(productId);
  
   //we will get the user id jo phle review kr rkha hai and will compare new login user id with it
   const isReviewed=product.reviews.find(rev=>rev.user.toString()===req.user._id.toString())
   
   
   if(isReviewed){
    product.reviews.forEach(rev=>{
        if(rev.user.toString()===req.user._id.toString())
        rev.rating=rating,
        rev.comment=comment
    });
   }
   else{
    product.reviews.push(review);
    product.numOfReviews=product.reviews.length
   }
   //avg of all ratings
   let avg=0;
   product.reviews.forEach((rev)=>{

    avg=avg+rev.rating;
   });
   product.ratings=avg/product.reviews.length; 


   await product.save({validateBeforeSave:false});
   res.status(200).json({
    success:true,
   });
  });


  // Get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });
  // Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });