import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForbiddenRoutingModule } from './forbidden-routing.module';
import { ForbiddenComponent } from './forbidden.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    declarations: [ForbiddenComponent],
    imports: [CommonModule, ForbiddenRoutingModule, SharedModule],
})
export class ForbiddenModule {}
