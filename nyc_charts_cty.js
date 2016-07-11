
function pushData(dobj, things) {
  dobj.push({'geography': things[0],
          'industry': things[1],
          'education': things[2],
          'EmpS': parseFloat(things[3]),
          'HirAS': parseFloat(things[4]),
          'HirNS': parseFloat(things[5]),
          'EarnS': parseFloat(things[6]),
          'EarnHirAS': parseFloat(things[7]),
          'EarnHirNS': parseFloat(things[8]),
          'yyyyqq': things[9],
          'yyyyqq2': things[10]});
}

$(function () {
  $("[href]").each(function() {
  if (this.href == window.location.href) {
    $(this).addClass("active");
    }
  });     
  var nycdata = [];
  
  var xcat = []; /* Used by all QWI charts */
    
  /* Helper function to create data series for charts */
  function filldata (subdata,outemp, outearn, outhire, outhirearn) {
    $.each(subdata, function(items, item) {
      outemp.push(item.EmpS);
      outearn.push(item.EarnS);
      outhire.push(item.HirAS);
      outhirearn.push(item.EarnHirAS);
    });
  };
    
  /* Vars for county charts */
  var emp_all = [];
  var emp_bronx = [];
  var emp_kings = [];
  var emp_manhattan = [];
  var emp_queens = [];
  var emp_richmond = [];

  var empearn_all = [];
  var empearn_bronx = [];
  var empearn_kings = [];
  var empearn_manhattan = [];
  var empearn_queens = [];
  var empearn_richmond = [];

  var hire_all = [];
  var hire_bronx = [];
  var hire_kings = [];
  var hire_manhattan = [];
  var hire_queens = [];
  var hire_richmond = [];

  var earnhire_all = [];
  var earnhire_bronx = [];
  var earnhire_kings = [];
  var earnhire_manhattan = [];
  var earnhire_queens = [];
  var earnhire_richmond = [];

  var subset_cty = [];
  var sub_all = [];
  var sub_bronx = [];
  var sub_kings = [];
  var sub_manhattan = [];
  var sub_queens = [];
  var sub_richmond = [];

  var str_ed = "";
  var str_ind2 = "";

  /* Functions used for county charts */
  function clearArrays2() {
    xcat = [];
    emp_bronx = [];
    emp_kings = [];
    emp_manhattan = [];
    emp_queens = [];
    emp_richmond = [];
    emp_all = [];

    empearn_bronx = [];
    empearn_kings = [];
    empearn_manhattan = [];
    empearn_queens = [];
    empearn_richmond = [];
    empearn_all = [];

    hire_bronx = [];
    hire_kings = [];
    hire_manhattan = [];
    hire_queens = [];
    hire_richmond = [];
    hire_all = [];

    earnhire_bronx = [];
    earnhire_kings = [];
    earnhire_manhattan = [];
    earnhire_queens = [];
    earnhire_richmond = [];
    earnhire_all = [];

    subset_cty = [];
    sub_bronx = [];
    sub_kings = [];
    sub_manhattan = [];
    sub_queens = [];
    sub_richmond = [];
    sub_all = [];
  }
    
  function subsetdata2() {
    subset_cty = $.grep(nycdata, function (n,i) {
      return (n.education == str_ed && n.industry == str_ind2);
    });

    sub_all = $.grep(subset_cty, function (n,i){
      return (n.geography == 'All counties/boroughs');
    });
    sub_bronx = $.grep(subset_cty, function (n,i){
      return (n.geography == 'Bronx/The Bronx');
    });
    sub_kings = $.grep(subset_cty, function (n,i){
      return (n.geography == 'Kings/Brooklyn');
    });
    sub_manhattan = $.grep(subset_cty, function (n,i){
      return (n.geography == 'New York/Manhattan');
    });
    sub_queens = $.grep(subset_cty, function (n,i){
      return (n.geography == 'Queens/Queens');
    });
    sub_richmond = $.grep(subset_cty, function (n,i){
      return (n.geography == "Richmond/State Island");
    });
  };

  function createSeries2() {
    filldata(sub_bronx, emp_bronx, empearn_bronx, hire_bronx, earnhire_bronx);
    filldata(sub_kings, emp_kings, empearn_kings, hire_kings, earnhire_kings);
    filldata(sub_manhattan, emp_manhattan, empearn_manhattan, hire_manhattan, earnhire_manhattan);
    filldata(sub_queens, emp_queens, empearn_queens, hire_queens, earnhire_queens);
    filldata(sub_richmond, emp_richmond, empearn_richmond, hire_richmond, earnhire_richmond);
    filldata(sub_all, emp_all, empearn_all, hire_all, earnhire_all);
  }

  function drawCharts2(){
    $('#div_empnum2').highcharts({
      title: {
        text: "Employment (Stable)"
      },
      subtitle: {
        text: str_ed + ": " + str_ind2
      },
      xAxis: {
        categories: xcat
      },
      yAxis: {
        title: {
          text: ''
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'All counties/boroughs',
        data: emp_all
      },
      {
        name: 'Bronx/The Bronx',
        data: emp_bronx
      },
      {
        name: 'Kings/Brooklyn',
        data: emp_kings
      },
      {
        name: 'New York/Manhattan',
        data: emp_manhattan
      },
      {
        name: 'Queens/Queens',
        data: emp_queens
      },
      {
        name: "Richmond/Staten Island",
        data: emp_richmond
      }]
    });
    $('#div_empearn2').highcharts({
      title: {
        text: "Employment earnings (Stable)"
      },
      subtitle: {
        text: str_ed + ": " + str_ind2
      },
      xAxis: {
        categories: xcat
      },
      yAxis: {
        title: {
          text: ''
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'All counties/boroughs',
        data: empearn_all
      },
      {
        name: 'Bronx/The Bronx',
        data: empearn_bronx
      },
      {
        name: 'Kings/Brooklyn',
        data: empearn_kings
      },
      {
        name: 'New York/Manhattan',
        data: empearn_manhattan
      },
      {
        name: 'Queens/Queens',
        data: empearn_queens
      },
      {
        name: "Richmond/Staten Island",
        data: empearn_richmond
      }]
    });
    $('#div_hirenum2').highcharts({
      title: {
        text: "Hires (Stable)"
      },
      subtitle: {
        text: str_ed + ": " + str_ind2
      },
      xAxis: {
        categories: xcat
      },
      yAxis: {
        title: {
          text: ''
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'All counties/boroughs',
        data: hire_all
      },
      {
        name: 'Bronx/The Bronx',
        data: hire_bronx
      },
      {
        name: 'Kings/Brooklyn',
        data: hire_kings
      },
      {
        name: 'New York/Manhattan',
        data: hire_manhattan
      },
      {
        name: 'Queens/Queens',
        data: hire_queens
      },
      {
        name: "Richmond/Staten Island",
        data: hire_richmond
      }]
    });
    $('#div_hirearn2').highcharts({
      title: {
        text: "Hires earnings (Stable)"
      },
      subtitle: {
        text: str_ed + ": " + str_ind2
      },
      xAxis: {
        categories: xcat
      },
      yAxis: {
        title: {
          text: ''
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'All counties/boroughs',
        data: earnhire_all
      },
      {
        name: 'Bronx/The Bronx',
        data: earnhire_bronx
      },
      {
        name: 'Kings/Brooklyn',
        data: earnhire_kings
      },
      {
        name: 'New York/Manhattan',
        data: earnhire_manhattan
      },
      {
        name: 'Queens/Queens',
        data: earnhire_queens
      },
      {
        name: "Richmond/Staten Island",
        data: earnhire_richmond
      }]
    });    
  };
    
  $.get('nyc_qwi.tsv', function (qwidata, status) {
    var lines = qwidata.split('\n');
  
    $.each(lines, function(lineNo, line) {
      var items = line.split('\t');
      if (lineNo > 0) {
        pushData(nycdata, items);
      }
    });

  $("#sel_ed").change(function() {
    str_ed = "";
    clearArrays2();
    $("#sel_ed option:selected" ).each(function() {
      str_ed = $( this ).text();
    });
    console.log(str_ed);
    subsetdata2();
    createSeries2();
    $.each(sub_bronx, function(items, item) {
      xcat.push(item.yyyyqq);
    });
    drawCharts2();
  });

  $("#sel_ind2").change(function() {
    str_ind2 = "";
    clearArrays2();
    $("#sel_ind2 option:selected" ).each(function() {
      str_ind2 = $( this ).text();
    });
    console.log(str_ind);
    subsetdata2();
    createSeries2();
    $.each(sub_bronx, function(items, item) {
      xcat.push(item.yyyyqq);
    });
    drawCharts2();
  });
  
  if (str_ed == "") {
    str_ed = "All education categories";
  };
  if (str_ind2 == "") {
    str_ind2 = "Accommodation and Food Services";
  };
  
  subsetdata2();
  createSeries2();
  $.each(sub_bronx, function(items, item) {
    xcat.push(item.yyyyqq);
  });
  drawCharts2();
  });     
});
