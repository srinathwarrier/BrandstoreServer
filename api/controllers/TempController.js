/**
 * Temp
 *
 * @description :: hub controller imported from localhost MySql server at 25/6/2015 13:9:43.
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


module.exports = {

  getRecentAndPopularSuggestions: function (req,res) {
    Brand.find().exec(function(err, brandArray) {
      var userId = req.params.id;
      if(userId==undefined) userId = 6;

      //var callProcedureString = "SET @p0 =  '"+userId+"'; CALL `getRecentAndPopularSuggestions` ( @p0 );" ;
      var callProcedureString = "CALL `getRecentAndPopularSuggestions`("+userId+");" ;
      Brand.query(callProcedureString, function(err, rows) {
        if (!err)
        {
          console.log('The recent items are: ', rows[1]);
          console.log('The popular items are: ', rows[2]);
          var resultObj = {"recent":rows[1] , "popular":rows[2]};
          res.json(resultObj);
        }
        else{
          console.log('Error while performing Query.'+err);
          console.log('callProcedureString:'+callProcedureString);
          res.setHeader('Content-Type', 'text/html');
          res.send(err);
        }
      });
    });
  },


  getSuggestions : function(req, res,connection) {
    // 1) /getSuggestions?q=zara&userid=6
    var param = req.query.q;
    var userId = req.query.userid;
    if(userId==undefined) userId = 6;

    console.log("req.query.param:"+req.query.q);
    console.log("req.query.userid:"+req.query.userid);
    console.log("req.query:"+req.query);


    var callProcedureString = " CALL `getSuggestions` ( '"+userId+"' , '"+param+"' );" ;
    Brand.query(callProcedureString, function(err, rows) {
      if (!err)
      {
        res.json(rows[0]);
      }
      else{
        console.log('Error while performing Query.'+err);
        console.log('Param value:'+param);
        console.log('callProcedureString:'+callProcedureString);
        res.setHeader('Content-Type', 'text/html');
        res.send(err);
      }
    });
  },



  getOutlets : function(req, res, connection) {
    // Required variables : [ (query) , (id,type=category) , (id[],type=category) ]
    // Optional variables : [ favorite=true , sale=true ,  ]
    // Currently optional should be required : [userid]

    var query = req.query.q,
      id = req.query.id ,
      type= req.query.type,
      userId = req.query.userid;
    if(userId==undefined) userId = 6;
    var callProcedureString = "";
    console.log("values- query "+query+" id "+id+" type "+type);


    if(query!=undefined){
      callProcedureString = "CALL `getOutletsByQuery` ( '"+userId+"' , '"+query+"'  );" ;
    }
    else {            //2b ) /getOutlets?id=20&type=category
      if(type=="category"){
        if (id.indexOf(',') == -1)
        {
          callProcedureString= "CALL `getOutletsByTagId` ( '"+userId+"' , '"+id+"' );" ;
        }
        else
        {
          callProcedureString= " CALL `getOutletsByTagIdArray` ( '"+userId+"' , '"+id+"' );" ;
        }
      }
      else{
        callProcedureString= " CALL `getOutletsByTagId` ( '"+userId+"' , 0 );" ;
      }
    }
    Brand.query(callProcedureString, function(err, rows, fields) {
      console.log("returned");
      if (!err)
      {
        console.log('The solution is: ', rows[0]);
        var result = rows[0];
        for (index = 0; index < result.length; ++index) {
          switch(result[index].floorNumber+"")
          {
            case '-1': result[index].floorNumber="Lower Ground Floor"; break;
            case '0':  result[index].floorNumber="Ground Floor";       break;
            case '1':  result[index].floorNumber="First Floor";        break;
            case '2':  result[index].floorNumber="Second Floor";       break;
            default: break;
          }
          //console.log("rows[index].floorNumber : "+rows[index].floorNumber);
        }
        res.json(result);
      }
      else{
        console.log('Error while performing Query.'+err);
        console.log('Query value:'+query + "and id : "+id);
        console.log('callProcedureString:'+callProcedureString);
        res.setHeader('Content-Type', 'text/html');
        res.send(err );
      }
    });
  },


  getOutletDetails : function(req, res,connection) {
    // 3)  /getOutletDetails?id=100

    var id = req.query.id;
    var userId = req.query.userid;
    if(userId==undefined) userId = 6;
    var callProcedureString= "CALL `getOutletDetailsForOutletID` ( '"+userId+"' , '"+id+"' );" ;

    Brand.query(callProcedureString, function(err, rows, fields) {
      if (!err)
      {
        console.log("rows:"+rows);
        var resultObj = rows[0][0];
        console.log("resultObj:"+resultObj);
        if(resultObj!=undefined && resultObj && resultObj.floorNumber)
        {
          switch(resultObj.floorNumber+"")
          {
            case '-1': resultObj.floorNumber="Lower Ground Floor"; break;
            case '0':  resultObj.floorNumber="Ground Floor";       break;
            case '1':  resultObj.floorNumber="First Floor";        break;
            case '2':  resultObj.floorNumber="Second Floor";       break;
            default: break;
          }
        }
        if(resultObj!=undefined && resultObj)
        {
          if(rows[1]!=undefined){
            resultObj.tagsArray=rows[1];
          }
          if(rows[2]!=undefined){
            resultObj.relatedBrandsArray=rows[2];
          }
          if(rows[3]!=undefined){
            resultObj.offersArray=rows[3];
          }
          if(rows[4]!=undefined){
            resultObj.outletDetails=rows[4];
          }
        }
        else{
          resultObj={};
          resultObj=rows[4][0];
          resultObj.genderCodeString="";
          resultObj.tagsArray=[];
          resultObj.relatedBrandsArray=[];
          resultObj.offersArray=[];
        }
        console.log(resultObj);
        res.json(resultObj);
      }
      else{
        console.log('Error while performing Query.'+err);
        res.setHeader('Content-Type', 'text/html');
        res.send(err );
      }
    });
  },


  getRelatedBrandOutlets : function(req, res,connection) {
    // 1) /getRelatedBrandOutlets?brandid=6
    var brandId = req.query.brandid;
    if(brandId==undefined) brandId = 12;

    var callProcedureString = "CALL `getRelatedBrandOutlets` ( '"+brandId+"' );" ;
    Brand.query(callProcedureString, function(err, rows, fields) {
      if (!err)
      {
        console.log('rows length is: ',rows.length);
        console.log('rows[0] length is: ',rows[0].length);
        console.log('rows[1] length is: ',rows[1].length);
        console.log('The solution is: ', JSON.stringify(rows));
        console.log('The solution is: ', rows[0]);
        res.json(rows);
      }
      else{
        console.log('Error while performing Query.'+err);
        console.log('Param value:'+param);
        console.log('callProcedureString:'+callProcedureString);
        res.setHeader('Content-Type', 'text/html');
        res.send(err );
      }
    });

  },








};
