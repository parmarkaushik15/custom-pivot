import { Injectable } from '@angular/core';
import {HttpClientService} from './http-client.service';
import {timer} from 'rxjs/internal/observable/timer';

@Injectable()
export class LoginRedirectService {

  constructor(
    private http: HttpClientService,
  ) { }

  checkIfLogin(rootUrl) {
    timer(1, 6000).subscribe(() => {
        this.http.post(rootUrl + 'dhis-web-commons-stream/ping.action', {})
          .subscribe(status => {
            if (!status.loggedIn) {
              window.location.href = rootUrl + 'dhis-web-commons/security/login.action';
            }
          }, () => {
            // window.location.href = rootUrl + 'dhis-web-commons/security/login.action'
            console.warn('You are offline')
          })
      }
    );
  }

}
