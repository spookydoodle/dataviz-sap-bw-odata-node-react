
import React, { Component } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import ChartImpl from './ChartImpl';
import PALETTES from '../../constants/colors';
const colors = Object.values(PALETTES.GREEN_ORANGE)

const VerticalBarChart = ({ data, size, resize }) => {
   const values = data.map(row => row.value)
   const categories = data.map(row => row.category)
   // const maxValue = max(values)
   const maxValue = 1000000

   // TODO: calculate based on longest category text length and font size
   const offset = { 
      top: 0, 
      left: maxValue.toString().length * 10, 
      bottom: categories.reduce((longestStr, str) => longestStr.length < str.length ? str : longestStr).length * 4, 
      right: 0, 
   }
   const margin = {top: 0, left: 20, bottom: 20, right: 20}
   const chartWidth = size.width - margin.left - margin.right - offset.left - offset.right;
   const chartHeight = size.height - margin.left - margin.right - offset.top - offset.bottom;

   // Horizontal axis
   const xScale = scaleBand()
      .range([0, chartWidth])
      .domain(categories)

   // Vertical axis
   const yScale = scaleLinear()
      .range([0, chartHeight])
      .domain([maxValue, 0])

   const xRect = (d, i) => offset.left + 0.05 * xScale.bandwidth() + xScale(categories[i])
   const yRect = (d, i) => yScale(d)
   const heightRect = d => chartHeight - yScale(d)
   const widthRect = d => 0.9 * xScale.bandwidth() 


   return (
      <ChartImpl
         categories={categories}
         values={values}
         chartHeight={chartHeight}
         chartWidth={chartWidth}
         xScale={xScale}
         yScale={yScale}
         xRect={xRect}
         yRect={yRect}
         widthRect={widthRect}
         heightRect={heightRect}
         xCatAngle={-45}
         yCatAngle={0}
         size={size}
         resize={resize}
         margin={margin}
         offset={offset}
         barColor={colors[0]}
         xFontColor="#404040"
         yFontColor="#404040"
      />
   )

}

export default VerticalBarChart;