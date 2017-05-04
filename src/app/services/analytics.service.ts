import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Constants} from "./constants";

@Injectable()
export class AnalyticsService {

  constructor(
    private constant: Constants,
    private http: Http
  ) { }

  public getAnalytics(favoriteObject: any, favoriteType: string, customFilter: any[] = [], externalSource: boolean = false): Observable<any> {
    let url = externalSource ? this._constructAnalyticUrlForExternalSource(favoriteObject) : this._constructAnalyticUrl(favoriteObject, favoriteType, customFilter);
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch(error => Observable.throw(new Error(error)));
  }

  private _constructAnalyticUrlForExternalSource(sourceObject) {
    let url: string = this.constant.api + "analytics.json?";

    sourceObject.forEach((item, index) => {
      url += index > 0 ? '&':'';
      url += 'dimension=' + item.name + ':' + item.value;
    });

    url += '&displayProperty=NAME';

    return url;
  }

  private _constructAnalyticUrl(favoriteObject: any, favoriteType: string, customFilter: any[]): string {
    let url: string = this.constant.api + "analytics";
    /**
     * Get row, column and filter parameters from object dimension
     * @type {string}
     */
    let rowParameters = this._getDimension('rows', favoriteObject, customFilter);
    let columnParameters = this._getDimension('columns', favoriteObject, customFilter);
    let filterParameters = this._getDimension('filters', favoriteObject, customFilter);

    /**
     * Get url extension based on favorite type
     */
    if (favoriteType == "EVENT_CHART") {
      url += "/events/aggregate/" + this._getProgramParameters(favoriteObject);

    } else if (favoriteType == "EVENT_REPORT") {
      if(favoriteObject.hasOwnProperty('dataType')) {
        if (favoriteObject.dataType == "AGGREGATED_VALUES") {
          url += "/events/aggregate/" + this._getProgramParameters(favoriteObject);
        } else {
          url += "/events/query/" + this._getProgramParameters(favoriteObject);
        }
      } else {
        console.warn('No dataType attribute found for event report');
      }

    } else if ( favoriteType=="EVENT_MAP") {
      url += "/events/aggregate/" + this._getProgramParameters(favoriteObject);

    } else if(favoriteType =='MAP' && favoriteObject.layer == 'event') {
      url += "/events/query/" + this._getProgramParameters(favoriteObject);

      /**
       * Also get startDate and end date if available
       */
      if(favoriteObject.hasOwnProperty('startDate') && favoriteObject.hasOwnProperty('endDate')) {
        url += 'startDate=' + favoriteObject.startDate + '&' + 'endDate=' + favoriteObject.endDate + '&';
      }

    } else {
      url += ".json?";
    }

    /**
     * Add row, column and filter parameters
     * @type {string}
     */
    url += rowParameters + '&' + columnParameters + '&' + filterParameters;

    /**
     * Also add analytics strategies
     * @type {string|string|string}
     */
    url += "&displayProperty=NAME" + favoriteType == "EVENT_CHART" ?
      "&outputType=EVENT&"
      : favoriteType == "EVENT_REPORT" ?
      "&outputType=EVENT&displayProperty=NAME"
      : favoriteType == "EVENT_MAP" ?
      "&outputType=EVENT&displayProperty=NAME"
      : "&displayProperty=NAME";

    url += favoriteObject.layer == 'event' ? "&coordinatesOnly=true" : "";

    return url;
  }

  private _getProgramParameters(favoriteObject: any): string {
    let params: string = "";
    if(favoriteObject.hasOwnProperty('program') && favoriteObject.hasOwnProperty('programStage')) {
      if(favoriteObject.program.hasOwnProperty('id') && favoriteObject.programStage.hasOwnProperty('id')) {
        params = favoriteObject.program.id + ".json?stage=" + favoriteObject.programStage.id + "&";
      } else {
        console.warn('Missing program and/or program stage identifiers');
      }
    } else {
      console.warn('Program and/or program stage not available')
    }
    return params;
  }

  private _getDimension(dimension: string, favoriteObject: any, customFilter: any[]): string {
    let items: string = "";
    if(favoriteObject.hasOwnProperty(dimension)) {
      favoriteObject[dimension].forEach((dimensionValue: any) => {
        items += items != "" ? '&' : "";
        if (dimensionValue.hasOwnProperty('dimension') && dimensionValue.dimension != 'dy') {
          items += dimension == 'filters' ? 'filter=' : 'dimension=';
          items += dimensionValue.dimension;
          items += dimensionValue.hasOwnProperty('legendSet') ? '-' + dimensionValue.legendSet.id : "";
          items += ':';
          items += dimensionValue.hasOwnProperty('filter') ? dimensionValue.filter : "";

          if(dimensionValue.hasOwnProperty('items') && dimensionValue.items.length > 0) {

            /**
             * Get custom value from filter if supplied
             * @type {string}
             */
            let customDimensionValue = this._getCustomDimensionValue(customFilter, dimensionValue.dimension);

            if( customDimensionValue != null) {
              items  += customDimensionValue +  ';';
            } else {
              dimensionValue.items.forEach((itemValue, itemIndex) => {
                items += itemValue.dimensionItem ? itemValue.dimensionItem : "";
                items += itemIndex == dimensionValue.items.length - 1 ? "" : ";";
              })
            }
          }
        } else {
          console.warn('Dimension object is not present');
        }
      });
    } else {
      console.warn('Specified dimension does not exist on this object')
    }
    return items;
  }

  private _getCustomDimensionValue(customFilter,dimension): string {
    let customValue: string = null;
    if(customFilter != undefined) {
      if(customFilter.length > 0) {
        for(let filter of customFilter) {
          if(filter.name === dimension) {
            customValue = filter.value;
            break;
          }
        }
      }
    }

    return customValue;
  }

}
