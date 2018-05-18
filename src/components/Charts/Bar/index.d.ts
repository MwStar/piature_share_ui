import * as React from 'react';
export interface IBarProps {
  title: React.ReactNode;
  color?: string;
  padding?: [number, number, number, number];
  height: number;
  ticks: Array;
  mask: string;
  data: Array<{
    x: string;
    y: number;
  }>;
  autoLabel?: boolean;
  style?: React.CSSProperties;
}

export default class Bar extends React.Component<IBarProps, any> {}
