import { AuthService } from './auth.service';

export class AuthServiceMock {
    static getProvider() {
        return {
            provide: AuthService,
            useFactory: () => AuthServiceMock.instance(),
        };
    }

    static instance() {
        const instance = jasmine.createSpyObj('AuthService', [
            'isAuthenticated',
            'getHeader',
            'getProfile',
            'getEmail',
            'logout',
            'setLoggedEmail',
            'login',
            'setLoggedInUserEmail',
        ]);

        instance.isAuthenticated.and.returnValue(true);
        instance.getHeader.and.returnValue({});
        instance.getProfile.and.returnValue({});
        instance.getEmail.and.returnValue('emailMock');
        instance.setLoggedInUserEmail.and.returnValue('');

        return instance;
    }
}
