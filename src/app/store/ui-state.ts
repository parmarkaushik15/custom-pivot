
export interface UiState {
    loadingOrganisationUnit:boolean;
    loadingData: boolean;
    loadingDataElements:boolean;
    layoutOpened:boolean;
    currentError?: string;
    dataAreaOpen: boolean;
}


export const INITIAL_UI_STATE: UiState = {
  loadingOrganisationUnit: false,
  loadingDataElements: false,
  layoutOpened: false,
  loadingData: false,
  dataAreaOpen: true,
};
