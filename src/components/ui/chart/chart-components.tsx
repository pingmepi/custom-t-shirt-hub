
import React, { forwardRef } from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

// Tooltip Component
export interface ChartTooltipProps extends React.ComponentPropsWithoutRef<typeof RechartsPrimitive.Tooltip> {
  className?: string;
}

export const ChartTooltip = ({ className, ...props }: ChartTooltipProps) => (
  <RechartsPrimitive.Tooltip 
    cursor={{ strokeDasharray: "3 3" }} 
    wrapperStyle={{ outline: "none" }}
    contentStyle={{ 
      background: "hsl(var(--popover))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)"
    }}
    {...props} 
  />
);

// Legend Component
export interface ChartLegendProps extends React.ComponentPropsWithoutRef<typeof RechartsPrimitive.Legend> {}

export const ChartLegend = forwardRef<typeof RechartsPrimitive.Legend, ChartLegendProps>(({ className, ...props }, ref) => (
  <RechartsPrimitive.Legend 
    iconSize={16}
    iconType="circle"
    layout="horizontal"
    align="center"
    verticalAlign="bottom"
    wrapperStyle={{ paddingTop: "16px", outline: "none" }}
    className={cn(className)}
    ref={ref as any}
    {...props} 
  />
));
ChartLegend.displayName = "ChartLegend";

// Cartesian Grid Component
export interface ChartCartesianGridProps extends React.ComponentPropsWithoutRef<typeof RechartsPrimitive.CartesianGrid> {}

export const ChartCartesianGrid = ({ className, ...props }: ChartCartesianGridProps) => (
  <RechartsPrimitive.CartesianGrid 
    strokeDasharray="3 3" 
    stroke="hsl(var(--border))"
    className={cn(className)}
    {...props} 
  />
);

// Area Component
export interface ChartAreaProps extends React.ComponentPropsWithoutRef<typeof RechartsPrimitive.Area> {
  dataKey: string; 
}

export const ChartArea = forwardRef<typeof RechartsPrimitive.Area, ChartAreaProps>(({ className, dataKey, ...props }, ref) => (
  <RechartsPrimitive.Area 
    type="monotone" 
    dataKey={dataKey}
    stroke="hsl(var(--primary))"
    fill="hsl(var(--primary)/.2)"
    strokeWidth={2}
    activeDot={{ r: 6 }}
    className={cn(className)}
    ref={ref as any}
    {...props} 
  />
));
ChartArea.displayName = "ChartArea";

// Bar Component
export interface ChartBarProps extends React.ComponentPropsWithoutRef<typeof RechartsPrimitive.Bar> {
  dataKey: string;
}

export const ChartBar = forwardRef<typeof RechartsPrimitive.Bar, ChartBarProps>(({ className, dataKey, ...props }, ref) => (
  <RechartsPrimitive.Bar 
    dataKey={dataKey}
    fill="hsl(var(--primary))"
    radius={4}
    className={cn(className)}
    ref={ref as any}
    {...props} 
  />
));
ChartBar.displayName = "ChartBar";

// Line Component
export interface ChartLineProps extends React.ComponentPropsWithoutRef<typeof RechartsPrimitive.Line> {
  dataKey: string;
}

export const ChartLine = forwardRef<typeof RechartsPrimitive.Line, ChartLineProps>(({ className, dataKey, ...props }, ref) => (
  <RechartsPrimitive.Line 
    type="monotone" 
    dataKey={dataKey}
    stroke="hsl(var(--primary))"
    strokeWidth={2}
    activeDot={{ r: 6 }}
    className={cn(className)}
    ref={ref as any}
    {...props} 
  />
));
ChartLine.displayName = "ChartLine";

// X Axis Component
export interface ChartXAxisProps extends React.ComponentPropsWithoutRef<typeof RechartsPrimitive.XAxis> {}

export const ChartXAxis = ({ className, ...props }: ChartXAxisProps) => (
  <RechartsPrimitive.XAxis 
    tick={{ fill: "hsl(var(--foreground))" }}
    tickLine={{ stroke: "hsl(var(--border))" }}
    axisLine={{ stroke: "hsl(var(--border))" }}
    className={cn(className)}
    {...props} 
  />
);

// Y Axis Component
export interface ChartYAxisProps extends React.ComponentPropsWithoutRef<typeof RechartsPrimitive.YAxis> {}

export const ChartYAxis = ({ className, ...props }: ChartYAxisProps) => (
  <RechartsPrimitive.YAxis 
    tick={{ fill: "hsl(var(--foreground))" }}
    tickLine={{ stroke: "hsl(var(--border))" }}
    axisLine={{ stroke: "hsl(var(--border))" }}
    className={cn(className)}
    {...props} 
  />
);

// Pie Component
export interface ChartPieProps extends React.ComponentPropsWithoutRef<typeof RechartsPrimitive.Pie> {
  dataKey: string;
  nameKey: string;
}

export const ChartPie = forwardRef<typeof RechartsPrimitive.Pie, ChartPieProps>(({ className, dataKey, nameKey, ...props }, ref) => (
  <RechartsPrimitive.Pie 
    dataKey={dataKey}
    nameKey={nameKey}
    fill="hsl(var(--primary))"
    stroke="hsl(var(--background))"
    className={cn(className)}
    ref={ref as any}
    {...props} 
  />
));
ChartPie.displayName = "ChartPie";

// Scatter Component
export interface ChartScatterProps extends React.ComponentPropsWithoutRef<typeof RechartsPrimitive.Scatter> {
  dataKey: string;
}

export const ChartScatter = forwardRef<typeof RechartsPrimitive.Scatter, ChartScatterProps>(({ className, dataKey, ...props }, ref) => (
  <RechartsPrimitive.Scatter 
    dataKey={dataKey}
    fill="hsl(var(--primary))"
    className={cn(className)}
    ref={ref as any}
    {...props} 
  />
));
ChartScatter.displayName = "ChartScatter";

// Radar Component
export interface ChartRadarProps extends React.ComponentPropsWithoutRef<typeof RechartsPrimitive.Radar> {
  dataKey: string;
}

export const ChartRadar = forwardRef<typeof RechartsPrimitive.Radar, ChartRadarProps>(({ className, dataKey, ...props }, ref) => (
  <RechartsPrimitive.Radar 
    dataKey={dataKey}
    fill="hsl(var(--primary)/.2)"
    stroke="hsl(var(--primary))"
    className={cn(className)}
    ref={ref as any}
    {...props} 
  />
));
ChartRadar.displayName = "ChartRadar";

// Radial Bar Component
export interface ChartRadialBarProps extends React.ComponentPropsWithoutRef<typeof RechartsPrimitive.RadialBar> {
  dataKey: string;
}

export const ChartRadialBar = forwardRef<typeof RechartsPrimitive.RadialBar, ChartRadialBarProps>(({ className, dataKey, ...props }, ref) => (
  <RechartsPrimitive.RadialBar 
    dataKey={dataKey}
    fill="hsl(var(--primary))"
    className={cn(className)}
    ref={ref as any}
    {...props} 
  />
));
ChartRadialBar.displayName = "ChartRadialBar";

// Container Component
export interface ChartContainerProps extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
}

export const ChartContainer = ({ className, children, ...props }: ChartContainerProps) => (
  <div className={cn("h-80 w-full", className)} {...props}>
    <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
      {children as React.ReactElement}
    </RechartsPrimitive.ResponsiveContainer>
  </div>
);
