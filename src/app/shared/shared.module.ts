import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';

import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
import { BreadcrumbModule } from 'xng-breadcrumb';

@NgModule({
  declarations: [ConfirmationDialogComponent, ReportDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    RouterModule,
    TranslateModule,
    BreadcrumbModule,
  ],
})
export class SharedModule {}
