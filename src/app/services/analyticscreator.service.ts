import { Injectable } from '@angular/core';
import {Constants} from "./constants";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import * as _ from 'lodash';
import {SpecificPeriodService} from "../components/period-filter/period.service";
import {LocalStorageService, ORGANISATION_UNIT_KEY} from "./local-storage.service";


@Injectable()
export class AnalyticscreatorService {
  public current_normal_analytics:any = null;
  public analytics_lists = [];
  constructor(private constant: Constants,
              private http: Http,
              private periodService:SpecificPeriodService,
              private localStorageService:LocalStorageService
  ) { }

  prepareAnalytics(layout, dimensions:any, repeat:boolean = false ){
    console.log(layout)
    if( repeat ){
      return Observable.create(observor => {
        observor.next( this.current_normal_analytics );
        observor.complete();
      })
    }else{
      if(this._checkIfAllDimensionExists(dimensions)){
        return this.http.get(this._constructAnalyticUrlForExternalSource(layout,dimensions,"skipData=false"))
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
      return this.http.get(this._constructAnalyticUrlForExternalSource("",dimensions,"skipData=true"))
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
          combined_analytics.metaData.names[val] = this.periodService.getPeriodName(val);
        }
      });
      if(analytic.metaData.co){
        analytic.metaData.co.forEach((val) => {
          if(!_.includes(combined_analytics.metaData.co, val)){
            combined_analytics.metaData.co.push( val );
          }
        })
      }
      analytic.rows.forEach( (row) => {
        combined_analytics.rows.push(row);
      })
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
  private _constructAnalyticUrlForExternalSource(layout,sourceObject,showData) {
    let url: string = this.constant.api + "analytics.json?";

    sourceObject.forEach((item, index) => {
      // let textToUse = (layout.filters.indexOf(item.name) == -1)?"dimension=":"filter=";
      let textToUse = "dimension=";
      if(item && item.value ){
        url += index > 0 ? '&':'';
        url += textToUse + item.name + ':' + item.value;
      }
    });
    url += '&displayProperty=NAME&hierarchyMeta=true&'+showData;
    console.log("url:",url);
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

  // a function to add sub-column in table object
  addColumnSubTotal( tableObject ) {
    let data = _.cloneDeep(tableObject);
    if(data.headers && data.headers.length > 1){
      let span_distance = data.headers[0].items[0].span;
      let some_header = [];
      let some_rows = [];
      // Processing headers
      data.headers.forEach( (header) => {
        let some_items = [];
        let current_distance = header.items[0].span;
        let limit = (span_distance - current_distance)+1;
        let check_counter = 1;
        header.items.forEach( (item,index) => {
          if((check_counter % limit) == 0){
            some_items.push(item);
            some_items.push({name:'total',span:1})
          }else{
            some_items.push(item);
          }
          check_counter++;

        });
        some_header.push({items:some_items,style: ""});
      //
      })

      // Processing rows
      data.rows.forEach( (row) => {
        let counter = 1;
        let some_row_item = [];
        let sum = 0;
        row.items.forEach( (item) => {
          if(item.hasOwnProperty("header")){
            some_row_item.push(item)
          }else{
            let item_value = parseFloat(item.val);
            if((counter % span_distance) == 0){
              some_row_item.push(item);
              sum += (item_value)?item.val : 0;
              some_row_item.push({name:'total', val: +sum.toFixed(2), row_span:1,subtotal_column:true})
              sum = 0;
            }else{
              sum += (item_value)?item.val : 0;
              some_row_item.push(item);
            }
            counter++
          }
        });
        some_rows.push({items:some_row_item,headers:row.headers});
      });
      return {
        headers : some_header,
        rows : some_rows,
        columns : data.columns,
        titles : data.titles,
        title : data.title
      };
    }else{
      return data;
    }
  }

  // This function will add a ti
  addColumnTotal( tableObject ){
    let data = _.cloneDeep(tableObject);
    let some_header = [];
    let some_rows = [];
    // Adding title to the rows
    data.headers.forEach( (header) => {
      let some_items = [];
      header.items.forEach( ( item ) => {
          some_items.push( item );
      });
      some_items.push( {name:'total',span:1} );
      some_header.push( {items:some_items,style: ""} );

    });

    // Processing rows
    data.rows.forEach( (row) => {
      let some_row_item = [];
      let sum = 0;
      row.items.forEach( (item) => {
        if(item.hasOwnProperty("header")){
          some_row_item.push(item)
        }else{
          let item_value = parseFloat(item.val);
          if(item.hasOwnProperty('subtotal_column')){ }
          else{
            sum += (item_value)?item.val : 0;
            some_row_item.push(item);
          }
        }
      });
      some_row_item.push({name:'total', val: +sum.toFixed(2), row_span:1,column_total:true,sub_total:true});
      some_rows.push({items:some_row_item,headers:row.headers});
    });

    return {
      headers : some_header,
      rows : some_rows,
      columns : data.columns,
      titles : data.titles,
      title : data.title
    };

  }

  addRowSubtotal( tableObject ){
    let data = _.cloneDeep(tableObject);
    if(data.columns.length > 1){
      let row_distance:any = data.rows[0].items[0].row_span;
      let some_rows = [];
      let counter = 1;
      let sum_rows = [];
      data.rows.forEach( (row) => {
        let row_items = [];
        if( (counter % row_distance) == 0){
          some_rows.push(row);
          // adding totals to the sum array to be used in the created row
          let sum_counter = 0;
          row.items.forEach( (item) => {
            if(item.hasOwnProperty('header')){}
            else{
              if(sum_rows[sum_counter]){
                sum_rows[sum_counter] += (parseFloat(item.val))?parseFloat(item.val):0;
              }else{
                sum_rows[sum_counter] = (parseFloat(item.val))?parseFloat(item.val):0;
              }
              sum_counter++;
            }

          });
          // creating a subtotal column
          let total_counter = 0;
          data.rows[0].items.forEach( (item) => {
            if(item.hasOwnProperty('header')){
              row_items.push({name:"",val:'',row_span:1,header:true})
            }else{
              row_items.push({name:"",val:+sum_rows[total_counter].toFixed(2),row_span:1,row_total:true});
              total_counter++;
            }
          });
          some_rows.push({items:row_items,headers:row.headers,sub_total:true});
          sum_rows = [];
        }else{
          some_rows.push(row);
          // populate the sum array
          let sum_counter = 0;
          row.items.forEach( (item) => {
            if(item.hasOwnProperty('header')){}
            else{
              if(sum_rows[sum_counter]){
                sum_rows[sum_counter] += (parseFloat(item.val))?parseFloat(item.val):0;
              }else{
                sum_rows[sum_counter] = (parseFloat(item.val))?parseFloat(item.val):0;
              }
              sum_counter++;
            }

          });
        }
        counter++;
      });
      return {
        headers : data.headers,
        rows : some_rows,
        columns : data.columns,
        titles : data.titles,
        title : data.title
      };
    }else{
      return data;
    }

  }

  addRowTotal( tableObject ){
    let data = _.cloneDeep(tableObject);
    let row_distance:any = data.rows[0].items[0].row_span;
    let some_rows = [];
    let counter = 1;
    let sum_rows = [];
    let row_items = [];
    data.rows.forEach( (row) => {
        some_rows.push(row);
        // adding totals to the sum array to be used in the created row
        let sum_counter = 0;
        row.items.forEach( (item) => {
          if(item.hasOwnProperty('header')){}
          else{
            if(sum_rows[sum_counter]){
              sum_rows[sum_counter] += (parseFloat(item.val))?parseFloat(item.val):0;
            }else{
              sum_rows[sum_counter] = (parseFloat(item.val))?parseFloat(item.val):0;
            }
            sum_counter++;
          }
        });
      counter++;
    });
    // creating a subtotal column
    let total_counter = 0;
    data.rows[0].items.forEach( (item) => {
      if(item.hasOwnProperty('header')){
        row_items.push({name:"",val:'',row_span:1,header:true})
      }else{
        row_items.push({name:"",val:+sum_rows[total_counter].toFixed(2),row_span:1,row_total:true,sub_total:true});
        total_counter++;
      }
    });
    some_rows.push({items:row_items,headers:data.rows[0].headers,sub_total:true});
    return {
      headers : data.headers,
      rows : some_rows,
      columns : data.columns,
      titles : data.titles,
      title : data.title
    };

  }

  addParentOu( tableObject ){
    let data = _.cloneDeep(tableObject);
    let some_rows = [];
    let counter = 1;
    let sum_rows = [];
    let row_items = [];
    if(data.columns[0] == "ou"){
      data.hasParentOu = true;
      data.rows.forEach( (row) => {
        if(row.items[0]['type'] == "ou"){
          this.localStorageService.getByKey(ORGANISATION_UNIT_KEY,row.items[0].name).subscribe(orgunit => {
            if(orgunit && orgunit.hasOwnProperty('parent')){
              this.localStorageService.getByKey(ORGANISATION_UNIT_KEY,orgunit.parent.id).subscribe(parent => {
                row.items.unshift({
                  "type": "",
                  "name": "drHchnPFUa9",
                  "val": parent.name,
                  "row_span": row.items[0].row_span,
                  "header": true
                })
              });
            }else{
              row.items.unshift({
                "type": "",
                "name": "drHchnPFUa9",
                "val": "",
                "row_span": row.items[0].row_span,
                "header": true
              })
            }

          });

        }
        some_rows.push(row);
      });
    }else{
      data.rows.forEach( (row) => {
        some_rows.push(row);
      });
    }

    return {
      headers : data.headers,
      rows : some_rows,
      columns : data.columns,
      titles : data.titles,
      title : data.title,
      titlesAvailable:data.itlesAvailable,
      hasParentOu:data.hasParentOu
    };

  }
}
