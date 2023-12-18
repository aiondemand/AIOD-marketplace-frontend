import { TestBed } from '@angular/core/testing';

import { DeploymentsService } from './deployments.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

const mockedConfigService: any = {};

describe('DeploymentsService', () => {
    let service: DeploymentsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(DeploymentsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
