export type Location = {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type ProtectedSpace = {
  id: number;
  address: string;
  description: string;
  imageUrl: string;
  coordinate: Coordinate;
};
