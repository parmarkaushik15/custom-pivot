import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';

@Injectable()
export class LoginRedirectService {

  constructor(
    private http: Http,
  ) { }

  checkIfLogin(rootUrl) {
    Observable.timer(1, 6000).subscribe(() => {
        this.http.post(rootUrl + 'dhis-web-commons-stream/ping.action',{})
          .map((res: Response) => res.json())
          .catch(error => Observable.throw(new Error(error)))
          .subscribe(status => {
            if (!status.loggedIn) {
              window.location.href = rootUrl + 'dhis-web-commons/security/login.action';
            }
          }, () => {
            //window.location.href = rootUrl + 'dhis-web-commons/security/login.action'
            console.warn('You are offline')
          })
      }
    );
  }

}
