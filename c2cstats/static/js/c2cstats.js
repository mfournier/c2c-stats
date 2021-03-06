/*
# Copyright (c) 2012 Simon C. <contact at saimon.org>
# see https://github.com/saimn/c2c-stats/LICENSE
*/

(function( $ ){
  var defaults = {
    barWidth: 0.8,
    colors: ['#4575B4', '#D73027', '#91BFDB', '#FC8D59',
             '#E0F3F8', '#FEE090', '#FFFFBF'],
    grid: {
      hoverable: true,
      borderWidth: 0,
    },
  };

  var methods = {
    init : function( options ) {
      // THIS
    },
    pie : function (data) {
      var values = [];
      $.each(data.values, function(index, value) {
        values.push({label: data.labels[index],  data: value});
      });

      var $this = $(this);
      $this.before('<h2>'+data.title+'</h2>');

      var plot = $.plot($this, values, {
        series: {
          pie: { show: true },
        },
        colors: defaults.colors,
        legend: {
          show: true,
          labelBoxBorderColor: null,
        },
        grid: defaults.grid,
        tooltip: true,
        tooltipOpts: {
          content: "%s, %y sorties (%p.0%)",
          shifts: {
            x: 20,
            y: 0
          },
          defaultTheme: false
        }
      });
      $this.resize(function () {
        plot.setupGrid();
        plot.draw();
      });
    },

    bar : function (data) {
      var values = [];
      $.each(data.values, function(index, value) {
        values.push([index, value]);
      });

      var labels = [];
      $.each(data.labels, function(index, value) {
        labels.push([index + defaults.barWidth/2., value]);
      });

      var $this = $(this);
      $this.before('<h2>'+data.title+'</h2>');

      var width = 30*data.labels.length;
      $this.width(width)

      $.plot($this, [values], {
        series: {
          bars: {
            show: true,
            barWidth: defaults.barWidth,
            lineWidth: 0,
            fillColor: defaults.colors[0],
            horizontal: false
          },
        },
        xaxis: { ticks: labels },
        yaxis: { tickDecimals: 0 },
        grid: defaults.grid,
        tooltip: true,
        tooltipOpts: {
          content: "%y",
          shifts: {
            x: 0,
            y: 20
          },
          defaultTheme: false
        }
      });
    },

    lines : function (data) {
      var $this = $(this);
      $this.before('<h2>'+data.title+'</h2>');

      var values = [];
      $.each(data.values_per_month, function(i, year) {
        var d = [];
        $.each(year, function(j, value) {
          d.push([j+1, value]);
        });
        values.push({
          data: d,
          label: data.labels[i],
        });
      });

      var months = ["jan", "fev", "mar", "avr", "mai", "jui",
                    "jui", "aou", "sep", "oct", "nov", "dec"];
      var labels = [];
      $.each(months, function(index, value) {
        labels.push([index+1, value]);
      });

      $.plot($this, values, {
        series: {
          lines: { show: true },
          points: { show: true }
        },
        legend: {
          labelBoxBorderColor: null,
          position: "nw"
        },
        grid: defaults.grid,
        xaxis: {
          show: true,
          ticks: labels
        },
        tooltip: true,
        tooltipOpts: {
          content: "%x/%s : %y m",
          shifts: {
            x: -50,
            y: 20
          },
          defaultTheme: false
        }
      });
    }

  };

  $.fn.c2cstats = function( method ) {

    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.c2cstats' );
    }

  };

})( jQuery );
