import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Subject } from 'rxjs';
import { authCodeFlowConfig } from './auth.config';
import { AppConfigService } from '../app-config/app-config.service';

export interface UserProfile {
    name: string;
    email: string;
    identifier: string;
    isAuthorized: boolean;
}

@Injectable()
export class AuthService {
    constructor(
        private oauthService: OAuthService,
        private router: Router,
        private appConfigService: AppConfigService
    ) {
        this.configureOAuthService();
    }

    userProfileSubject = new BehaviorSubject<UserProfile>({} as UserProfile);

    /**
     * Configure the oauth service, tries to login and saves the user profile for display.
     *
     *
     * @memberof AuthService
     */
    configureOAuthService() {
        this.oauthService.configure(authCodeFlowConfig);
        this.oauthService.setupAutomaticSilentRefresh();
        this.oauthService
            .loadDiscoveryDocumentAndTryLogin()
            .then((isLoggedIn) => {
                if (isLoggedIn && this.isAuthenticated()) {
                    if (this.oauthService.hasValidAccessToken()) {
                        this.oauthService
                            .loadUserProfile()
                            .then((profile: any) => {
                                const userProfile: UserProfile = {
                                    name: profile['info']['name'],
                                    email: profile['info']['email'],
                                    identifier: profile['info']['sub'],
                                    isAuthorized: false,
                                };
                                // Note: commented out as it is not currently necessary, but
                                //       may need to be considered and adapted in the future, but for a different virtual organisation
                                // if (
                                //     profile['info']['eduperson_entitlement'] &&
                                //     profile['info']['eduperson_entitlement']
                                //         .length > 0
                                // ) {
                                //     const vos: string[] =
                                //         this.parseVosFromProfile(
                                //             profile['info'][
                                //                 'eduperson_entitlement'
                                //             ]
                                //         );
                                //     vos.forEach((vo) => {
                                //         if (
                                //             vo.includes(
                                //                 this.appConfigService.voName
                                //             )
                                //         ) {
                                //             userProfile.isAuthorized = true;
                                //         }
                                //     });
                                // }
                                this.userProfileSubject.next(userProfile);
                                if (
                                    this.oauthService.state &&
                                    this.oauthService.state !== 'undefined' &&
                                    this.oauthService.state !== 'null'
                                ) {
                                    let stateUrl = this.oauthService.state;
                                    if (stateUrl.startsWith('/') === false) {
                                        stateUrl = decodeURIComponent(stateUrl);
                                    }
                                    this.router.navigateByUrl(stateUrl);
                                }
                            });
                    } else {
                        // Force logout as we have no access to refresh tokens without client secret
                        this.logout();
                    }
                }
            });
    }

    login(url: string) {
        this.oauthService.initLoginFlow(url);
    }

    logout() {
        this.oauthService.logOut();
    }

    isAuthenticated(): boolean {
        return !!this.oauthService.getIdToken();
    }

    getToken(): any {
        return this.oauthService?.getAccessToken()?? undefined;
    }

    parseVosFromProfile(entitlements: string[]): string[] {
        const foundVos: string[] = [];
        entitlements.forEach((vo) => {
            if (vo.match('group:(.+?):')?.[0]) {
                foundVos.push(vo.match('group:(.+?):')![0]);
            }
        });
        return foundVos;
    }
}
