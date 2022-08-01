import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const defaultOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
}

export default function VerticalBarChart(props) {
  const { title, labels, data, options } = props
  return <Bar title={title} options={{ ...defaultOptions, ...(options || {}) }} data={{ labels, datasets: data }} />
}

