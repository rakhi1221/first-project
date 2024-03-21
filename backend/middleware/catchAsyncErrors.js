module.exports=theFunc=>(req,res,next)=>{
   //promise is class of javascript which is prebuild
    Promise.resolve(theFunc(req,res,next)).catch(next);
};