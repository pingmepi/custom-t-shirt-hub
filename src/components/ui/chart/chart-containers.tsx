import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"
import { ChartProvider } from "./chart-context"

export const ResponsiveContainer = ({
  className,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>) => {
  return (
    <RechartsPrimitive.ResponsiveContainer
      className={cn("", className)}
      width="100%"
      height={350}
      {...props}
    />
  )
}

export const AreaChart = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.AreaChart>) => {
  return (
    <RechartsPrimitive.AreaChart
      className={cn("", className)}
      margin={{
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
      }}
      {...props}
    >
      {children}
    </RechartsPrimitive.AreaChart>
  )
}

export const BarChart = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.BarChart>) => {
  return (
    <RechartsPrimitive.BarChart
      className={cn("", className)}
      margin={{
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
      }}
      {...props}
    >
      {children}
    </RechartsPrimitive.BarChart>
  )
}

export const LineChart = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.LineChart>) => {
  return (
    <RechartsPrimitive.LineChart
      className={cn("", className)}
      margin={{
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
      }}
      {...props}
    >
      {children}
    </RechartsPrimitive.LineChart>
  )
}

export const ComposedChart = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.ComposedChart>) => {
  return (
    <RechartsPrimitive.ComposedChart
      className={cn("", className)}
      margin={{
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
      }}
      {...props}
    >
      {children}
    </RechartsPrimitive.ComposedChart>
  )
}

export const PieChart = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.PieChart>) => {
  return (
    <RechartsPrimitive.PieChart
      className={cn("", className)}
      margin={{
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
      }}
      {...props}
    >
      {children}
    </RechartsPrimitive.PieChart>
  )
}

export const RadarChart = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.RadarChart>) => {
  return (
    <RechartsPrimitive.RadarChart
      className={cn("", className)}
      margin={{
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
      }}
      {...props}
    >
      {children}
    </RechartsPrimitive.RadarChart>
  )
}

export const RadialBarChart = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.RadialBarChart>) => {
  return (
    <RechartsPrimitive.RadialBarChart
      className={cn("", className)}
      margin={{
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
      }}
      {...props}
    >
      {children}
    </RechartsPrimitive.RadialBarChart>
  )
}

export const ScatterChart = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.ScatterChart>) => {
  return (
    <RechartsPrimitive.ScatterChart
      className={cn("", className)}
      margin={{
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
      }}
      {...props}
    >
      {children}
    </RechartsPrimitive.ScatterChart>
  )
}
