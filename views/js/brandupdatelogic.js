function getCall(url,cfunc)
{
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=cfunc;
  xmlhttp.open("GET",url,true);
  xmlhttp.send();
}

function getBrandDetailsObject(id){
  getCall("/getbranddetailsforid?id="+id,function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
      var brandObject =JSON.parse(xmlhttp.responseText) ;
      console.log('floor:'+brandObject[0].floorNumber);

      var divElement = document.getElementById("updateForm");
      var str="";
      str+= '<form action="http://localhost:8070/postupdatebrandquery" method="POST">';
      for(var i in brandObject[0])
      {
        str += '<p>'+i+'</p>'
        str += '<input type="text" name="'+i+'" value="'+brandObject[0][i]+'">';
      }
      str += '<input type="submit" value="Submit"> </form>';
      divElement.innerHTML = str;
    }
  });
}


function brandChanged(e){
  var id = e.options[e.selectedIndex].value;
  var name = e.options[e.selectedIndex].text;
  console.log('value:'+id + ' name:'+name);
  getBrandDetailsObject(id);
}
