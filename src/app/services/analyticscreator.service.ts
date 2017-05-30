import { Injectable } from '@angular/core';
import {Constants} from "./constants";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import * as _ from 'lodash';


@Injectable()
export class AnalyticscreatorService {
  public current_normal_analytics:any = null;
  public analytics_lists = [];
  constructor(private constant: Constants, private http: Http,) { }

  prepareAnalytics( dimensions:any, repeat:boolean = false ){
    if( repeat ){
      return Observable.create(observor => {
        observor.next( this.current_normal_analytics );
        observor.complete();
      })
    }else{
      if(this._checkIfAllDimensionExists(dimensions)){
        return this.http.get(this._constructAnalyticUrlForExternalSource(dimensions,"skipData=false"))
          .map(res => res.json() || null);
      }else{
        return Observable.create(observor => {
          observor.next( null );
          observor.complete();
        })
      }
    }


  }

  // a function that will return analytics without data for data drawing.
  prepareEmptyAnalytics( dimensions:any ){
    if(this._checkIfAllDimensionExists(dimensions)){
      return this.http.get(this._constructAnalyticUrlForExternalSource(dimensions,"skipData=true"))
        .map(res => res.json() || null);
    }else{
      return Observable.create(observor => {
        observor.next( null );
        observor.complete();
      })
    }
  }

  // merge analytics calls
  mergeAnalyticsCalls( analytics: any[] ){
    let combined_analytics = {
      headers:[],
      metaData:{
        names:{},
        dx:[],
        pe:[],
        ou:[],
        co:[]
      },
      rows:[],
      width:0,
      height:0
    };

    analytics.forEach( (analytic) => {
      combined_analytics.headers = analytic.headers;
      let namesArray = this._getArrayFromObject(analytic.metaData.names);
      namesArray.forEach((name) => {
        if(!combined_analytics.metaData.names[name.id]){
          combined_analytics.metaData.names[name.id] = name.value;
        }
      });
      analytic.metaData.dx.forEach((val) => {
        if(!_.includes(combined_analytics.metaData.dx, val)){
          combined_analytics.metaData.dx.push( val );
        }
      });
      analytic.metaData.ou.forEach((val) => {
        if(!_.includes(combined_analytics.metaData.pe, val)){
          combined_analytics.metaData.ou.push( val );
        }
      });
      analytic.metaData.pe.forEach((val) => {
        if(!_.includes(combined_analytics.metaData.pe, val)){
          combined_analytics.metaData.pe.push( val );
        }
      });
      if(analytic.metaData.co){
        analytic.metaData.co.forEach((val) => {
          if(!_.includes(combined_analytics.metaData.co, val)){
            combined_analytics.metaData.co.push( val );
          }
        })
      }
    });
    return combined_analytics;
  }

  duplicateAnalytics(analytics,data,oldDataId){
    let newAnalytics = _.cloneDeep(analytics);
    newAnalytics.metaData.dx = [data.id];
    delete newAnalytics.metaData.names[oldDataId];
    newAnalytics.metaData.names[data.id] = data.name;
    return newAnalytics;
  }

  private _getArrayFromObject(object){
    return _.map(object, function(value, prop) {
      return { id: prop, value: value };
    });
  }

  // prepare analytics from a group of dimension object and specify weather to skip data or not
  private _constructAnalyticUrlForExternalSource(sourceObject,showData) {
    let url: string = this.constant.api + "analytics.json?";

    sourceObject.forEach((item, index) => {
      if(item && item.value ){
        url += index > 0 ? '&':'';
        url += 'dimension=' + item.name + ':' + item.value;
      }
    });
    url += '&displayProperty=NAME&hierarchyMeta=true&'+showData;

    return url;
  }

  getAnalyticsparams( dimensions ){
    let url: string = "";
    dimensions.forEach((item, index) => {
      if(item && item.value ){
        url += index > 0 ? '&':'';
        url += 'dimension=' + item.name + ':' + item.value;
      }
    });

    return url;
  }

  // a function used to check if all dimensions are available to prepare analytics
  private _checkIfAllDimensionExists(dimensions:any): boolean{
    let checker = true;
    dimensions.forEach((item, index) => {
      if(item && item.value ){

      }else{
        checker = false;
      }
    });
    return checker
  }
}
