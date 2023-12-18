import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentDetailComponent } from './deployment-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '@app/shared/shared.module';

const mockedConfigService: any = {};
const mockedTranslateService: any = {
    get: jest.fn(),
};
describe('DeploymentDetailComponent', () => {
    let component: DeploymentDetailComponent;
    let fixture: ComponentFixture<DeploymentDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeploymentDetailComponent],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                TranslateModule.forRoot(),
                SharedModule,
            ],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DeploymentDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
