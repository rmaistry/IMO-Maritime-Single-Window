import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanLoad
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from 'app/shared/services/auth-service';
import { LoginService } from 'app/shared/services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseService } from '../shared/services/base.service';
import { BaseGuard } from '../shared/interfaces/base-guard.interface';
import { ErrorService } from '../shared/services/error.service';
import { Route } from '@angular/compiler/src/core';

@Injectable()
export class RootGuard extends BaseService implements CanActivate, CanLoad, BaseGuard {
  constructor(
    private router: Router,
    private authService: AuthService,
    private loginService: LoginService,
    private errorService: ErrorService
  ) {
    super();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    if (!this.authService.hasToken()) {
      this.loginService.logout(); // Clear remaining cached data
      this.router.navigate(['/auth/login']);
      return false;
    } else {
      return this.authService.hasValidToken().map(
        tokenValid => true,
        error => false
      ).catch((error: HttpErrorResponse) => {
        this.navigateByError(error);
        return this.handleError(error);
      });
    }
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.hasToken()) {
      return false;
    } else {
      return this.authService.hasValidToken().map(
        tokenValid => true,
        error => false
      ).catch((error: HttpErrorResponse) => {
        return this.handleError(error);
      });
    }
  }

  navigateByError(error: HttpErrorResponse | any) {
    // Redirects user to correct page according to the error
    if (error instanceof HttpErrorResponse) {
      const httpError = error as HttpErrorResponse;
      if (httpError.status >= 500) {
        this.errorService.setDefaultHTTPError(httpError);
        this.router.navigate(['/error']);
      } else if (httpError.status === 401 || httpError.status === 403) {
        // Unauthorized - token invalid
        this.loginService.logout();
        this.errorService.setErrorReason(`${httpError.status} ${httpError.statusText}`);
        this.errorService.setErrorMessage('Token was invalid');
        this.router.navigate(['/auth/login']);
      } else {
        this.loginService.logout();
        this.errorService.setDefaultHTTPError(httpError);
        this.router.navigate(['/error']);
      }
    } else {
      this.errorService.setDefaultError();
      this.router.navigate(['/error']);
    }
  }
}
