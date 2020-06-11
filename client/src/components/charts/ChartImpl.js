
import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import { useStyles } from '../../styles/main';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import { max } from 'd3-array';
import { select } from 'd3-selection';

// TODO: implement minHeight, minWidth, scroll within a card, padding and margin on chart, max length of a category name
class ChartImpl extends Component {
   constructor(props) {
      super(props)
      this.createBarChart = this.createBarChart.bind(this)
   }

   componentDidMount() {
      this.createBarChart()
   }

   // componentDidUpdate() {
   //    this.createBarChart()
   // }

   createBarChart() {
      const node = this.node;
      const {
         categories,
         values,
         chartHeight,
         xScale,
         yScale,
         xRect,
         yRect,
         widthRect,
         heightRect,
         xCatAngle,
         yCatAngle,
         size,
         resize = "fixed",
         margin,
         offset,
         barColor,
         xFontColor,
         yFontColor,
      } = this.props;



      const chart = select(node)

      // Add responsiveness to the chart based on the 'resize' parameter, by default fixed size
      if (resize === "responsive") chart.attr("viewBox", [0, -20, this.props.size.width, this.props.size.height])

      // Add margin to the whole chart
      chart.append('g')
         .attr('transform', `translate(${margin.top}, ${margin.left})`)

      // Add y axis
      chart.append('g')
         .call(axisLeft(yScale))
         .attr('transform', `translate(${offset.left}, 0)`)
         // TODO: move to a separate method
         .selectAll("text")
         .attr("transform", `translate(0, 0)rotate(${yCatAngle})`)
         .style("text-anchor", "end")
         .style("font-size", 10)
         .style("fill", yFontColor)

      // Add x axis
      chart.append('g')
         .attr('transform', `translate(${offset.left}, ${chartHeight})`)
         .call(axisBottom(xScale))
         // TODO: move to a separate method
         .selectAll("text")
         .attr("transform", `translate(0, 0)rotate(${xCatAngle})`)
         .style("text-anchor", "end")
         .style("font-size", 10)
         .style("fill", xFontColor)

      // Add data bars
      chart.selectAll()
         .data(values)
         .enter()
         .append('rect')
         .attr('x', xRect)
         .attr('y', yRect)
         .attr('height', heightRect)
         .attr('width', widthRect)
         .style('fill', barColor)



   }

   render() {
      return (
         <svg
            ref={node => this.node = node}
            width={this.props.size.width}
            height={this.props.size.height}
         >
         </svg>
      )
   }
}


export default ChartImpl;