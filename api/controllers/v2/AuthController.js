/**
 * Created by I076324 on 9/23/2015.
 */


module.exports = {

  forgotPassword : function(req,res,connection){

  },

  signup :function (req,res, connection){

    //"firstName="+firstName+"&emailid="+emailId+"&password="+password,

    var name = req.query.name,
      emailId  = req.query.emailid,
      password  = req.query.password,
      genderCode = req.query.gendercode,
      dob = req.query.dob;

    // validate details
    // valid Email
    // password min length
    // genderCode is M or F
    // .


    // Check if User with emailId exists.
    User
      .find({emailid:emailId})
      .exec(function(err,found){
        if(err){
          res.json({"responseState":"error","responseDetails":err});
        }
        if(found!=undefined && found.length && found.length > 0){
          res.json({"responseState":"error","responseDetails":"Email already exists."});
        }
        else{
          User
            .create({
              userRoleID : 1,
              name:name,
              emailid:emailId,
              password:password,
              genderCode : genderCode,
              dob:dob
            }).exec(function(err,created){
              if(err){
                console.log('Error in creating interaction:' + JSON.stringify(err));
                res.json({"responseState":"error","responseDetails":err});
              }
              else{
                console.log('Created interaction:' + JSON.stringify(created));
                res.json({"responseState":"created","responseDetails":created});
              }
            });
        }

      });

  }
};
