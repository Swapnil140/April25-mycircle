var express = require("express");
var router = express.Router();
const usersModel = require("../models/users");
const postsModel = require("../models/posts");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const fs = require('fs');

// import multer
const multer = require('multer')
// import path for extname of file[express inbuilt]
const path =require('path')

// 1.upload by destination method
// const upload = multer({dest:'./public/uploads'})
// 2.upload by storage method
const storage =  multer.diskStorage({
  destination:function(req,file,cb){
    console.log("-----------------------------in destination---------------------")
    const id = req.user._id
    const path = `./public/uploads/posts`
    fs.mkdirSync(path,{recursive: true })
    cb(null,path)
  },
  filename:function(req,file,cb){
    console.log("-----------------------------in finename---------------------")
    // console.log("file is here in storage=====>",file)
    const fileExtension = path.extname(file.originalname)
    const fileNameArray = file.originalname.split(".")
    const fileName = fileNameArray[0];
    cb(null, fileName+fileExtension )
  }
})

const upload = multer({storage:storage})



// post route to update user's post details

router.post('/edit/post/:postId',upload.single('imageName'),async function(req,res,next){
  try{
    if(req.file){
      req.body.imageName = req.file.originalname;
      req.body.imagePath = `/uploads/posts/${req.file.originalname}`,
      console.log(req.body)
    }
    await postsModel.updateOne({_id:req.params.postId},{$set:req.body})
    res.redirect('/timeline/')
  }
  catch(error){
    console.log(error);
    res.render('error',{message:'error in post route for edit post details',status:404})
  }
})


// get route to render the landing page after login
router.get("/", async function (req, res, next) {
  try {
    let userId = req.user._id;
// --------------------------------------------------------
    // post list pagination after login
    if(req.query.page){
      console.log(req.query)
      let postsForPagination = 4;
      let postLimit = postsForPagination*parseInt(req.query.page);
      let postSkip = postsForPagination*(parseInt(req.query.page)-1);
      console.log(`limit is ${postLimit} and  skip is ${postSkip}`)
      let paginationPosts = await postsModel.aggregate([
        {
          $sort:{
              createdOn:-1
              }
          },
          {
          $limit:postLimit
        },
        {
          $skip:postSkip
        },
        {
          $match:{
            isArchived:false
          }
        },
        {
          $lookup: {
            from: "users",
            let: { posts: "$_user" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$posts"],
                  },
                },
              },
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  profileImagePath:1
                },
              },
            ],
            as: "user",
          },
        },
        {
          $project: {
            postTitle: 1,
            postDescription: 1,
            imageName:1,
            imagePath:1,
            createdOn:1,
            user: { $arrayElemAt: ["$user", 0] },
          },
        }
      ])
      console.log(paginationPosts)
      return res.render("timeline/index", {
        title: "user-home",
        layout: "users-layout",
        posts:paginationPosts,
      });
    }


// --------------------------------------------------------
    if(req.query.whichPosts || req.query.aboutPosts){
      let aboutPosts = `/${req.query.aboutPosts}/i`;
      console.log("inside search and filter")
      let pipeline = [];
      let matchObject={};
      if(req.query.whichPosts){
        switch (req.query.whichPosts) {
            case 'mine':
                  matchObject={
                    $match:{
                      $and:[{
                        $expr:{
                          $eq:['$_user',new ObjectId(userId)]
                      }
                      }
                    ]   
                    }
                } 
            break;
            case 'others':
                  matchObject={
                      $match:{
                        $or:[{
                          $expr:{
                            $ne:['$_user',new ObjectId(userId)]
                        }
                        }]    
                      }
                  }
            break;
          default:
                  console.log('for all no match')
                  matchObject={
                    $match:{
                      $or:[
                        {
                          $expr:{

                          }
                        }
                        
                      ]
                    }
                  }
            break;
        }
        
      let lookup = {
        $lookup: {
          from: "users",
          let: { posts: "$_user" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$posts"],
                },
              },
            },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                profileImagePath:1
              },
            },
          ],
          as: "user",
        },
      }
      let project={
        $project: {
          postTitle: 1,
          postDescription: 1,
          imageName:1,
          imagePath:1,
          createdOn:1,
          user: { $arrayElemAt: ["$user", 0] },
        },
      }
      if(aboutPosts){
        let postTitleMatch = {
          postTitle:aboutPosts          
        }  
        
        let postDecriptionMatch = {
          postDescription:aboutPosts
        }
        matchObject.$match.$or.push(postTitleMatch,postDecriptionMatch)
      }
      pipeline.push(matchObject)
    }
      pipeline.push(lookup,project)
      console.log(JSON.stringify(pipeline))
      let allPostsWithUsername = await postsModel.aggregate(pipeline)
      res.render("timeline/index", {
      title: "user-home",
      layout: "users-layout",
      posts:allPostsWithUsername,
    });
    }
    console.log("inside render landing page normally")
    console.log('req.user',req.user)
    let allPostsWithUsername = await postsModel.aggregate([
      {
        $match:{
          isArchived:false
        }
      },
      {
        $lookup: {
          from: "users",
          let: { posts: "$_user" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$posts"],
                },
              },
            },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                profileImagePath:1
              },
            },
          ],
          as: "user",
        },
      },
      {
        $project: {
          postTitle: 1,
          postDescription: 1,
          imageName:1,
          imagePath:1,
          createdOn:1,
          user: { $arrayElemAt: ["$user", 0] },
        },
      },
      {
        $sort:{
            createdOn:-1
            }
        }
    ])
    // console.log(req.query,'-----in timeline---- default');
    res.render("timeline/index", {
      title: "user-home",
      layout: "users-layout",
      posts:allPostsWithUsername,
    });
  } catch (error) {
    console.log(error);
    res.render("error", {
      message: "error in landing after login",
      status: 404,
    });
  }
});



module.exports = router;
