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

    var gcm = require('node-gcm');

    var message = new gcm.Message();

    message.addData('key1', msgValue);

    var regIds = ['APA91bH9Rgc8JJIPL1Uh2URIO7qF3PjmRhi55zY2S5OTUzJhEI-4VidecoRud_Tdfu-1_bADTG05Nem1CXefc-zzxL2Lud6KKD6pdhjPFKmf2LjRWlUxxFPCAAr4sbi310npUAYyzS_2'];

// Set up the sender with you API key
    var sender = new gcm.Sender('AIzaSyB6HVQ6Axi_EOIk1R9j-gSplBJYeRX3pG0');

//Now the sender can be used to send messages
    sender.send(message, regIds, function (err, result) {
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

    //sender.sendNoRetry(message, regIds, function (err, result) {
    //  if(err) console.error(err);
    //  else    { console.log(result); res.json(result);}
    //});


  },
};
