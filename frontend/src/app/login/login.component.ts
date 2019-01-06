import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';

import { AuthService } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  version: string = environment.version;
  error: string;
  isLoading = false;

  user: SocialUser;
  loggedIn: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private socialAuthService: AuthService
  ) {}

  ngOnInit() {
    this.socialAuthService
      .signOut()
      .then(() => {
        this.user = null;
        this.loggedIn = this.user != null;
      })
      .catch(function(e) {});

    this.authenticationService.logoutOnServer();
  }

  /**
   * Allows user to sign in with google account
   */
  signInWithGoogle(): void {
    this.isLoading = true;
    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(user => {
        this.user = user;
        this.loggedIn = user != null;
        if (this.loggedIn && this.user) {
          this.authenticationService
            .loginWithGoogle(this.user)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
            .subscribe(
              credentials => {
                this.route.queryParams.subscribe(params =>
                  this.router.navigate([params.redirect || '/'], { replaceUrl: true })
                );
              },
              error => {
                log.debug(`Login error: ${error}`);
                this.error = error;
              }
            );
        }
      })
      .catch(function(e) {});
  }
}
