var jsonfiletophp =[];
var jsonfile = [];

$.get('getfiles/parameters.json', function(data) {

$.each(data , function(i,type) {
	var a = type.file.replace("json/", "");
  a = a.replace(".json" , "");
  a = a.toUpperCase();
$('<hr>').appendTo("#page");
 $('<h1 style="text-align:center"> ' + a + '</h1>').appendTo("#page");
$('<hr>').appendTo("#page");
$('<br>').appendTo("#page");
$.each(type.params , function(j,element) {
 $( '<li><label >' + element + '  : </label><input type="checkbox"  id="' + a + ':' + element +'"  name="' + element +'" /></li> ' ).appendTo( "#page" );
 
  })
})

});


function showparameters()
{
$.get('getfiles/parameters.json', function(data) { 
$.each( data , function(i,type) {
var jsonObject = {
"params": []
}
var a = type.file;
a = a.replace("json/", "");
a = a.replace(".json" , "");
a = a.toUpperCase();
$.each(type.params , function(j,element) {
if(document.getElementById(a + ':' + element).checked)
{
 
jsonObject['file'] = type.file ;
jsonObject['params'].push(element);
 
}



})
jsonfiletophp.push(jsonObject);
})
  validatejsonfiletophp();
 makejsonfile();
});
}

function validatejsonfiletophp()
{

  $.each(jsonfiletophp , function ( i , element)
  {
    if(element.params.length != 0)
      jsonfile.push(element);
  });

}

function makejsonfile()
{
  $.ajax
    ({
        type: "POST",
        url: 'php/makejsonfileforgraphs.php',
        data:  {result:JSON.stringify(jsonfile)} ,
        success: function (data) {
          $('#container').append(data); 
        },
        failure: function() {alert("Error!");}
    });

    window.location.href = "graph.html" ;
}