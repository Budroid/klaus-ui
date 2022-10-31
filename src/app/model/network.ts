import {MapboxGeoJSONFeature} from "mapbox-gl";
import {AccessPoint} from "./accesspoint";

export interface Network extends MapboxGeoJSONFeature {
  id: number
  type: "Feature"
  properties: {
    active: boolean;
    ssid: string | undefined
    accessPoints: AccessPoint[]
  }
}
