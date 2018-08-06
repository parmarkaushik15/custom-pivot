import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { UiState} from './ui-state';
import { StoreData} from './store-data';
import {storeData} from './reducers/StoreDataReducer';
import {uiState} from './reducers/uiStateReducer';

export interface ApplicationState {
  uiState: UiState,
  storeData: StoreData
}

export const reducers: ActionReducerMap<ApplicationState> = {
  uiState: uiState,
  storeData: storeData,
};

export const metaReducers: MetaReducer<ApplicationState>[] = !environment.production ? [] : [];
