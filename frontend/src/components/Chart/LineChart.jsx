import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const defaultOptions = {
  responsive: true,
  // maintainAspectRatio: false,

  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
    },
  },
};

export default function LineChart(props) {
  const { title, labels, data, options } = props;
  return (
    <Line
      title={title}
      options={{ ...defaultOptions, ...(options || {}) }}
      data={{ labels, datasets: data }}
    />
  );
}
