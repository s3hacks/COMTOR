

// get the selected parameters and file names from graph.json file

$.get('getfiles/graph.json', function(data) {

// parse through the data in the graph.json 
$.each(data, function (i , element) {

// go through the file path and then loop through the parameters

$.get(element.file , function(filecontents) {

// Display the file names on the page through a function
displayfilenames(element.file);


// go through the selected parametrs in graph.json to compare with the actual file contents
$.each(element.params , function(j , parameters) {


// go through the actual file contents 
$.each(filecontents , function(k , items) {

// get the keys of the actual file content and compare with the parameters ; the keys will be of example ["id"]
$.each(Object.keys(items) , function (l , params) {

// get only parameters that are selected 
if(params ==  parameters ) 

// send that particular data , parameter name and file name to a function that makes the data ready to graph         
makedatatograph(items[parameters] , params , element.file , k);

}) // end of keys
}) // end of filecontents

}) // end of parameters in graph.json

}) // end of files in graph.json 

}) // end of data in graph.json

}); // end of graph.json


function displayfilenames(filename)
{
var a = filename ; // get the filename to store in a temporary variable
a = a.replace("json/", ""); // the filename contains "json/" in it's string that should be removed
a = a.replace(".json" , ""); // the filename contains ".json" in it's string that should be removed
a = a.toUpperCase();   // the filename is made capital 
$( '<br><hr>'  ).appendTo( "#container" ); // just adding some brakes to make the content view better
$( '<h1 style="text-align:center" > '+ a + ' </h1>' ).appendTo( "#container" ); // Display the Filename heading in the webpage by adding it to container id
$( '<br>'  ).appendTo( "#container" ); // just adding some brakes to make the content view better
}


function makedatatograph(data , parametername , filename , dataindex)
{
// creating id value for the division tag that contains filename and parameter name

var a = filename ; // get the filename to store in a temporary variable
a = a.replace("json/", ""); // the filename contains "json/" in it's string that should be removed
a = a.replace(".json" , ""); // the filename contains ".json" in it's string that should be removed
a = a.toUpperCase();   // the filename is made capital
a = a + parametername ; // add parameter name to file name  
a=  a.replace(/\s/g, ''); //removing whitespaces

// allow only the graph plots of length 10 
$( '<div id="' +  a + '"></div>'  ).appendTo( "#container");

$('<div id="'+ a +  'select"><button onclick = "changegraph(this)" name =" ' + filename + ":/-" + parametername + ":/-" + a +  ":/-" + dataindex + '"  id="'+ a +  'selectgraphpie"  value ="pie">Pie chart</button></div>').appendTo("#" + a);

mixandmatchoption(a,parametername);

if(data.length <= 9)
  bargraph(data , parametername , a , a , "new");  //plot the graph to be appended to container of webpage

else
{

  selectscroll(data , a , filename , parametername , a , dataindex); // make a select tag that contains options 
  data.length = 10 ;
  bargraph(data , parametername , a , a , "new");  //plot the graph to be appended to container of webpage
}


}

// bragraph
function bargraph(data , parametername , div , appendto , state )
{

  


div = div + "graph" ; 

if( state != "exists") // check whether the graph exists or not 
{



var bar = {
      chart: {
            type: 'column',
            renderTo: div 
        },
        title: {
            text: parametername
        },
               subtitle: {
            text: 'Source: http://www.icpsr.umich.edu/icpsrweb/ICPSR/studies/03678'
        },
        xAxis: {
            categories: [ parametername ],
           
        },
        yAxis: {
          
            title: {
                text: 'Frequency'
            },
        },

        tooltip: {
            
           
        },

               plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },

        series: data
    
 };

// if the graph is new 


 $( '<div id="' +  div + '"></div>'  ).appendTo( "#" + appendto); // create a division tag for high charts
 var chart = new Highcharts.Chart(bar); // call the highcharts api

}

// if the graph already exists call the graph and add series to it

