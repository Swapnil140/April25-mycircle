const userEvents =function(){

    //3. initialize event function
    this.init = function(){
        // _this.updatePostValidation();
        _this.searchPostsAtIndexpage()
        _this.signupValidate();
        _this.postUserDetails();
        _this.loginValidate();
        _this.userUpdateFormValidation();
        _this.savePost();
        _this.unsavePost();
        _this.createPostValidation();
        _this.ajaxCallforModal();
        _this.editPostValidation();
        _this.sortUsers();
        _this.archivePosts();
        _this.unarchivePosts();
        _this.filterpostsAtTimeline();
        _this.searchUsersFromAllUsers()
        _this.sortPostOnTitle();
        _this.paginationBtnClick();
    }
    //4. declare event function


    // pagination 

    this.paginationBtnClick =  function(){
      $(".page-link").on('click',function(){
        // alert($(this).attr("page"))
        $.ajax({
          method:'get',
          url:`/timeline?page=${$(this).attr("page")}`,
          success:function(res){
            // console.log(res)
            $("#index-pagination").load(`/timeline?page=${$(this).attr("page")} div#index-pagination`)
          }
        })
      })
    }

    //search users usign search input

    this.searchUsersFromAllUsers = function(){
      $("#searchUsers").on('keyup',function(){
        console.log($("#searchUsers").val())
        $.ajax({
          method:'get',
          url:`/users?user=${$("#searchUsers").val()}`,
          success:function(res){
            console.log(res)
            $("#renderHere").load(`/users?user=${$("#searchUsers").val()} div#renderHere`)
          }
        })
      })
    }


    // sort post by title
    this.sortPostOnTitle = function(){
      // console.log("ready to sort post on title")
      $("#sortTitleAtlandingPage").on('click',function(){
        if($(this).attr('sort')){
          $(this).html('Title [a-z]')
          $(this).attr('sort','false')
        }else{
          $(this).html('Title [z-a]')
        return $(this).attr('sort','true')
        }
        alert($(this).attr("sort"))
         $.ajax({
          method:'get',
          url:`/timeline?sortOnTitle=${$(this).attr('sort')}`,
          success:function(res){
            // console.log(res)
            $("#renderHere").load(`/timeline?sortOnTitle=${$(this).attr('sort')} div#renderHere`)
          }
         })

        
      })
    }

    // validation for edit post
    this.editPostValidation = function(){
      $("#editPostForm").validate({
        rules:{
          postTitle:{
            required:true,
            maxlength:30,
          },
          postDescription:{
            required:true,
            maxlength:300,
          },
        },
        messages:{
          postTitle:{
            required:'Enter title',
            maxlength:'Title length must be less than 30',
          },
          postDescription:{
            required:'Enter Description',
            maxlength:'Description length must be less than 300',
          },
        },
        submitHandler:function(form){
          form.submit()
        }
      })
      // $(".fireEdit").on('click',function(){
      //   alert('clicked')
      // })
  }

  // index page searching
  this.searchPostsAtIndexpage = function(){
    $("#searchAtIndex").on('keyup',function(){
      console.log($("#searchAtIndex").val())
      $.ajax({
        method:'get',
        url:`/search?aboutPost=${$("#searchAtIndex").val()}`,
        success:function(res){
          console.log(res)
          $("#renderHere").load(`/search?aboutPost=${$("#searchAtIndex").val()} div#renderHere`)
        },
        error:function(err){
          console.log(err)
        }
      })
    })
  }



  // filter posts at timeline page
  this.filterpostsAtTimeline = function(){
    $("#filterBtn").on('click',function(){
      // alert('clicked')
      // let postDetailsToSearch={
      //   whichPosts:$("#whichPosts").val(),
      //   aboutPosts:$("#aboutPosts").val()
      // }
      // console.log(postDetailsToSearch)
      $.ajax({
        method:'get',
        url:`/timeline?whichPosts=${$("#whichPosts").val()}&aboutPosts=${$("#aboutPosts").val()}`,
        success:function(res){
          $("#renderHere").load(`/timeline?whichPosts=${$("#whichPosts").val()}&aboutPosts=${$("#aboutPosts").val()} div#renderHere`)
        }
      })
    })
  }


  // unarchive posts

  this.unarchivePosts = function(){
    $(".unarchivePost").on('click',function(){
      alert('unarchoved called');
      $.ajax({
        method:'get',
        url:`/post?_id=${$(this).attr('id')}&_user=${$(this).attr('data')}`,
        success:function(res){
          console.log('success in ajax call for unarchive posts')
          window.location.href = '/post/archived-posts'
        }
      })
    })
  }

  // archive posts
    this.archivePosts = function(){
      $(".archivePost").on('click',function(){
        alert($(this).attr('id'))
        $.ajax({
          method:'get',
          url:`/post/archive/${$(this).attr('id')}`,
          success:function(res){
            console.log('archive ajax successfully called !')
            window.location.href = "/timeline/"
          }
        })
      })
    }

   // sort users
   this.sortUsers = function(){
    $("#sortUsers").on('click',function(){
      //alert($(this).attr('data'))
      $.ajax({
        method:'get',
        url:`/users/sort/${$(this).attr('data')}`,
        success:function(res){
          console.log(res)
          $("#torender").html(res)
        },
        error:function(error){
          console.log(error);
        }
      })
      if($(this).attr('data') == 'ascending'){
        return $(this).attr('data','descending');
      }
      return $(this).attr('data','ascending'); 
 
    })
   }

    //ajax Call for edit-post modal
    this.ajaxCallforModal =  function(){
      $(".callAjaxforModal").on('click',function(e){
        e.preventDefault();
        // alert($(this).attr('id'))
        $.ajax({
          method:'get',
          url:`/edit/${$(this).attr('id')}`,
          success:function(res){
              $(".modal-body").html(res)
          }
        })
      })
    }
    


    // create-post validation
    this.createPostValidation = function(){
        // console.log("===============edit post")
        $("#createPostForm").validate({
          rules:{
            postTitle:{
              required:true,
              maxlength:30,
            },
            postDescription:{
              required:true,
              maxlength:300,
            },
            postImage:{
              required:true,
            }
          },
          messages:{
            postTitle:{
              required:'Enter title',
              maxlength:'Title should be less than 30 chracters',
            },
            postDescription:{
              required:'Enter Decription',
              maxlength:'Title should be less than 300 chracters'
            },
            postImage:{
              required:'select image'
            }          
          },
          submitHandler:function(form){
            // console.log('$("form#createPostForm,#editpost").validate()' , $("form#createPostForm,#editpost").valid())
            form.submit();
          }
        })
    }
    



    // savepost button functionality

    this.savePost =  function(){
      $(".savePost").on('click',function(){
        if($(this).attr("isSaved") == 'true'){
          return alert('already saved !')
          // $(this).attr('isSaved','true')
          // $(this).html('Saved')
        } 
        if($(this).attr("isSaved") == 'false'){
          alert('Saved')
          $(this).attr('isSaved','true')
          $(this).html('Saved')
        }     
        $.ajax({
          method:'post',
          url:'/saved-posts/save',
          data:{
            savedBy:$(this).attr('data'),
            _post:$(this).attr('id')
          },
          success:function(res){
            console.log('saved ajax called successfully')
          }
        })
      })
    }

    // unsave the post

    this.unsavePost = function(){
      $(".unsavePost").on('click',function(){
          alert('unsave clicked !')   
          let postDetails = {
            savedBy:$(this).attr('data'),
            _post:$(this).attr('id'),
          }
          $.ajax({
            method:'delete',
            url:'/saved-posts/delete',
            data:postDetails,
            success:function(res){
              if(res.type == 'success'){
                console.log("delete ajax called successfully !")
                return window.location.href = '/saved-posts/'
              }
              if(res.type == 'error'){
                console.log("error in delete query for unsave post !")
              }
            }
          })     
      })
      
    }

    // update user details  by update query

    this.userUpdateFormValidation = function(){
      $("#updateForm").validate({
        rules:{
          firstName:{
            required:true,
          },
          lastName:{
            required:true,
          },
          userEmail:{
            required:true,
            email:true,
            remote:`/users/validate/email`

          },
        },
        messages:{
          firstName:{
            required:'Enter First Name',
          },
          lastName:{
            required:'Enter Last Name',
          },
          userEmail:{
            required:'Enter Email',
            email:'Enter Email Valid manner',
            remote:'email already exist enter new email !'
          },
        }
      })
    }


    // jquery validation for login
    this.loginValidate = function(){
      $("#login-validate-btn").on('click',function(){
        alert('login clicked')
      });
      $("#loginForm").validate({
        rules:{
          userEmail:{
            required:true,
            email:true
          },
          password:{
            required:true,
          }
        },
        messages:{
          userEmail:{
            required:'Enter Email',
            email:'Enter valid Email'
          },
          password:{
            required:'Enter Password'
          }
        },
        submitHandler:function(form){
          form.submit()
        }
      });

    }

    this.signupValidate = function(){
      // custom validator for password

      $.validator.addMethod("checkPwd", function(value, element) {
        let  pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$");
        return pattern.test(value);
       }, "Enter Proper Password");


        $("#signupForm").validate({
            rules:{
              firstName:{
                required:true,
              },
              lastName:{
                required:true,
              },
              userEmail:{
                required:true,
                email:true,
                remote:`/users/validate/email`
              },

              password:{
                required:true,
                checkPwd:true,
              },
              confirmPassword:{
                required:true,
                equalTo:'#password'
              },
              
            },
            messages:{
               firstName:{
                required:'Enter First Name',
              },
              lastName:{
                required:'Enter Last Name',
              },
              userEmail:{
                required:'Enter Email',
                email:'Enter Email Valid manner',
                remote:'email already exist enter new email !'
              },
              password:{
                required:'Enter Password',
                checkPwd:'Use hard password'
              },
              confirmPassword:{
                required:'Enter Re-password',
                equalTo:'Enter same password'
              },
            }
          })
    }

    this.postUserDetails = function(){
        $("#submitSingin").on('click',function(){
            $.ajax({
                url:'/signup',
                method:'post',
                data:{
                    firstName:$("#firstName").val(),
                    lastName:$("#lastName").val(),
                    userEmail:$("#userEmail").val(),
                    gender:$("input[type='radio']:checked").val(),
                    password:$("#password").val()
                },
                success:function(res){
                    if(res.type == 'success'){
                        return window.location.href = '/login'
                    }
                    if(res.type == 'error'){
                        return window.location.href = '/signup'
                    }
                }
            })
        })
    }

    // 1. assign this as _this
    const _this = this;

    // 2. call init function to initialize all events written in it
    _this.init()
}