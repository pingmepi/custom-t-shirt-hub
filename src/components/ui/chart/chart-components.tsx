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

export const ChartLegend = ({
  className,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Legend>) => {
  return (
    <RechartsPrimitive.Legend
      className={cn("", className)}
      iconSize={10}
      iconType="circle"
      layout="horizontal"
      verticalAlign="bottom"
      align="center"
      {...props}
    />
  )
}

export const ChartTooltip = ({
  className,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip>) => {
  return (
    <RechartsPrimitive.Tooltip
      cursor={{ opacity: 0.5 }}
      offset={10}
      wrapperClassName={cn("!outline-none", className)}
      {...props}
    />
  )
}

export const ChartGrid = ({
  className,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.CartesianGrid>) => {
  return (
    <RechartsPrimitive.CartesianGrid
      className={cn("", className)}
      strokeDasharray="3 3"
      {...props}
    />
  )
}

export const ChartArea = ({
  className,
  dataKey,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Area> & {
  dataKey: string
}) => {
  const { config } = useChart()
  const item = config[dataKey]

  if (!item) {
    return null
  }

  return (
    <RechartsPrimitive.Area
      className={cn("", className)}
      dataKey={dataKey}
      fill={item.color ? item.color : undefined}
      stroke={item.color ? item.color : undefined}
      {...props}
    />
  )
}

export const ChartBar = ({
  className,
  dataKey,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Bar> & {
  dataKey: string
}) => {
  const { config } = useChart()
  const item = config[dataKey]

  if (!item) {
    return null
  }

  return (
    <RechartsPrimitive.Bar
      className={cn("", className)}
      dataKey={dataKey}
      fill={item.color ? item.color : undefined}
      {...props}
    />
  )
}

export const ChartLine = ({
  className,
  dataKey,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Line> & {
  dataKey: string
}) => {
  const { config } = useChart()
  const item = config[dataKey]

  if (!item) {
    return null
  }

  return (
    <RechartsPrimitive.Line
      className={cn("", className)}
      dataKey={dataKey}
      stroke={item.color ? item.color : undefined}
      {...props}
    />
  )
}

export const ChartXAxis = ({
  className,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.XAxis>) => {
  return (
    <RechartsPrimitive.XAxis
      className={cn("", className)}
      axisLine={false}
      tickLine={false}
      tick={{ transform: "translate(0, 6)" }}
      {...props}
    />
  )
}

export const ChartYAxis = ({
  className,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.YAxis>) => {
  return (
    <RechartsPrimitive.YAxis
      className={cn("", className)}
      axisLine={false}
      tickLine={false}
      width={80}
      {...props}
    />
  )
}

export const ChartPie = ({
  className,
  dataKey,
  nameKey,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Pie> & {
  dataKey: string
  nameKey: string
}) => {
  return (
    <RechartsPrimitive.Pie
      className={cn("", className)}
      dataKey={dataKey}
      nameKey={nameKey}
      {...props}
    />
  )
}

export const ChartScatter = ({
  className,
  dataKey,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Scatter> & {
  dataKey: string
}) => {
  const { config } = useChart()
  const item = config[dataKey]

  if (!item) {
    return null
  }

  return (
    <RechartsPrimitive.Scatter
      className={cn("", className)}
      dataKey={dataKey}
      fill={item.color ? item.color : undefined}
      {...props}
    />
  )
}

export const ChartRadar = ({
  className,
  dataKey,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Radar> & {
  dataKey: string
}) => {
  const { config } = useChart()
  const item = config[dataKey]

  if (!item) {
    return null
  }

  return (
    <RechartsPrimitive.Radar
      className={cn("", className)}
      dataKey={dataKey}
      stroke={item.color ? item.color : undefined}
      fill={item.color ? item.color : undefined}
      {...props}
    />
  )
}

export const ChartRadialBar = ({
  className,
  dataKey,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.RadialBar> & {
  dataKey: string
}) => {
  const { config } = useChart()
  const item = config[dataKey]

  if (!item) {
    return null
  }

  return (
    <RechartsPrimitive.RadialBar
      className={cn("", className)}
      dataKey={dataKey}
      {...props}
    />
  )
}