else
{

  var chart = $('#' + div).highcharts();
  var temp=0;
   $.each(data , function(i , element) {
  $.each(chart.series , function(j , series) {
    if(element.name == series.name)
      temp = 1 ;
    
  })
  if(temp != 1)
  chart.addSeries(element);
  

else
temp = 0;

});
 

  
}



}


function selectscroll(data , div , filename , parametername ,appendto, dataindex)
{
// create start point for the data
var a = filename ; // get the filename to store in a temporary variable
a = a.replace("json/", ""); // the filename contains "json/" in it's string that should be removed
a = a.replace(".json" , ""); // the filename contains ".json" in it's string that should be removed


$( '<span style="color : red"> ' + a.toUpperCase() + '/' + parametername.toUpperCase()  +  ' :  </span>' ).appendTo( "#" + appendto );
$( '<span > STARTPOINT  </span> <select id='+ div + 'first > </select>' ).appendTo( "#" + appendto );

// create end point for the data
$( '<span > ENDPOINT  </span> <select id='+ div + 'end > </select>' ).appendTo( "#" + appendto );

//some breaks


// get the options for first point and end point from the data
$.each(data , function (i , element) {

$( '<option value = ' + element.name + ":/-" + i +' > ' + element.name + '</option>' ).appendTo( "#" + div + "first" );
$( '<option value = ' + element.name + ":/-" + i +' > ' + element.name + '</option>' ).appendTo( "#" + div + "end" );

});

// create the submit button that contains the filename  and parameter name for the path and div for append to 

$('<button onclick =  "plot(this)" name =" ' + filename + ":/-" + parametername + ":/-" + div +  ":/-" + dataindex + '" value="bar"  id="'+ div +  'submit" > SUBMIT  </button>').appendTo("#" + appendto);


//create the clear button

$('<br><br>').appendTo( "#" + appendto );
$('<button  onclick = "emptygraph(this)" name =" ' + filename + ":/-" + parametername + ":/-" + div +  ":/-" + dataindex + '"  id="'+ div +  'clear" > CLEAR  </button>').appendTo("#" + appendto);

}


// Plot the graph between the limits
function plot(getthings)
{
var splitdata = [] ;  // get the new data values between the limits 
var name = getthings.name.split(":/-"); // split the name attribute from submit button
var filename = name[0]; // get the filename
var parameters = name[1]; // ge the parameter name 
var div = name[2]; // get the division attribute
var dataindex = name[3] ; // get the index of data


// get the first value
var values = document.getElementById(div + 'first').value.split(":/-");

var firstpoint = values[0];
var firstindex = values[1];
// get the end value
values = document.getElementById(div + 'end').value.split(":/-");
var endpoint = values[0];
var endindex = values[1];

if(firstpoint > endpoint)
{
alert (' STARTPOINT should not be greater than ENDPOINT ');
return false;
}


//get the data between the first and end values
$.get(filename , function(data) {

  // get the selected parameter data
  $.each(data[dataindex][parameters] , function (i , element) {

    if(element.name >= firstpoint  && element.name <= endpoint) {
        splitdata.push(element);

    }

  })

  if(document.getElementById(   div + "submit" ).value == "bar")
 bargraph(splitdata , parameters , div , div , "exists" );

else
   piechart(splitdata , parameters , div , div , "exists" );


});

}

// clear the graph
function emptygraph(getthings)
{

var name = getthings.name.split(":/-"); // split the name attribute from the clear button
var a = name[2];  // this contains division id
var type = name[1]; // this contains parameter

 if(document.getElementById(a + "selectgraphpie"))
 {
a = a+"graph";


var bar = {
      chart: {
            type: 'column',
            renderTo: a 
        },
        title: {
            text: type
        },
               subtitle: {
            text: 'Source: http://www.icpsr.umich.edu/icpsrweb/ICPSR/studies/03678'
        },
        xAxis: {
            categories: [ ],
           
        },
        yAxis: {
          
            title: {
                text: 'Frequency'
            },
        },

        tooltip: {
            
           
        },

               plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },

        series: [{ name: 'values' ,
                   data: [] 
                 }]
    
 };

//document.getElementById(a).innerHTML = '' ;
var chart = new Highcharts.Chart(bar);
 chart.series[0].remove();
}

