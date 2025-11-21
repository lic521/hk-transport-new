export enum TransportMode {
  WALK = 'WALK',
  SUBWAY = 'SUBWAY',
  BUS = 'BUS',
  TRAM = 'TRAM',
  FERRY = 'FERRY',
  TAXI = 'TAXI'
}

export interface RouteStep {
  mode: TransportMode;
  instruction: string;
  duration: string;
  locationName: string; // Name of the station/stop
  waitMinutes?: number; // Simulated ETA
  lineName?: string; // e.g., "Island Line", "Bus 101"
}

export interface RouteOption {
  id: string;
  summary: string;
  totalDuration: string;
  cost: string;
  steps: RouteStep[];
  tags: string[]; // e.g., "Fastest", "Cheapest", "Least Walking"
}

export type Screen = 'search' | 'routes' | 'details';

export interface SearchQuery {
  origin: string;
  destination: string;
}