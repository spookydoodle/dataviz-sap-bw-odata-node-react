
import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import { useStyles } from '../../styles/main';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import ChartImpl from './ChartImpl';
import PALETTES from '../../constants/colors';
const colors = Object.values(PALETTES.GREEN_ORANGE)

const HorizontalBarChart = ({ data, size, resize }) => {
   const values = data.map(row => row.value)
   const categories = data.map(row => row.category)
   const maxValue = max(values)

   // TODO: handle optional props for axis offset from chart borders
   const offset = { 
       top: 0, 
       left: categories.reduce((longestStr, str) => longestStr.length < str.length ? str : longestStr).length * 6, 
       bottom: maxValue.toString().length * 4, 
       right: 0, 
    }
   const margin = {top: 20, left: 20, bottom: 20, right: 20}
   const chartWidth = size.width - margin.left - margin.right - offset.left - offset.right;
   const chartHeight = size.height - margin.left - margin.right - offset.top - offset.bottom;

   // Horizontal axis
   const xScale = scaleLinear()
   .range([0, chartWidth])
   .domain([0, maxValue])

   // Vertical axis
   const yScale = scaleBand()
      .range([0, chartHeight])
      .domain(categories)

   const xRect = (d, i) => offset.left + xScale(0)
   const yRect = (d, i) => 0.05 * yScale.bandwidth() + yScale(categories[i])
   const heightRect = d => 0.9 * yScale.bandwidth()
   const widthRect = d => xScale(d)


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

export default HorizontalBarChart;