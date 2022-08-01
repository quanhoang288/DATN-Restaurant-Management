import React from 'react'
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const defaultOptions = {}

export default function PieChart(props) {
  const { title, labels, data, options } = props
  return <Pie title={title} options={{ ...defaultOptions, ...(options || {}) }} data={{ labels, datasets: data }} />
}

