/**
 * Created by I076324 on 9/23/2015.
 */


module.exports = {

  forgotPassword : function(req,res,connection){
    // Input values :
    var emailid = req.query.emailid;
    User
      .update({emailid:emailid}, {token: Math.random().toString(36).substring(7)})
      .exec(function(err,updated){
        if(err){
          res.json({
            "responseState":"error",
            "responseDetails":err
          })
        }
        // Send mail with following format
        // http://www.brandstore.co.in/v2/reset?emailid=ABC@GMAIL>.COM&token=TOKEN
        var emailString = updated[0].emailid,
          tokenString = updated[0].token,
          nameString = updated[0].name;
        var resetUrlString = "http://www.brandstore.co.in/v2/reset?emailid="+emailString+"&token="+tokenString;
        var mailBodyString = "Hi "+nameString+",<br />Please click the following link to reset your password.<br /><br />"+resetUrlString+
          "<br /><br />Regards,<br />The Brandstore Team.<br /><br />";
        // Send mail to emailid with mailBodyString

        var transporter = sails.nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'contact.brandstore@gmail.com',
            pass: 'gandhiwarrier1'
          }
        });


        var mailOptions = {
          from: 'contact.brandstore@gmail.com', // sender address
          to: emailString, // list of receivers
          subject: "Brandstore - Request to change your password ", // Subject line
          //text: mailBodyString, // plaintext body
          html: mailBodyString // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
          if(error){
            return console.log(error);
          }
          console.log('Message sent: ' + info.response);
        });


        res.json({"responseState":"success","responseDetails":updated});
      });

  },

  reset:function(req,res,connection){
    // Get input parameters.
    var emailid = req.query.emailid,
      token=req.query.token;
    if(!token || token==="" || token==""){
      res.view('pages/invalidtoken',{emailid:emailid});
      return;
    }
    User
      .find({emailid:emailid,token:token})
      .exec(function (err, found) {
        if(err || !found || found.length==0){
          res.view('pages/invalidtoken',{emailid:emailid});
          return;
        }
        return res.view('pages/resetpassword',{emailid:emailid , token:token});

      })



  },

  setnewpassword:function(req,res,connection){
    var emailid = req.body.emailid,
      password = req.body.newpassword,
      token = req.body.token;
    User
      .update(
      {
        emailid:emailid,
        token:token,
        password: { '!': password}
      },
      {
        password:password,
        token:""
      })
      .exec(function (err,updated) {
        if(err || !updated || updated.length==0){
          res.json({
            "responseState":"error",
            "responseDetails":"Not updated password"
          });
          return;
        }
        res.json({
          "responseState":"success",
          "responseDetails":"Updated the password."
        });

      });
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
