import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EducationalResourceService } from '@app/modules/marketplace/services/assets-services/educational-resource.service';
import { EducationalResourceModel } from '@app/shared/models/educationalResource.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-educational-resource',
  templateUrl: './educational-resource.component.html',
  styleUrls: ['./educational-resource.component.scss'],
})
export class EducationalResourceComponent implements OnInit, OnDestroy {
  constructor(private educationalResourceService: EducationalResourceService) {}

  private subscriptions: Subscription = new Subscription();
  public educationalResource!: EducationalResourceModel;
  @Input() identifier!: string;

  private getEducationalResourceModel() {
    const subscribe = this.educationalResourceService
      .getAsset(this.identifier)
      .subscribe((educationalResource: EducationalResourceModel) => {
        this.educationalResource = educationalResource;
      });

    this.subscriptions.add(subscribe);
  }

  ngOnInit(): void {
    this.getEducationalResourceModel();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
