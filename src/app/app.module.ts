import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {TreeModule} from "angular-tree-component";
import {OrgUnitService} from "./components/org-unit-filter/org-unit.service";
import {DndModule} from "ng2-dnd";
import {OrgUnitFilterComponent} from "./components/org-unit-filter/org-unit-filter.component";
import {PeriodFilterComponent} from "./components/period-filter/period-filter.component";
import {LocalStorageService} from "./services/local-storage.service";
import {DataService} from "./services/data.service";
import { DataAreaComponent } from './components/data-area/data-area.component';
import {uiState} from "./store/reducers/uiStateReducer";
import {storeData} from "./store/reducers/StoreDataReducer";
import {LoadMetaDataService} from "./store/effects/load-meta-data.service";
import {INITIAL_APPLICATION_STATE} from "./store/application.state";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {DataFilterComponent} from "./components/data-filter/data-filter.component";
import {FilterByNamePipe} from "./shared/pipes/filter-by-name.pipe";
import { MultiselectComponent } from './components/org-unit-filter/multiselect/multiselect.component';
import {ClickOutsideDirective} from "./components/org-unit-filter/click-outside.directive";
import {VisualizerService} from "./services/visualizer.service";

@NgModule({
  declarations: [
    AppComponent,
    OrgUnitFilterComponent,
    PeriodFilterComponent,
    DataAreaComponent,
    DataFilterComponent,
    FilterByNamePipe,
    MultiselectComponent,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TreeModule,
    DndModule.forRoot(),
    StoreModule.provideStore({ uiState,storeData },INITIAL_APPLICATION_STATE),
    EffectsModule.run(LoadMetaDataService),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  providers: [
    OrgUnitService,
    LocalStorageService,
    DataService,
    VisualizerService
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
