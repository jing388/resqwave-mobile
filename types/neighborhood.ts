export interface NeighborhoodData {
  id: string;
  name: string;
  registeredAt: string;
  lastUpdatedAt: string;
  terminalID: string;
  terminalAddress: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  approxHouseholds: number;
  approxResidents: number;
  avgHouseholdSize: number;
  floodwaterSubsidence: string;
  floodRelatedHazards: string[];
  notableInfo: string[];
  focalPerson: {
    name: string;
    avatar?: string;
    contactNo: string;
    email: string;
  };
  alternativeFocalPerson: {
    name: string;
    avatar?: string;
    contactNo: string;
    email: string;
  };
}

export interface FloodHazard {
  label: string;
  checked: boolean;
}

export interface EditedData {
  approxHouseholds: number;
  approxResidents: number;
  avgHouseholdSize: number;
  floodwaterSubsidence: string;
  floodRelatedHazards: FloodHazard[];
  notableInfo: string;
}
