import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import {DataService} from '../../services/data.service';

import {
  DATAELEMENT_KEY, INDICATOR_KEY, INDICATOR_GROUP_KEY,
  DATAELEMENT_GROUP_KEY, CATEGORY_COMBOS_KEY, ORGANISATION_UNIT_KEY, DATASET_KEY
} from '../../services/local-storage.service';
import {
  ADD_DATA_ANALYITICS, ADD_EMPTY_ANALYITICS
} from '../actions';
import {AnalyticscreatorService} from '../../services/analyticscreator.service';

@Injectable()
export class LoadMetaDataService {

  constructor(private actions$: Actions, private analyticsService: AnalyticscreatorService) {

  }

  // @Effect() emptyAnalytics$: Observable<Action> = this.actions$
  //   .ofType(ADD_EMPTY_ANALYITICS)
  //   .switchMap(action => this.analyticsService.prepareAnalytics(action.payload))
  //   .map(items => new AddEmptyAnalyticsDoneAction(items) );
  //
  // @Effect() analyticsWithData$: Observable<Action> = this.actions$
  //   .ofType(ADD_DATA_ANALYITICS)
  //   .switchMap(action => this.analyticsService.prepareEmptyAnalytics(action.payload))
  //   .map(items => new AddDataAnalyticsDoneAction(items) );

}
