import { Injectable } from '@angular/core';
import {Constants} from "./constants";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class AnalyticscreatorService {

  constructor(private constant: Constants, private http: Http,) { }

  prepareAnalytics( dimensions:any ){
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
      height:0,
    }
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
    url += '&displayProperty=NAME&'+showData;

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
