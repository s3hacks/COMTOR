
var filenames = [];
var jsonfiletophp =[];
var filecount;
var filecheckcount;




$.ajax ({
          type : "POST",
          url : "php/getfilenames.php",
          dataType : "JSON" ,
          success : function(msg,string ){
             $.each(msg, function(j, item) {
              if(item != "." && item != "..")
              filenames.push( 'json/' + item);
          })            
                 printfilenames();       
          }


  });


function printfilenames()
{
$.each(filenames , function(i,name) {
  var a = name.replace("json/", "");
  a = a.replace(".json" , "");
  a = a.toUpperCase();
  
 
 $( '<li><label >' + a + '  : </label><input type="checkbox"  id="' + a +'"  name="' + a +'" /></li>' ).appendTo( "#page" );
});
}


function getcheckedcontentslength()
{

$.each(filenames , function(i,name) {
var a = name;
a = a.replace("json/", "");
a = a.replace(".json" , "");
a = a.toUpperCase();
if(document.getElementById(a).checked)
{
   filecheckcount=filecheckcount+1;
}

});

}


function showparameters()
{
filecheckcount =0;
filecount = 0;
$.when( getcheckedcontentslength() ).done(function() {      
$.each(filenames , function(i,name) {
var a = name;
a = a.replace("json/", "");
a = a.replace(".json" , "");
a = a.toUpperCase();
if(document.getElementById(a).checked)
{
   
  displayparameters(name);
 
}

})

});
}



function displayparameters(name)
{  

$.get(name, function(data) {
 var jsonObject = {
"params":[]
}
var params = [] ;
for ( var k=0 ; k < data.length ; k++)
 params.push(Object.keys(data[k]));

jsonObject['file'] = name ;
$.each(params , function(i,type) {
  jsonObject['params'].push (type);
  });
filecount = filecount + 1;
console.log(name);
jsonfiletophp.push(jsonObject);
console.log(jsonfiletophp);
if(filecheckcount == filecount)
  makejsonfile();


});

}


function makejsonfile()
{



  $.ajax
    ({
        type: "POST",
        url: 'php/makejsonfile.php',
        data:  {result:JSON.stringify(jsonfiletophp)} ,
        success: function (data) {
          $('#container').append(data); 
        },
        failure: function() {alert("Error!");}
    });

    window.location.href = "parameters.html"
}



