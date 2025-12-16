import { Component, Inject } from '@angular/core';
import {
  EXTERNAL_LINKS,
  REPORT_ASSET_ENDPOINT,
} from '../../constants/external-links';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

export interface ReportData {
  assetName: string;
  assetId: string;
}

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss'],
})
export class ReportDialogComponent {
  reportForm: FormGroup;
  public readonly EXTERNAL_LINKS = EXTERNAL_LINKS;
  public isAssetReportAvailable = false; //To change when LOBA sets the endpoint to report assets

  constructor(
    public dialog: MatDialogRef<ReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReportData,
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
    this.reportForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email]],
      subject: ['', [Validators.required]],
      report: ['', [Validators.required]],
      privacyAccepted: [false, [Validators.requiredTrue]],
    });
  }

  closeDialog(): void {
    this.dialog.close();
  }

  submitReport(): void {
    if (this.reportForm.valid) {
      const formData = new FormData();
      formData.append('your-name', this.reportForm.value.name);
      formData.append('your-email', this.reportForm.value.email);
      formData.append('your-subject', 'FLAG: ' + this.reportForm.value.subject);
      formData.append('your-message', this.reportForm.value.report);
      formData.append('asset-name', this.data.assetName);
      formData.append('asset-id', this.data.assetId);

      this.http.post(REPORT_ASSET_ENDPOINT, formData).subscribe({
        next: (response) => {
          console.log('Report submitted successfully', response);
          this.dialog.close(true);
        },
        error: (error) => {
          console.error('Error submitting report', error);
          this.dialog.close(false);
        },
      });
    }
  }
}
