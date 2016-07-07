
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

function pushOccData(dobj, things) {
  dobj.push({'education': things[0],
          'industry': things[1],
          'occupation': things[2],
          'pct': parseFloat(things[3]),
          'earn': parseFloat(things[4]),
          'sample': parseFloat(things[5])});
};

$(function () {
  var nycdata = [];
  var nycoccdata = [];
  
  var xcat = []; /* Used by all QWI charts */
    
  /* Vars used for education charts */
  var emp_alled = [];
  var emp_lths = [];
  var emp_hs = [];
  var emp_scaa = [];
  var emp_ba = [];
  var emp_na = [];

  var empearn_alled = [];
  var empearn_lths = [];
  var empearn_hs = [];
  var empearn_scaa = [];
  var empearn_ba = [];
  var empearn_na = [];

  var hire_alled = [];
  var hire_lths = [];
  var hire_hs = [];
  var hire_scaa = [];
  var hire_ba = [];
  var hire_na = [];

  var earnhire_alled = [];
  var earnhire_lths = [];
  var earnhire_hs = [];
  var earnhire_scaa = [];
  var earnhire_ba = [];
  var earnhire_na = [];

  var subset = [];
  var occsubset = [];
  var sub_alled = [];
  var sub_lths = [];
  var sub_hs = [];
  var sub_scaa = [];
  var sub_ba = [];
  var sub_na = [];

  var str_cty = "";
  var str_ind = "";

  var parentmap = [{id: 'All education categories', name: 'All education categories', color: Highcharts.getOptions().colors[0]},
    {id: "Bachelor's or advanced degree", name: "Bachelor's or advanced degree", color: Highcharts.getOptions().colors[4]},
    {id: 'Less than high school', name: 'Less than high school', color: Highcharts.getOptions().colors[1]},
    {id: 'High school or equivalent, no college', name: 'High school or equivalent, no college', color: Highcharts.getOptions().colors[2]},
    {id: 'Some college or Associate degree', name: 'Some college or Associate degree', color: Highcharts.getOptions().colors[3]}];

  var outmap = [];
  var outotal = [];
  var totals = [];
    
  /* Helper function to create data series for charts */
  function filldata (subdata,outemp, outearn, outhire, outhirearn) {
    $.each(subdata, function(items, item) {
      outemp.push(item.EmpS);
      outearn.push(item.EarnS);
      outhire.push(item.HirAS);
      outhirearn.push(item.EarnHirAS);
    });
  };
    
  /* Functions used for education charts */
  function clearArrays() {
    xcat = [];
    emp_alled = [];
    emp_lths = [];
    emp_hs = [];
    emp_scaa = [];
    emp_ba = [];
    emp_na = [];

    empearn_alled = [];
    empearn_lths = [];
    empearn_hs = [];
    empearn_scaa = [];
    empearn_ba = [];
    empearn_na = [];

    hire_alled = [];
    hire_lths = [];
    hire_hs = [];
    hire_scaa = [];
    hire_ba = [];
    hire_na = [];

    earnhire_alled = [];
    earnhire_lths = [];
    earnhire_hs = [];
    earnhire_scaa = [];
    earnhire_ba = [];
    earnhire_na = [];

    subset = [];
    sub_alled = [];
    sub_lths = [];
    sub_hs = [];
    sub_scaa = [];
    sub_ba = [];
    sub_na = [];
    
    occsubset = [];
    outmap = [];
    outotal = [];
    totals = [];
  }
  
  function subsetdata() {
    subset = $.grep(nycdata, function (n,i) {
      return (n.geography == str_cty && n.industry == str_ind);
    });
    
    sub_alled = $.grep(subset, function (n,i){
      return (n.education == 'All education categories');
    });
    sub_lths = $.grep(subset, function (n,i){
      return (n.education == 'Less than high school');
    });
    sub_hs = $.grep(subset, function (n,i){
      return (n.education == 'High school or equivalent, no college');
    });
    sub_scaa = $.grep(subset, function (n,i){
      return (n.education == 'Some college or Associate degree');
    });
    sub_ba = $.grep(subset, function (n,i){
      return (n.education == "Bachelor's or advanced degree");
    });
    sub_na = $.grep(subset, function (n,i){
      return (n.education == "Not available");
    });
    
    occsubset = $.grep(nycoccdata, function (n,i) {
      return (n.industry == str_ind);
    });
    $.each(occsubset, function(items, item) {
      if (item.occupation == "All occupations") {
        outotal.push({occupation: item.occupation, education: item.education, pct: item.pct, earnings: item.earn});
      }
      else {
        outmap.push({name: item.occupation, parent: item.education, value: item.pct, earnings: item.earn});
      }
    });
    outmap = parentmap.concat(outmap);

  };

  function createSeries() {
    filldata(sub_alled, emp_alled, empearn_alled, hire_alled, earnhire_alled);
    filldata(sub_lths, emp_lths, empearn_lths, hire_lths, earnhire_lths);
    filldata(sub_hs, emp_hs, empearn_hs, hire_hs, earnhire_hs);
    filldata(sub_scaa, emp_scaa, empearn_scaa, hire_scaa, earnhire_scaa);
    filldata(sub_ba, emp_ba, empearn_ba, hire_ba, earnhire_ba);
    filldata(sub_na, emp_na, empearn_na, hire_na, earnhire_na);

    totals = outmap.reduce(function (acc, obj) { 
      if (!acc[obj.parent]) {
        acc[obj.parent] = {
          value: 0,
          education: obj.parent
        };
      totals.push(acc[obj.parent]);
      }
      if (isNaN(acc[obj.parent].value) == false) {
        acc[obj.parent].value += obj.value;
      }
      return acc;
    }, {});
  }

  function drawCharts(){
    $('#div_empnum').highcharts({
      title: {
        text: "Employment (Stable)"
      },
      subtitle: {
        text: str_cty + ": " + str_ind
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
        name: 'All education categories',
        data: emp_alled
      },
      {
        name: 'Less than high school',
        data: emp_lths
      },
      {
        name: 'High school or equivalent, no college',
        data: emp_hs
      },
      {
        name: 'Some college or Associate degree',
        data: emp_scaa
      },
      {
        name: "Bachelor's or advanced degree",
        data: emp_ba
      },
      {
        name: 'Not available (24 years or younger)',
        data: emp_na
      }]
    });
    $('#div_empearn').highcharts({
      title: {
        text: "Employment earnings (Stable)"
      },
      subtitle: {
        text: str_cty + ": " + str_ind
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
        name: 'All education categories',
        data: empearn_alled
      },
      {
        name: 'Less than high school',
        data: empearn_lths
      },
      {
        name: 'High school or equivalent, no college',
        data: empearn_hs
      },
      {
        name: 'Some college or Associate degree',
        data: empearn_scaa
      },
      {
        name: "Bachelor's or advanced degree",
        data: empearn_ba
      },
      {
        name: 'Not available (24 years or younger)',
        data: empearn_na
      }]
    });
    $('#div_hirenum').highcharts({
      title: {
        text: "Hires (Stable)"
      },
      subtitle: {
        text: str_cty + ": " + str_ind
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
        name: 'All education categories',
        data: hire_alled
      },
      {
        name: 'Less than high school',
        data: hire_lths
      },
      {
        name: 'High school or equivalent, no college',
        data: hire_hs
      },
      {
        name: 'Some college or Associate degree',
        data: hire_scaa
      },
      {
        name: "Bachelor's or advanced degree",
        data: hire_ba
      },
      {
        name: 'Not available (24 years or younger)',
        data: hire_na
      }]
    });
    $('#div_hirearn').highcharts({
      title: {
        text: "Hires earnings (Stable)"
      },
      subtitle: {
        text: str_cty + ": " + str_ind
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
        name: 'All education categories',
        data: earnhire_alled
      },
      {
        name: 'Less than high school',
        data: earnhire_lths
      },
      {
        name: 'High school or equivalent, no college',
        data: earnhire_hs
      },
      {
        name: 'Some college or Associate degree',
        data: earnhire_scaa
      },
      {
        name: "Bachelor's or advanced degree",
        data: earnhire_ba
      },
      {
        name: 'Not available (24 years or younger)',
        data: earnhire_na
      }]
    });    
  };
  
  function drawOccs() {
  $('#div_occmap').highcharts({
      series: [{
        type: "treemap",
        layoutAlgorithm: 'sliceAndDice',
        alternateStartingDirection: true,
        levels: [{
            level: 1,
            layoutAlgorithm: 'sliceAndDice',
            dataLabels: {
              enabled: true,
              align: 'left',
              verticalAlign: 'top',
              style: {
                fontSize: '15px',
                fontWeight: 'bold'
              }
            }
          }],
        data: outmap
      }],
      credits: {
        enabled: false
      },
    tooltip: {
      formatter: function() {
        if (this.point.name == "All education categories" || this.point.name == "Bachelor's or advanced degree" ||
          this.point.name == "Less than high school" || this.point.name == "High school or equivalent, no college" || 
          this.point.name == "Some college or Associate degree") {
            var ed = this.point.name;
            var tearn = $.grep(outotal, function (n,i) {
              return (n.education == ed);
            });
            return '<b>'+ this.point.name +'</b>: ' + Highcharts.numberFormat(totals[this.point.name].value * 100, 1) + '%, <br> Annual earnings: $' +
              Highcharts.numberFormat(tearn[0].earnings, 0, ".", " ") + '<br><em>Percents do not sum to 100 due to sample size exclusions.</em>';
        }
        else return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.point.value * 100,1) + '%, <br> Annual earnings: $' + 
          Highcharts.numberFormat(this.point.earnings, 0, ".", " ");
      }
    },
    title: {
       text: 'Occupations (All New York City)'
      },
    subtitle: {
      text: str_ind
    },
    });    
  }
  
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
    $.get('nyc_acs.tsv', function (acsdata, status) {
      var lines = qwidata.split('\n');
    
      $.each(lines, function(lineNo, line) {
        var items = line.split('\t');
        if (lineNo > 0) {
          pushData(nycdata, items);
        }
      });

      var occlines = acsdata.split('\n');
    
      $.each(occlines, function(lineNo, line) {
        var items = line.split('\t');
        if (lineNo > 0) {
          pushOccData(nycoccdata, items);
        }
      });
      
      $("#sel_cty").change(function() {
        str_cty = "";
        clearArrays();
        $("#sel_cty option:selected" ).each(function() {
          str_cty = $( this ).text();
        });
        console.log(str_cty);
        subsetdata();
        createSeries();
        $.each(sub_alled, function(items, item) {
          xcat.push(item.yyyyqq);
        });
        drawCharts();
      });
    
      $("#sel_ind").change(function() {
        str_ind = "";
        clearArrays();
        $("#sel_ind option:selected" ).each(function() {
          str_ind = $( this ).text();
        });
        console.log(str_ind);
        subsetdata();
        createSeries();
        $.each(sub_alled, function(items, item) {
          xcat.push(item.yyyyqq);
        });
        drawCharts();
        drawOccs();
      });
      
      if (str_cty == "") {
        str_cty = "All counties/boroughs";
      };
      if (str_ind == "") {
        str_ind = "Accommodation and Food Services";
      };
      
      subsetdata();
      createSeries();
      
      $.each(sub_alled, function(items, item) {
        xcat.push(item.yyyyqq);
      });
      drawCharts();
      //console.log($("#div_empearn").height());
      drawOccs();
  
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
});
