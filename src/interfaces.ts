export interface StateItem {
  id: string;
  title: string;
  text: string;
  color: string;
  position: {
    x: number;
    y: number;
  },
  connections: Connections[];
}

export interface Connections {
  from: number,
  to: number,
}

export interface State {
  [key: string]: StateItem;
}