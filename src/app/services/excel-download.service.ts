import {Injectable} from '@angular/core';

declare var $: any, unescape: any;

@Injectable()
export class ExcelDownloadService {

  constructor() {

  }

  download(name, nativeElement) {
    const uri = 'data:application/vnd.ms-excel;base64,';
    let template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" ';
    template += 'xmlns="http://www.w3.org/TR/REC-html40"><head>';
    template += '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->';
    template += '</head><body><table border="1">{table}</table><br /><table border="1">{table}</table></body></html>';
      const base64 = (s) => {
        return window.btoa(unescape(encodeURIComponent(s)));
      },
      format = (s, c) => {
        return s.replace(/{(\w+)}/g, (m, p) => {
          return c[p];
        })
      };
    // console.log("Table:",nativeElement.innerHTML);
    const ctx = {worksheet: 'Sheet 1'};
    let str = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';
    const el = nativeElement;
    ($(el).find('td.hidden').each(function (index2) {
      // console.log("Remove Index:",index2);
      this.remove();
    }));
    ctx['table1'] = el.innerHTML.split('& ').join('&amp; ');

    str += '<table border="1">{table1}</table><br />';
    str += '</body></html>';

    setTimeout(() => {
      const link = document.createElement('a');
      link.download = name + '.xls';
      link.href = uri + base64(format(str, ctx));
      link.click();
    }, 100);
  }
}
