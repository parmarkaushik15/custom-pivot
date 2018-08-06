
export interface UiState {
    loadingOrganisationUnit: boolean;
    loadingData: boolean;
    loadingDataMessage: string;
    loadingDataElements: boolean;
    layoutOpened: boolean;
    currentError?: string;
    dataAreaOpen: boolean;
    dataAreaOpenState: string;
}


export const INITIAL_UI_STATE: UiState = {
  loadingOrganisationUnit: false,
  loadingData: false,
  loadingDataMessage: '',
  loadingDataElements: false,
  currentError: '',
  layoutOpened: false,
  dataAreaOpen: true,
  dataAreaOpenState: 'active'
};
