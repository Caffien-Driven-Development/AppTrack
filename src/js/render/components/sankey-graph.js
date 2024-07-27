import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '@mui/material'
import { Chart, LinearScale, Tooltip } from 'chart.js'
import { Flow, SankeyController } from 'chartjs-chart-sankey'

Chart.register(SankeyController, Flow, LinearScale, Tooltip)

export default function ({ data, height }) {
    const [chart, setChart] = useState(null)
    const svgRef = useRef()

    const theme = useTheme()
    const isDarkTheme = theme.palette.mode === 'dark'

    const defaultColor = '#6abaaa'

    const drawChart = () => {
        const { nodes, links } = data

        const ctx = svgRef?.current.getContext('2d')

        const getColor = (c) => {
            return nodes?.find((n) => n.name === c)?.color || defaultColor
        }

        const l = nodes.reduce((acc, c) => {
            acc[c.name] = `${c.name} (${c.value})`
            return acc
        }, {})

        return new Chart(ctx, {
            type: 'sankey',
            data: {
                datasets: [
                    {
                        data: links,
                        labels: l,
                        colorFrom: (c) =>
                            getColor(
                                c?.dataset?.data[c.dataIndex]?.from ||
                                    defaultColor
                            ),
                        colorTo: (c) =>
                            getColor(
                                c?.dataset?.data[c.dataIndex]?.to ||
                                    defaultColor
                            ),
                        colorMode: 'gradient',
                        borderWidth: 1,
                        borderColor: 'black',
                        color: theme.palette.text.primary,
                    },
                ],
            },
            options: {
                onClick: function (evt, elements) {
                    if (elements.length > 0) {
                        // TODO run a search on this data and navigate to applications page
                        // const chart = this
                        // const element =
                        //     chart.getDatasetMeta(0).data[elements[0].index]
                        // const flow = element.from.to.find(
                        //     (n) => n.key === element.to.key
                        // ).flow
                        // console.log(
                        //     `Clicked on link from ${element.from.key} to ${element.to.key} -> ${flow}`
                        // )
                    }
                },
                plugins: {
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                const { dataset, dataIndex } = context
                                const { from, to, flow } =
                                    dataset.data[dataIndex]
                                const fromNodeValue = nodes.find(
                                    (n) => n.name === from
                                ).value
                                const percentFromFlow = (
                                    (flow / fromNodeValue) *
                                    100
                                ).toFixed(2)
                                return `${from} -> ${to}: ${flow} (${percentFromFlow}%)`
                            },
                        },
                    },
                },
                maintainAspectRatio: false,
            },
        })
    }

    useEffect(() => {
        chart?.destroy()
        setChart(null)
        setChart(drawChart())
    }, [theme.palette.mode, isDarkTheme])

    return (
        <canvas
            ref={svgRef}
            style={{
                maxHeight: `${height || 100}px`,
                minHeight: `${height || 100}px`,
                width: '100%',
            }}
        />
    )
}
