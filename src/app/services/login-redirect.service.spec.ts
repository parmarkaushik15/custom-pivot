import { TestBed, inject } from '@angular/core/testing';

import { LoginRedirectService } from './login-redirect.service';

describe('LoginRedirectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginRedirectService]
    });
  });

  it('should ...', inject([LoginRedirectService], (service: LoginRedirectService) => {
    expect(service).toBeTruthy();
  }));
});
