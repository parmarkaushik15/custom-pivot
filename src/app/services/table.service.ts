import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {VisualizerService} from './visualizer.service';
import {Constants} from './constants';
import {Visualization} from '../model/visualization-object';
import {AnalyticsService} from './analytics.service';
import {VisualizationStore} from './visualization-store';
import {HttpClientService} from './http-client.service';

export interface TableConfiguration {
  showColumnTotal: boolean;
  showColumnSubtotal: boolean;
  showRowTotal: boolean;
  showRowSubtotal: boolean;
  showDimensionLabels: boolean;
  hideEmptyRows: boolean;
  showHierarchy: boolean;
  rows: any[];
  columns: any[];
  displayList: boolean;
}


@Injectable()
export class TableService {

  constructor(
    private visualizationStore: VisualizationStore,
    private analyticsService: AnalyticsService,
    private visualizationService: VisualizerService,
    private http: HttpClientService,
    private constant: Constants
  ) {
  }

  public getSanitizedTableData(tableData: Visualization, customFilters): Observable<Visualization> {
    return Observable.create(observer => {
      const tableDataFromStore = this.visualizationStore.find(tableData.id);
      if (tableDataFromStore !== null) {
        tableDataFromStore.layers.forEach(layer => {
          if (!layer.settings.hasOwnProperty('tableConfiguration')) {
            layer.settings.tableConfiguration = this._getTableConfiguration(layer.settings, tableDataFromStore.type);
          }
        });

        if (customFilters.length > 0) {
          tableDataFromStore.layers.forEach(layer => {
            this.analyticsService.getAnalytics(layer.settings, tableDataFromStore.type, customFilters).subscribe(analyticResult => {
              layer.analytics = analyticResult;

              /**
               * Also update in visualization store
               */
              this.visualizationStore.createOrUpdate(tableDataFromStore);

              /**
               * Return the sanitized data back to chart service
               */
              observer.next(tableDataFromStore);
              observer.complete();

            }, error => {
              console.warn(error);
            })
          })
        } else {
          /**
           * Also update in visualization store
           */
          this.visualizationStore.createOrUpdate(tableDataFromStore);

          /**
           * Return the sanitized data back to chart service
           */
          observer.next(tableDataFromStore);
          observer.complete();

        }


      } else {
        if (tableData.details.hasOwnProperty('favorite')) {
          const favoriteType = tableData.details.favorite.hasOwnProperty('type') ? tableData.details.favorite.type : null;
          const favoriteId = tableData.details.favorite.hasOwnProperty('id') ? tableData.details.favorite.id : null;

          /**
           * Check if favorite has required parameters for favorite call
           */
          if (favoriteType !== null && favoriteId !== null) {
            this.http.get(this.constant.api + favoriteType + 's/' + favoriteId + '.json?fields=*,dataElementDimensions[dataElement[id,optionSet[id,options[id,name]]]],displayDescription,program[id,name],programStage[id,name],interpretations[*,user[id,displayName],likedBy[id,displayName],comments[lastUpdated,text,user[id,displayName]]],columns[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],rows[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],filters[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],access,userGroupAccesses,publicAccess,displayDescription,user[displayName,dataViewOrganisationUnits],!href,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!organisationUnitGroups,!itemOrganisationUnitGroups,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits')
              .subscribe((favoriteResponse: any) => {
                /**
                 * Get table configuration
                 * @type {TableConfiguration}
                 */
                favoriteResponse.tableConfiguration = this._getTableConfiguration(favoriteResponse, tableData.type);

                this.analyticsService.getAnalytics(favoriteResponse, tableData.type, customFilters).subscribe(analyticResponse => {

                  /**
                   * Update table data with new information
                   */
                  tableData.layers.push({settings: favoriteResponse, analytics: analyticResponse});

                  /**
                   * Also update operating layers for runtime activities, this will be used for on fly updates
                   */
                  // tableData.operatingLayers.push({settings: favoriteResponse, analytics: analyticResponse});

                  /**
                   * Also save in visualization store
                   */
                  this.visualizationStore.createOrUpdate(tableData);

                  /**
                   * Return the sanitized data back to chart service
                   */
                  observer.next(tableData);
                  observer.complete();

                }, analyticsError => {
                  observer.error(analyticsError);
                })

              }, favoriteError => {
                observer.error(favoriteError)
              })
          } else {
            observer.error('Favorite essential parameters are not supplied');
          }
        } else if (tableData.details.hasOwnProperty('externalDimensions') && tableData.layers.length === 0) {
          const nullItems: any[] = [];
          for (const dimension of tableData.details.externalDimensions) {
            if (dimension.value === null) {
              nullItems.push(dimension.name);
            }
          }

          if (nullItems.length > 0) {
            const errorMessage: string = 'Provide values for dimensions';
            // nullItems.forEach(item => {
            //
            // })
            observer.error(errorMessage)
          } else {
            this.analyticsService.getAnalytics(tableData.details.externalDimensions, null, [], true)
              .subscribe((analyticResponse) => {
                /**
                 * Get table configuration
                 * @type {TableConfiguration}
                 */
                const settings: any = {};
                settings.tableConfiguration = this._getTableConfiguration({}, tableData.type, tableData.details.externalLayout);
                /**
                 * Update table data with new information
                 */
                tableData.layers = [];
                tableData.layers.push({settings: settings, analytics: analyticResponse});

                /**
                 * Return the sanitized data back to chart service
                 */
                observer.next(tableData);
                observer.complete();

              }, error => {
                observer.error(error);
              })
          }
        } else if (tableData.layers.length > 0) {
          tableData.layers.forEach(layer => {
            /**
             * Get table configuration
             * @type {TableConfiguration}
             */
            const settings: any = {};
            settings.tableConfiguration = this._getTableConfiguration({}, tableData.type, tableData.details.externalLayout);
            layer.settings = settings
          })

          /**
           * Return the sanitized data back to chart service
           */
          observer.next(tableData);
          observer.complete();
        } else {
          observer.error('No favorite or external dimension supplied');
        }
      }
    })
  }

