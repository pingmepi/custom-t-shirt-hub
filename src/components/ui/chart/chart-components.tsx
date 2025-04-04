
import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"
import { useChart, ChartConfig, THEMES, ChartProvider } from "./chart-context"

export const ChartContainer = ({
  children,
  config,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
}) => {
  return (
    <div className={cn("", className)} {...props}>
      <ChartProvider config={config}>{children}</ChartProvider>
    </div>
  )
}

export const ChartLegend = React.forwardRef<
  RechartsPrimitive.Legend, 
  Omit<RechartsPrimitive.LegendProps, "ref">
>(({ className, ...props }, ref) => {
  return (
    <RechartsPrimitive.Legend
      ref={ref as any}
      iconSize={10}
      iconType="circle"
      layout="horizontal"
      verticalAlign="bottom"
      align="center"
      {...props}
    />
  )
})
ChartLegend.displayName = "ChartLegend"

export const ChartTooltip = React.forwardRef<
  RechartsPrimitive.Tooltip,
  Omit<RechartsPrimitive.TooltipProps, "ref" | "className"> & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <RechartsPrimitive.Tooltip
      ref={ref as any}
      cursor={{ opacity: 0.5 }}
      offset={10}
      wrapperClassName={cn("!outline-none", className)}
      {...props}
    />
  )
})
ChartTooltip.displayName = "ChartTooltip"

export const ChartGrid = React.forwardRef<
  RechartsPrimitive.CartesianGrid,
  Omit<RechartsPrimitive.CartesianGridProps, "ref">
>(({ className, ...props }, ref) => {
  return (
    <RechartsPrimitive.CartesianGrid
      ref={ref as any}
      className={cn("", className)}
      strokeDasharray="3 3"
      {...props}
    />
  )
})
ChartGrid.displayName = "ChartGrid"

export const ChartArea = React.forwardRef<
  RechartsPrimitive.Area,
  Omit<RechartsPrimitive.AreaProps, "ref" | "dataKey"> & {
    dataKey: string
  }
>(({ className, dataKey, ...props }, ref) => {
  const { config } = useChart()
  const item = config[dataKey]

  if (!item) {
    return null
  }

  return (
    <RechartsPrimitive.Area
      ref={ref as any}
      className={cn("", className)}
      dataKey={dataKey}
      fill={item.color ? item.color : undefined}
      stroke={item.color ? item.color : undefined}
      {...props}
    />
  )
})
ChartArea.displayName = "ChartArea"

export const ChartBar = React.forwardRef<
  RechartsPrimitive.Bar,
  Omit<RechartsPrimitive.BarProps, "ref" | "dataKey"> & {
    dataKey: string
  }
>(({ className, dataKey, ...props }, ref) => {
  const { config } = useChart()
  const item = config[dataKey]

  if (!item) {
    return null
  }

  return (
    <RechartsPrimitive.Bar
      ref={ref as any}
      className={cn("", className)}
      dataKey={dataKey}
      fill={item.color ? item.color : undefined}
      {...props}
    />
  )
})
ChartBar.displayName = "ChartBar"

export const ChartLine = React.forwardRef<
  RechartsPrimitive.Line,
  Omit<RechartsPrimitive.LineProps, "ref" | "dataKey"> & {
    dataKey: string
  }
>(({ className, dataKey, ...props }, ref) => {
  const { config } = useChart()
  const item = config[dataKey]

  if (!item) {
    return null
  }

  return (
    <RechartsPrimitive.Line
      ref={ref as any}
      className={cn("", className)}
      dataKey={dataKey}
      stroke={item.color ? item.color : undefined}
      {...props}
    />
  )
})
ChartLine.displayName = "ChartLine"

export const ChartXAxis = React.forwardRef<
  RechartsPrimitive.XAxis,
  Omit<RechartsPrimitive.XAxisProps, "ref">
>(({ className, ...props }, ref) => {
  return (
    <RechartsPrimitive.XAxis
      ref={ref as any}
      className={cn("", className)}
      axisLine={false}
      tickLine={false}
      tick={{ transform: "translate(0, 6)" }}
      {...props}
    />
  )
})
ChartXAxis.displayName = "ChartXAxis"

export const ChartYAxis = React.forwardRef<
  RechartsPrimitive.YAxis,
  Omit<RechartsPrimitive.YAxisProps, "ref">
>(({ className, ...props }, ref) => {
  return (
    <RechartsPrimitive.YAxis
      ref={ref as any}
      className={cn("", className)}
      axisLine={false}
      tickLine={false}
      width={80}
      {...props}
    />
  )
})
ChartYAxis.displayName = "ChartYAxis"

export const ChartPie = React.forwardRef<
  RechartsPrimitive.Pie,
  Omit<RechartsPrimitive.PieProps, "ref" | "dataKey" | "nameKey"> & {
    dataKey: string
    nameKey: string
  }
>(({ className, dataKey, nameKey, ...props }, ref) => {
  return (
    <RechartsPrimitive.Pie
      ref={ref as any}
      className={cn("", className)}
      dataKey={dataKey}
      nameKey={nameKey}
      {...props}
    />
  )
})
ChartPie.displayName = "ChartPie"

export const ChartScatter = React.forwardRef<
  RechartsPrimitive.Scatter,
  Omit<RechartsPrimitive.ScatterProps, "ref" | "dataKey"> & {
    dataKey: string
  }
>(({ className, dataKey, ...props }, ref) => {
  const { config } = useChart()
  const item = config[dataKey]

  if (!item) {
    return null
  }

  return (
    <RechartsPrimitive.Scatter
      ref={ref as any}
      className={cn("", className)}
      dataKey={dataKey}
      fill={item.color ? item.color : undefined}
      {...props}
    />
  )
})
ChartScatter.displayName = "ChartScatter"

export const ChartRadar = React.forwardRef<
  RechartsPrimitive.Radar,
  Omit<RechartsPrimitive.RadarProps, "ref" | "dataKey"> & {
    dataKey: string
  }
>(({ className, dataKey, ...props }, ref) => {
  const { config } = useChart()
  const item = config[dataKey]

  if (!item) {
    return null
  }

  return (
    <RechartsPrimitive.Radar
      ref={ref as any}
      className={cn("", className)}
      dataKey={dataKey}
      stroke={item.color ? item.color : undefined}
      fill={item.color ? item.color : undefined}
      {...props}
    />
  )
})
ChartRadar.displayName = "ChartRadar"

export const ChartRadialBar = React.forwardRef<
  RechartsPrimitive.RadialBar,
  Omit<RechartsPrimitive.RadialBarProps, "ref" | "dataKey"> & {
    dataKey: string
  }
>(({ className, dataKey, ...props }, ref) => {
  const { config } = useChart()
  const item = config[dataKey]

  if (!item) {
    return null
  }

  return (
    <RechartsPrimitive.RadialBar
      ref={ref as any}
      className={cn("", className)}
      dataKey={dataKey}
      {...props}
    />
  )
})
ChartRadialBar.displayName = "ChartRadialBar"
