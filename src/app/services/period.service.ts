import { Injectable } from '@angular/core';

@Injectable()
export class PeriodService {

  constructor() { }

  getPeriodArray(type,year){
    let periods = [];
    if(type == "Weekly"){
      periods.push({id:'',name:''})
    }else if(type == "Monthly"){
      periods.push({id:year+'12',name:'December '+year},{id:year+'11',name:'November '+year},{id:year+'10',name:'October '+year},{id:year+'09',name:'September '+year},{id:year+'08',name:'August '+year},{id:year+'07',name:'July '+year},{id:year+'06',name:'June '+year},{id:year+'05',name:'May '+year},{id:year+'04',name:'April '+year},{id:year+'03',name:'March '+year},{id:year+'02',name:'February '+year},{id:year+'01',name:'January '+year,selected:true})
    }else if(type == "BiMonthly"){
      periods.push({id:year+'01B',name:'January - February '+year,selected:true},{id:year+'02B',name:'March - April '+year},{id:year+'03B',name:'May - June '+year},{id:year+'04B',name:'July - August '+year},{id:year+'05B',name:'September - October '+year},{id:year+'06B',name:'November - December '+year})
    }else if(type == "Quarterly"){
      periods.push({id:year+'Q4',name:'October - December '+year},{id:year+'Q3',name:'July - September '+year},{id:year+'Q2',name:'April - June '+year},{id:year+'Q1',name:'January - March '+year,selected:true})
    }else if(type == "SixMonthly"){
      periods.push({id:year+'S1',name:'January - June '+year,selected:true},{id:year+'S2',name:'July - December '+year})
    }else if(type == "SixMonthlyApril"){
      let useYear = parseInt(year) + 1;
      periods.push({id:year+'AprilS2',name:'October '+year+' - March '+useYear,selected:true},{id:year+'AprilS1',name:'April - September '+year})
    }else if(type == "FinancialOct"){
      for (let i = 0; i <= 10; i++) {
        let useYear = parseInt(year) - i;
        let currentYear = useYear + 1;
        periods.push({id:useYear+'Oct',name:'October '+useYear+' - September '+ currentYear})
      }
    }else if(type == "Yearly"){
      for (let i = 0; i <= 10; i++) {
        let useYear = parseInt(year) - i;
        periods.push({id:useYear,name:useYear})

      }
    }else if(type == "FinancialJuly"){
      for (let i = 0; i <= 10; i++) {
        let useYear = parseInt(year) - i;
        let currentYear = useYear + 1;
        periods.push({id:useYear+'July',name:'July '+useYear+' - June '+ currentYear})
      }
    }else if(type == "FinancialApril"){
      for (let i = 0; i <= 10; i++) {
        let useYear = parseInt(year) - i;
        let currentYear = useYear + 1;
        periods.push({ id:useYear+'April',name:'April '+useYear+' - March '+ currentYear })
      }
    }else if(type == "Relative Weeks"){
      periods.push({id:'THIS_WEEK',name:'This Week'},{id:'LAST_WEEK',name:'Last Week'},{id:'LAST_4_WEEK',name:'Last 4 Weeks',selected:true},{id:'LAST_12_WEEK',name:'last 12 Weeks'},{id:'LAST_52_WEEK',name:'Last 52 weeks'});
    }else if(type == "RelativeMonth"){
      periods.push({id:'THIS_MONTH',name:'This Month'},{id:'LAST_MONTH',name:'Last Month'},{id:'LAST_3_MONTHS',name:'Last 3 Months'},{id:'LAST_6_MONTHS',name:'Last 6 Months'},{id:'LAST_12_MONTHS',name:'Last 12 Months',selected:true});
    }else if(type == "Relative Bi-Month"){
      periods.push({id:'THIS_BIMONTH',name:'This Bi-month'},{id:'LAST_BIMONTH',name:'Last Bi-month'},{id:'LAST_6_BIMONTHS',name:'Last 6 bi-month',selected:true});
    }else if(type == "RelativeQuarter"){
      periods.push({id:'THIS_QUARTER',name:'This Quarter'},{id:'LAST_QUARTER',name:'Last Quarter'},{id:'LAST_4_QUARTERS',name:'Last 4 Quarters',selected:true});
    }else if(type == "RelativeSixMonthly"){
      periods.push({id:'THIS_SIX_MONTH',name:'This Six-month'},{id:'LAST_SIX_MONTH',name:'Last Six-month'},{id:'LAST_2_SIXMONTHS',name:'Last 2 Six-month',selected:true});
    }else if(type == "RelativeFinancialYear"){
      periods.push({id:'THIS_FINANCIAL_YEAR',name:'This Financial Year'},{id:'LAST_FINANCIAL_YEAR',name:'Last Financial Year',selected:true},{id:'LAST_5_FINANCIAL_YEARS',name:'Last 5 Financial Years'});
    }else if(type == "RelativeYear"){
      periods.push({id:'THIS_YEAR',name:'This Year'},{id:'LAST_YEAR',name:'Last Year',selected:true},{id:'LAST_5_YEARS',name:'Last 5 Five Years'});
    }
    return periods;
  }
  getPeriodName(period){
    var name = "";
    if(period.indexOf("Q") > -1){
      var quarters = this.getPeriodArray("Quarterly",period.substr(0,4));
      quarters.forEach((quarter)=>{
        if(quarter.id == period){
          name = quarter.name;
        }
      })
    }else if(period.indexOf("July") > -1){
      var julyYears = this.getPeriodArray("FinancialJuly",period.substr(0,4));
      julyYears.forEach((julyYear)=>{
        if(julyYear.id == period){
          name = julyYear.name;
        }
      })
    }else{
      var months = this.getPeriodArray("Monthly",period.substr(0,4));
      months.forEach((month)=>{
        if(month.id == period){
          name = month.name;
        }
      })
    }
    return name;
  }
}
