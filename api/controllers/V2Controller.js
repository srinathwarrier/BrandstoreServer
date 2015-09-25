/**
 * Temp
 *
 * @description :: hub controller imported from localhost MySql server at 25/6/2015 13:9:43.
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */



function getFloorNameFromFloorNumber(index) {
  var returnValue = "";
  switch (index) {
    case '-1':
      returnValue = "Lower ground floor";
      break;
    case '0':
      returnValue = "Ground floor";
      break;
    case '1':
      returnValue = "First floor";
      break;
    case '2':
      returnValue = "Second floor";
      break;
    default :
      returnValue = "";
      break;
  }
  return returnValue;
}


module.exports = {

};
