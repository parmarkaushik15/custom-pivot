import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeNaN'
})
export class RemoveNaNPipe implements PipeTransform {

  transform(input: any, dataElement?: any): any {
    if(dataElement){
      if(dataElement.valueType != "TEXT"){
        if(input == "NaN" || isNaN(input)){
          return "";
        }
        if(input == null){
          return "";
        }
      }
    }else{
      if(input == "NaN" || isNaN(input)){
        return "";
      }
      if(input == null){
        return "";
      }
    }

    return input;
  }

}
