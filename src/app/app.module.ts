import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { TreeModule } from "angular-tree-component";
import { OrgUnitService } from "./components/org-unit-filter/org-unit.service";
import { DndModule } from "ng2-dnd";
import { OrgUnitFilterComponent } from "./components/org-unit-filter/org-unit-filter.component";
import { PeriodFilterComponent } from "./components/period-filter/period-filter.component";
import { LocalStorageService } from "./services/local-storage.service";
import { DataService } from "./services/data.service";
import { DataAreaComponent } from './components/data-area/data-area.component';
import { uiState } from "./store/reducers/uiStateReducer";
import { storeData } from "./store/reducers/StoreDataReducer";
import { LoadMetaDataService } from "./store/effects/load-meta-data.service";
import { INITIAL_APPLICATION_STATE } from "./store/application.state";
import { DataFilterComponent } from "./components/data-filter/data-filter.component";
import { FilterByNamePipe } from "./shared/pipes/filter-by-name.pipe";
import { MultiselectComponent } from './components/org-unit-filter/multiselect/multiselect.component';
import { ClickOutsideDirective } from "./components/org-unit-filter/click-outside.directive";
import { VisualizerService } from "./services/visualizer.service";
import { LayoutComponent } from "./components/layout/layout.component";
import { Draggable } from "./shared/draggable-directive.directive";
import {TableComponent} from "./components/table/table.component";
import {TableService} from "./services/table.service";
import {Constants} from "./services/constants";
import {VisualizationStore} from "./services/visualization-store";
import {AnalyticsService} from "./services/analytics.service";
import {NgxPaginationModule} from "ngx-pagination";
import {AnalyticscreatorService} from "./services/analyticscreator.service";
import {HttpClientService} from "./services/http-client.service";
import {FuseSearchPipe} from "./shared/pipes/fuse-search.pipe";
import { AutoGrowingComponent } from './components/auto-growing/auto-growing.component';
import { RemoveNaNPipe } from './pipes/remove-na-n.pipe';
import { OptionsComponent } from './components/options/options.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import {ExcelDownloadService} from "./services/excel-download.service";

@NgModule({
  declarations: [
    AppComponent,
    OrgUnitFilterComponent,
    PeriodFilterComponent,
    DataAreaComponent,
    DataFilterComponent,
    FilterByNamePipe,
    MultiselectComponent,
    LayoutComponent,
    TableComponent,
    ClickOutsideDirective,
    Draggable,
    FuseSearchPipe,
    AutoGrowingComponent,
    RemoveNaNPipe,
    OptionsComponent,
    OrderByPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    TreeModule,
    NgxPaginationModule,
    DndModule.forRoot(),
    StoreModule.provideStore({ uiState: uiState, storeData: storeData },INITIAL_APPLICATION_STATE),
    EffectsModule.run(LoadMetaDataService)
  ],
  providers: [
    OrgUnitService,
    ExcelDownloadService,
    LocalStorageService,
    DataService,
    VisualizerService,
    TableService,
    VisualizationStore,
    AnalyticsService,
    Constants,
    AnalyticscreatorService,
    HttpClientService
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
