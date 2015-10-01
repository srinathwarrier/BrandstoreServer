/**
 * Created by I076324 on 9/23/2015.
 */


module.exports = {

  updateRegID: function (req, res, connection) {
    //Required variables : userid , regid

    var userID = req.query.userid,
      regID = req.query.regid;

    User.update({userID: userID}, {regid: regID}).exec(function (err, updated) {
      if (err) {
        console.log("Error" + err);
        res.send(err);
      }
      console.log("Updated" + JSON.stringify(updated));
      res.json(updated);
    })

  },

  sendNotificationToAndroid: function (req, res, connection) {
    var msgValue = req.query.msg;


    var message = new sails.gcm.Message();

    message.addData('message', msgValue);

    // fetch regids from User table
    User
      .find({regid:{"!":""}})
      .exec(function (err,found){
        if(err){
          res.json(err);
          return;
        }
        var regidsArray = _.pluck(found,'regid');

        var regIds = ['dSzqVbA2fBY:APA91bH-kULt7kskqSSgmc3aoXmG5YB21zXrmxEI9YQUz6JaZ_32toSNrkT6SAXSXWuE8WJQefo3zfldCGrqTP9Lgrmltk2K6R3rZO5chRWsRdDLAUcLWdJTLIxy3U67ZlndC2Ivh6aG'];

        // Set up the sender with you API key
        var sender = new sails.gcm.Sender('AIzaSyCJIxgLzE6YDX8_JHXH45PR8c8-btjaE38');

        //Now the sender can be used to send messages
        sender.send(message, { registrationIds: regidsArray }, function (err, result) {
          if (err) {
            console.error(err);
            res.json(err);
            return;
          }
          console.log(result);
          UserInteraction.create({
            userID:6,
            userInteractionTypeID:9, // 9 is gcmNotification
            userInteractionLog:JSON.stringify(result)
          }).exec(function(err,created){
            if(err){
              console.log('Error in creating interaction:' + JSON.stringify(err));
            }
            else{
              console.log('Created interaction:' + JSON.stringify(created));
            }
          });
          res.json(result);
        });

      });



    //sender.sendNoRetry(message, regIds, function (err, result) {
    //  if(err) console.error(err);
    //  else    { console.log(result); res.json(result);}
    //});


  },
};
