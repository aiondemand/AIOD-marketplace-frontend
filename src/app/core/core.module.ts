import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [],
    providers: [
        {
            provide: AuthService,
        },
    ],
})
export class CoreModule {}
