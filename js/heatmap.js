define(["d3", "jquery"], function(d3, $) {return function(gSelection) {

  var valueAccess = null;
  var width = null;
  var height = null;
  var x = d3.scale.ordinal();
  var y = d3.scale.ordinal();
  var colorFn = null;
  var margin = {top: 25, bottom: 5, left: 10, right: 10};
  var cells = null;
  var cellsEnter = null;

  function setData(data, columns, idAccess) {
    idAccess = idAccess || function(d, i) {return i;};

    data = data.map(function(d, i) {
      return $.extend({x: i % columns, y: Math.floor(i / columns)}, d);
    });

    x.domain(d3.range(d3.max(data, function(d) {return d.x;}) + 1));
    y.domain(d3.range(d3.max(data, function(d) {return d.y;}) + 1));

    cells = gSelection.selectAll('rect.cell').data(data, idAccess);

    cellsEnter = cells
      .enter()
      .append('rect')
      .classed('cell', true)
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('width', 0)
      .attr('height', 0)
      .attr('fill', 'white');

    cells
      .exit()
      .transition()
      .duration(TRANSITION_DURATION)
      .attr('x', function(d) {return x(d.x) + x.rangeBand() / 2;})
      .attr('y', function(d) {return y(d.y) + y.rangeBand() / 2;})
      .attr('width', 0)
      .attr('height', 0)
      .remove();

    visualize();

    return this;
  }

  function color(_colorFn) {
    colorFn = _colorFn;
    return this;
  }

  function visualize(_width, _height) {
    if (!_width || !_height || !cells) {return;}
    width  = _width  - (margin.left + margin.right );
    height = _height - (margin.top  + margin.bottom);
    x.rangeBands([margin.left, width + margin.left], 0.02);
    y.rangeBands([margin.top, height + margin.top], 0.1);

    cellsEnter
      .attr('x', function(d) {return x(d.x) + x.rangeBand() / 2;})
      .attr('y', function(d) {return y(d.y) + y.rangeBand() / 2;});

    cells
      .transition()
      .duration(TRANSITION_DURATION)
      .attr('x', function(d) {return x(d.x);})
      .attr('y', function(d) {return y(d.y);})
      .attr('width', function(d) {return x.rangeBand();})
      .attr('height', function(d) {return y.rangeBand();})
      .attr('fill', colorFn);
  }

  var exports = {
    setData: setData,
    color: color,
    visualize: visualize
  };

  return $.extend(exports, {});
};});
