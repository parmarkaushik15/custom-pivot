/**
 * Created by mkomwa on 5/4/17.
 */
export interface Visualization {
  id: string;
  name: string;
  type: string;
  created: string;
  lastUpdated: string;
  shape: string;
  details: {
    favorite: {
      type: string;
      id: string;
    }
    externalDimensions: Array<{
      name: string;
      value: string;
    }>,
    externalLayout: {
      rows: any[];
      columns: any[];
      filters: any[];
    },
  }
  layers: Array<{
    settings: any;
    analytics: any;
  }>;
  operatingLayers: Array<{
    settings: any;
    analytics: any;
  }>;

}
