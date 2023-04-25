var express = require('express');
var router = express.Router();
const usersModel = require('../models/users');
const postsModel = require('../models/posts')

// get route to rednder the report page
router.get('/',function(req,res,next){
    try{
      res.render('report/index',{title:'report' , layout:'users-layout'})
    }
    catch(error){
      console.log(error);
      res.render('error',{message:'error in redndering report page', status:404})
    }
  })
  

module.exports = router;