else
{
  a = a + "graph";

 var bar = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: a
        },
        title: {
            text: type
        },
         subtitle: {
            text: ''
        },
        tooltip: {
            pointFormat: ''
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Frequency',
            colorByPoint: true,
            data: []
        }]
    };

var chart = new Highcharts.Chart(bar);


}


}


function changegraph(getthings)
{

var name = getthings.name.split(":/-"); // split the name attribute from submit button
var filename = name[0]; // get the filename
var parameters = name[1]; // ge the parameter name 
var div = name[2]; // get the division attribute
var dataindex = name[3] ; // get the index of data


// check whether the selected button is pie or bar ; if it is pie  or bar inter change 
if(getthings.value == "pie")
{
document.getElementById(div + "select").innerHTML += '<button onclick = "changegraph(this)" name =" ' + filename + ":/-" + parameters + ":/-" + div +  ":/-" + dataindex + '"  id="'+ div +  'selectgraphbar"  value ="bar">Bar Graph</button>';
$( "#" + div + "selectgraphpie" ).remove();

if(document.getElementById(   div + "submit" ))
document.getElementById(   div + "submit" ).value = "pie";

}

else
{
document.getElementById(div + "select").innerHTML += '<button onclick = "changegraph(this)" name =" ' + filename + ":/-" + parameters + ":/-" + div +  ":/-" + dataindex + '"  id="'+ div +  'selectgraphpie"  value ="pie">Pie chart</button>';
$( "#" + div + "selectgraphbar" ).remove();

if(document.getElementById(   div + "submit" ))
document.getElementById( div + "submit" ).value = "bar";

}




$.get(filename , function(data) {


if(getthings.value == "pie")
{
var elementdata = [] ;

  var temp = 0 ;
  var chart = $('#' + div + "graph").highcharts();

   $.each(data[dataindex][parameters] , function(i , element) {
  $.each(chart.series , function(j , series) {

//    if(series.name.indexOf("<br>") > -1)
 //   {
    //  temp = 1 ;
  //  }


    if(element.name == series.name)
      elementdata.push(element);
    
      
    
  })
  
})
 
 if(temp == 1 )
  bartopie(chart,div);

 piechart( elementdata, parameters , div , div , "new");
  


}

else
{
var elementdata = [] ;


var chart = $('#' + div + "graph").highcharts();

   $.each(data[dataindex][parameters] , function(i , element) {
  $.each(chart.series[0].data , function(j , series) {
    if(element.name == series.name)
      elementdata.push(element);



})
})

bargraph( elementdata, parameters , div , div , "new");

}



})



}


function piechart(data , parametername , div , appendto , state )
{

div = div + "graph" ; 

if( state != "exists")
{

var piedata = [];
$.each(data , function(i , element) {
piedata.push({ name: element.name , y: element.data[0] });

});

Highcharts.setOptions({
    lang: {
      thousandsSep: ','
    }
  });

 var bar = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: div
        },
        title: {
            text: parametername
        },
         subtitle: {
            text: 'Source: http://www.icpsr.umich.edu/icpsrweb/ICPSR/studies/03678'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Frequency',
            colorByPoint: true,
            data: piedata
        }]
    };


// if the graph is new 


 $( '<div id="' +  div + '"></div>'  ).appendTo( "#" + appendto); // create a division tag for high charts
 var chart = new Highcharts.Chart(bar); // call the highcharts api

}

// if the graph already exists call the graph and add series to it

