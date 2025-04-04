
import { ChartConfig, useChart, THEMES } from "./chart-context"
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartGrid,
  ChartArea,
  ChartBar,
  ChartLine,
  ChartXAxis,
  ChartYAxis,
  ChartPie,
  ChartScatter,
  ChartRadar,
  ChartRadialBar
} from "./chart-components"
import {
  ResponsiveContainer,
  AreaChart,
  BarChart,
  LineChart,
  ComposedChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  ScatterChart
} from "./chart-containers"

// Export components directly
export {
  // Context
  useChart,
  THEMES,
  
  // Components
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartGrid,
  ChartArea,
  ChartBar,
  ChartLine,
  ChartXAxis,
  ChartYAxis,
  ChartPie,
  ChartScatter,
  ChartRadar,
  ChartRadialBar,
  
  // Containers
  ResponsiveContainer,
  AreaChart,
  BarChart,
  LineChart,
  ComposedChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  ScatterChart
}

// Export types separately
export type { ChartConfig }