  private _getTableConfiguration(favoriteObject, favoriteType, externalLayout: any = null): TableConfiguration {

    /**
     * Get columns
     * @type {Array}
     */
    let columns: any[] = [];
    if (favoriteObject.hasOwnProperty('columns')) {
      favoriteObject.columns.forEach(colValue => {
        if (colValue.dimension !== 'dy') {
          columns.push(colValue.dimension);
        }
      });
    } else if (externalLayout !== null && externalLayout.hasOwnProperty('columns')) {
      columns = externalLayout.columns;
    } else {
      columns = ['dx'];
    }

    /**
     * Get rows
     * @type {Array}
     */
    let rows: any[] = [];
    if (favoriteObject.hasOwnProperty('rows')) {
      favoriteObject.rows.forEach(rowValue => {
        if (rowValue.dimension !== 'dy') {
          rows.push(rowValue.dimension)
        }
      })
    } else if (externalLayout !== null && externalLayout.hasOwnProperty('rows')) {
      rows = externalLayout.rows;
    } else {
      rows = ['pe'];
    }

    return {
      showColumnTotal: favoriteObject.hasOwnProperty('colTotal') ? favoriteObject.colTotal : true,
      showColumnSubtotal: favoriteObject.hasOwnProperty('colSubtotal') ? favoriteObject.colSubtotal : true,
      showRowTotal: favoriteObject.hasOwnProperty('rowTotal') ? favoriteObject.rowTotal : true,
      showRowSubtotal: favoriteObject.hasOwnProperty('rowSubtotal') ? favoriteObject.rowSubtotal : true,
      showDimensionLabels: favoriteObject.hasOwnProperty('showDimensionLabels') ? favoriteObject.showDimensionLabels : true,
      hideEmptyRows: favoriteObject.hasOwnProperty('hideEmptyRows') ? favoriteObject.hideEmptyRows : true,
      showHierarchy: favoriteObject.hasOwnProperty('showHierarchy') ? favoriteObject.showHierarchy : true,
      displayList: this._checkForEventDataType(favoriteObject, favoriteType),
      rows: rows,
      columns: columns
    }
  }

  private _checkForEventDataType(favoriteObject, favoriteType): boolean {
    let displayList: boolean = false;
    if (favoriteType === 'EVENT_REPORT') {
      if (favoriteObject.hasOwnProperty('dataType') && favoriteObject.dataType === 'EVENTS') {
        displayList = true;
      }
    }
    return displayList;
  }

  public getTableObjects(tableData: Visualization): any[] {
    const tableObjects: any[] = [];
    if (tableData.layers.length > 0) {
      tableData.layers.forEach(layer => {
        if (layer.analytics.hasOwnProperty('headers')) {
          tableObjects.push(this.visualizationService.drawTable(layer.analytics, layer.settings.tableConfiguration));
        } else {
          console.warn('Analytic object is empty');
        }
      })
    }
    return tableObjects;
  }

}
