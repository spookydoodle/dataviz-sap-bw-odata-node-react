
import React, { Component } from 'react';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { axisTop } from 'd3-axis';
import { max, groups, pairs, range, rollup, ascending, descending } from 'd3-array';
import { interpolateNumber } from 'd3-interpolate';
import { select } from 'd3-selection';
import { format } from 'd3-format';
import { utcFormat } from 'd3-time-format';
import { easeLinear } from 'd3-ease';
import { transition } from 'd3-transition';
import PALETTES from '../../constants/colors';

class RaceBarChart extends Component {
    constructor(props) {
        super(props)
        this.createBarChart = this.createBarChart.bind(this)
    } 

    componentDidMount() {
        this.createBarChart()
    }

    // componentDidUpdate() {
    //     this.createBarChart()
    // }

    createBarChart = async () => {
        const node = this.node;
        const data = this.props.data;
        const margin = ({ top: 16, right: 6, bottom: 6, left: 0 })
        const n = 8;
        const barSize = 40
        const height = margin.top + barSize * n + margin.bottom
        const width = 800;
        const duration = 1000;
        const k = 10;
        const formatNumber = format(",d")
        const formatDate = utcFormat("%B %d, %Y")
        const names = new Set(data.map(d => d.name))
        const dateValues = Array.from(rollup(data, ([d]) => d.value, d => +d.date, d => d.name))
            .map(([date, data]) => [new Date(date), data])
            .sort(([a], [b]) => ascending(a, b))
        
        const x = scaleLinear([0, 1], [margin.left, width - margin.right])
        const y = scaleBand()
            .domain(range(n + 1))
            .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
            .padding(0.1)

        function rank(value) {
            const data = Array.from(names, name => ({ name, value: value(name) }));
            data.sort((a, b) => descending(a.value, b.value));
            for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
            return data;
        }

        const keyframes = getKeyframes()
        const nameframes = groups(keyframes.map(([, data]) => data).flat(), d => d.name)
        const prev = new Map(nameframes.map(([, data]) => pairs(data, (a, b) => [b, a])).flat())
        const next = new Map(nameframes.map(([, data]) => pairs(data)).flat())

        // Add margin to the whole chart
        const chart = select(node)
            .attr("viewBox", [0, 0, width, height])

        const updateBars = bars(chart);
        const updateAxis = axis(chart);
        const updateLabels = labels(chart);
        const updateTicker = ticker(chart);

        // yield chart.node()

        for (const keyframe of keyframes) {
            const transition = chart.transition()
                .duration(duration)
                .ease(easeLinear);

            // Extract the top bar’s value.
            x.domain([0, keyframe[1][0].value]);

            updateAxis(keyframe, transition);
            updateBars(keyframe, transition);
            updateLabels(keyframe, transition);
            updateTicker(keyframe, transition);

            // invalidation.then(() => chart.interrupt());
            await transition.end();
        }

        // Functions
        function bars(chart) {
            let bar = chart.append("g")
                // .attr("fill-opacity", 0.6)
                .selectAll("rect");
            
            return ([date, data], transition) => bar = bar
                .data(data.slice(0, n), d => d.name)
                .join(
                    enter => enter.append("rect")
                        .attr("fill", color())
                        .attr("height", y.bandwidth())
                        .attr("x", x(0))
                        .attr("y", d => y((prev.get(d) || d).rank))
                        .attr("width", d => x((prev.get(d) || d).value) - x(0)),
                    update => update,
                    exit => exit.transition(transition).remove()
                        .attr("y", d => y((next.get(d) || d).rank))
                        .attr("width", d => x((next.get(d) || d).value) - x(0))
                )
                .call(bar => bar.transition(transition)
                    .attr("y", d => y(d.rank))
                    .attr("width", d => x(d.value) - x(0)));
        }

        function axis(chart) {
            const g = chart.append("g")
                .attr("transform", `translate(0,${margin.top})`);

            const axis = axisTop(x)
                .ticks(width / 160)
                .tickSizeOuter(0)
                .tickSizeInner(-barSize * (n + y.padding()));

            return (_, transition) => {
                g.transition(transition).call(axis);
                g.select(".tick:first-of-type text").remove();
                g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "rgba(255, 255, 255, 0.1)");
                g.select(".domain").remove();
            };
        }

        function labels(chart) {
            let label = chart.append("g")
                .style("font", "bold 12px var(--sans-serif)")
                .style("font-variant-numeric", "tabular-nums")
                .attr("text-anchor", "end")
                .attr('fill', "#ffffff")
                .selectAll("text");

            return ([date, data], transition) => label = label
                .data(data.slice(0, n), d => d.name)
                .join(
                    enter => enter.append("text")
                        .attr("transform", d => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
                        .attr("y", y.bandwidth() / 2)
                        .attr("x", -6)
                        .attr("dy", "-0.25em")
                        .text(d => d.name)
                        .call(text => text.append("tspan")
                            .attr("fill-opacity", 0.7)
                            .attr("font-weight", "normal")
                            .attr('fill', "#ffffff")
                            .attr("x", -6)
                            .attr("dy", "1.15em")),
                    update => update,
                    exit => exit.transition(transition).remove()
                        .attr("transform", d => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
                        .call(g => g.select("tspan").tween("text", d => textTween(d.value, (next.get(d) || d).value)))
                )
                .call(bar => bar.transition(transition)
                    .attr("transform", d => `translate(${x(d.value)},${y(d.rank)})`)
                    .call(g => g.select("tspan").tween("text", d => textTween((prev.get(d) || d).value, d.value))));
        }

        function ticker(chart) {
            const now = chart.append("text")
                .style("font", `bold ${barSize}px var(--sans-serif)`)
                .style("font-variant-numeric", "tabular-nums")
                .attr("text-anchor", "end")
                .attr("x", width - 6)
                .attr("y", margin.top + barSize * (n - 0.45))
                .attr("dy", "0.32em")
                .text(keyframes[0][0]);
                // .text(formatDate(keyframes[0][0]));

            return ([date], transition) => {
                transition.end().then(() => now.text(formatDate(date)));
                // transition.end().then(() => now.text(formatDate(date)));
            };
        }

        function textTween(a, b) {
            const i = interpolateNumber(a, b);
            return function (t) {
                this.textContent = formatNumber(i(t));
            };
        }


        function getKeyframes() {
            const keyframes = [];
            let ka, a, kb, b;
            for ([[ka, a], [kb, b]] of pairs(dateValues)) {
                for (let i = 0; i < k; ++i) {
                    const t = i / k;
                    keyframes.push([
                        new Date(ka * (1 - t) + kb * t),
                        rank(name => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t)
                    ]);
                }
            }
            keyframes.push([new Date(kb), rank(name => b.get(name) || 0)]);
            return keyframes;
        }

        function color(d) {
            // const scale = scaleOrdinal(schemeTableau10);
            const scale = scaleOrdinal(Object.values(PALETTES.GREEN_ORANGE));
            if (data.some(d => d.category !== undefined)) {
                const categoryByName = new Map(data.map(d => [d.name, d.category]))
                
                scale.domain(Array.from(categoryByName.values()));
                
                return d => scale(categoryByName.get(d.name));
            }
            
            return d => scale(d.name);
        }


    }

    render() {
        return (
            <svg
                ref={node => this.node = node}
                width={this.props.size.width}
                height={this.props.size.height}>
            </svg>
        )
    }
}

export default RaceBarChart;