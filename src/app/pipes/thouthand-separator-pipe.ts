import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thouthandSepator'
})
export class ThouthandSeparator implements PipeTransform {

  transform(input: any, args?: any): any {
    if (input && !isNaN(input)) {
      return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return input;
    }
  }

}
