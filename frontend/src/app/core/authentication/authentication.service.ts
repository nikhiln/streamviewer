import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';

import {SocialUser} from 'angularx-social-login';
import {AuthService} from 'angularx-social-login';

export interface GoogleLoginContext {
  access_token: string;
  code?: string;
}

const ROUTES = {
  AUTH_GOOGLE: '/rest-auth/google/',
  AUTH_LOGOUT: '/rest-auth/logout/'
};

export interface Credentials {
  // Customize received credentials here
  socialUser: SocialUser;
  key?: string;
  user?: {};
}

const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  private _credentials: Credentials | null;

  constructor(private httpClient: HttpClient, private socialAuthService: AuthService) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Authenticates the google social user on backend.
   * @param socialUser
   */
  loginWithGoogle(socialUser: SocialUser): Observable<boolean> {
    // calling server side auth
    const loginContext: GoogleLoginContext = {access_token: socialUser.authToken};

    return this.httpClient.post(ROUTES.AUTH_GOOGLE, loginContext, {}).pipe(
      map((body: any) => {
        this.setCredentials(socialUser, body);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    this.socialAuthService
      .signOut()
      .then(() => {
      })
      .catch(function (e) {
      });
    this.logoutOnServer();
    // login out from server as well
    return of(true);
  }

  /**
   * Logout on SV server
   */
  logoutOnServer() {
    this.httpClient.post(ROUTES.AUTH_LOGOUT, {}).subscribe(data => {});
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Gets the auth headers to append while making calls to api
   */
  get authHeaderOptions(): {} | null {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: 'JWT ' + this.credentials.key,
        'X-Requested-With': 'XMLHttpRequest'
      })
    };
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param socialUser social user
   * @param auth authkey returned from server
   * @param remember flag indicating to remember auth data or not
   */
  private setCredentials(socialUser?: SocialUser, auth?: string, remember?: boolean) {
    if (socialUser && auth) {
      this._credentials = {socialUser: socialUser, key: auth['token'], user: auth['user']};
    } else {
      this._credentials = null;
    }

    if (this._credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(this._credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
}
