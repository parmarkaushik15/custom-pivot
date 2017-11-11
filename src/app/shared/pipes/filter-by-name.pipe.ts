import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByName'
})
export class FilterByNamePipe implements PipeTransform {

  transform(value:any[], name:any):any {
    if (name !== undefined) {
      // filter users, users which match and return true will be kept, false will be filtered out
      if (value.length !== 0 && name !== null) {
        let splitData = name;
        // [',','[',']','(',')',',','.','-','_'].forEach((char)=>{
        [',','[',']','(',')',',','-','_'].forEach((char)=>{
          splitData = splitData.split(char).join(" ")
        })
        return value.filter((item) => {
          var found = true;
          splitData.split(" ").forEach((str)=> {
            if (item.name.toLowerCase().indexOf(str.toLowerCase()) == -1) {
              found = false;
            }
          })
          return found;
        });
      }

    }
    return value;
  }

}