else
{
var piedata = [];
$.each(data , function(i , element) {
piedata.push({ name: element.name , y: element.data[0] });

});

  var chart = $('#' + div).highcharts();
  
  var temp=0;
   $.each(piedata , function(i , element) {
   
  $.each(chart.series[0].data , function(j , series) {
    if(element.name == series.name)
      temp = 1 ;
    
  })



  if(temp != 1)
  chart.series[0].addPoint(element);

else
  temp = 0 ;
});
 

}



}


function mixandmatchoption(div,parametername)
{

$( '<div class="dropdown" id="'+ div + 'mix"><button class="btn btn-default dropdown-toggle"  data-toggle="dropdown">Mix and Match<span class="caret"></span></button><ul class="dropdown-menu" id="' + div + 'mixnmatch"></ul></div>' ).appendTo( "#" + div );

$('.dropdown-menu').css ({"width":"auto", "left":"51%", "margin-left" :"-100px" , "text-align" : "center"});



$.get('getfiles/graph.json', function(data) {

$.each(data, function (i , element) {

var a = element.file; // get the filename to store in a temporary variable
a = a.replace("json/", ""); // the filename contains "json/" in it's string that should be removed
a = a.replace(".json" , ""); // the filename contains ".json" in it's string that should be removed
a = a.toUpperCase();   // the filename is made capital

$( '<li class = "divider" >  </li>' ).appendTo( "#" + div + "mixnmatch" );
$( '<li value = "" disabled> ' + a + ' </li>' ).appendTo( "#" + div + "mixnmatch" );
$( '<li class = "divider" >  </li>' ).appendTo( "#" + div + "mixnmatch" );

$.each(element.params , function(j,parameter) {

if(parameter != parametername)
$( '<li style="text-align:left"> <a href="#"><input type="checkbox" onclick = "mixnmatch(this)" id="'+ div + parameter +'mnm" name =" ' + element.file + ":/-" + parameter + ":/-" + div + '"  > ' + parameter + ' </a></li> ').appendTo( "#" + div + "mixnmatch" );

})


})

$( '<li class = "divider" >  </li>' ).appendTo( "#" + div + "mixnmatch" );
});



}


function mixnmatch(getthings)
{
var mixdata = [];
var count = -1 ;
var name = getthings.name.split(":/-"); // split the name attribute from submit button
var filename = name[0]; // get the filename
var parameters = name[1]; // get the parameter name 
var div = name[2]; // get the division attribute
var dataindex;
if(getthings.checked)
{

$.get(filename, function(contents) {
$.each(contents, function (i, element) {

$.each(Object.keys(element) , function ( j , item) {

if(item == parameters)
{
  dataindex = i ;
  $.each(contents[dataindex][parameters] , function (k , arguments)
  {

    arguments.name = parameters  + "<br>" + arguments.name ;
    mixdata.push(arguments);

  })
  mixdatatograph(mixdata , parameters , filename , dataindex , div)
  getthings.name = getthings.name + ":/-" + dataindex ;
  return ;
}

})
  
})

});

}

else
{
 if(document.getElementById(div + "selectgraphbar"))
 {
  var chart = $('#' + div + "graph").highcharts();
  $.each(chart.series[0].data , function (l , chartitems) {
          count = count + 1;
        if(chart.series[0].data[count].name.startsWith(parameters))
        {
          
          chart.series[0].data[count].remove();
          count = count - 1;

        }
       
      })
 }

  else 
  {


  $('#' + div + parameters ).remove();
  var chart = $('#' + div + "graph").highcharts();
      $.each(chart.series , function (l , chartitems) {
          count = count + 1;
        if(chart.series[count].name.startsWith(parameters))
        {
          
          chart.series[count].remove();
          count = count - 1;

        }
       
      })
     
}


     
}
}


function mixdatatograph(data , parametername , filename , dataindex , appendto)
{


if(data.length <= 9)
  if(document.getElementById(appendto + "selectgraphbar"))
   piechart( data, parametername , appendto , appendto , "exists");

  else
  bargraph(data , parametername , appendto , appendto , "exists"); 

else
{
  mixscroll(data , appendto , filename , parametername , appendto , dataindex); // make a select tag that contains options 
  data.length = 10 ;
  if(document.getElementById(appendto + "selectgraphbar"))
    piechart( data, parametername , appendto , appendto , "exists");
  else
    bargraph(data , parametername , appendto , appendto , "exists"); 
}


}


function mixscroll(data , div , filename , parametername ,appendto, dataindex)
{
// create start point for the data
var a = filename ; // get the filename to store in a temporary variable
a = a.replace("json/", ""); // the filename contains "json/" in it's string that should be removed
a = a.replace(".json" , ""); // the filename contains ".json" in it's string that should be removed


$( '<div id="'+ div + parametername + '" ><br><span style="color : red"> ' + a.toUpperCase() + '/' + parametername.toUpperCase()  +  ' :  </span></div>' ).appendTo( "#" + appendto + "mix");
$( '<span > STARTPOINT  </span> <select id='+ div + parametername +'first > </select>' ).appendTo( "#" + appendto + parametername );

// create end point for the data
$( '<span > ENDPOINT  </span> <select id='+ div + parametername + 'end > </select>' ).appendTo( "#" + appendto + parametername );



// get the options for first point and end point from the data
$.each(data , function (i , element) {

  var temp = element.name.replace(parametername + "<br>" ,'');

$( '<option value = ' + temp + ":/-" + i +' > ' + temp + '</option>' ).appendTo( "#" + div + parametername + "first" );
$( '<option value = ' + temp + ":/-" + i +' > ' + temp + '</option>' ).appendTo( "#" + div + parametername + "end" );

});

// create the submit button that contains the filename  and parameter name for the path and div for append to 

$('<button onclick =  "mixplot(this)" name =" ' + filename + ":/-" + parametername + ":/-" + div +  ":/-" + dataindex + '" value="bar"  id="'+ div + parametername + 'submit" > SUBMIT  </button>').appendTo("#" + appendto + parametername);


//create the clear button

}

function mixplot(getthings)
{
var splitdata = [] ;  // get the new data values between the limits 
var name = getthings.name.split(":/-"); // split the name attribute from submit button
var filename = name[0]; // get the filename
var parameters = name[1]; // ge the parameter name 
var div = name[2]; // get the division attribute
var dataindex = name[3] ; // get the index of data


// get the first value
var values = document.getElementById(div + parameters + 'first').value.split(":/-");

var firstpoint = values[0];
var firstindex = values[1];
// get the end value
values = document.getElementById(div + parameters + 'end').value.split(":/-");
var endpoint = values[0];
var endindex = values[1];

if(firstpoint > endpoint)
{
alert (' STARTPOINT should not be greater than ENDPOINT ');
return false;
}


//get the data between the first and end values
$.get(filename , function(data) {

  // get the selected parameter data
  $.each(data[dataindex][parameters] , function (i , element) {

    if(element.name >= firstpoint  && element.name <= endpoint) {

        element.name = parameters  + "<br>" + element.name ;
        splitdata.push(element);

    }

  })

  if(document.getElementById(div + "selectgraphpie"))
 bargraph(splitdata , parameters , div , div , "exists" );

else
   piechart(splitdata , parameters , div , div , "exists" );


});

}

/*

function bartopie( chart , div)
{
      var elementdata = [];
      var temp = seriesname.split("<br>");
      var parametername = temp[0];
      var tempindex = document.getElementById(div + parametername + "mnm") .name.split(":/-");
      index = tempindex[3];
      var filename = tempindex[0];

$.each(chart.series )



    $.get(filename , function(data) {


       $.each(data[index][parametername] , function(j , gotdata) {
  $.each(chartitems , function(k , gotseries) {

      if((parametername + "<br>" + gotdata.name) == gotseries.name)
      {
        gotdata.name = parametername + "<br>" + gotdata.name ;
        elementdata.push();

       } 

     })
})
})


}

*/