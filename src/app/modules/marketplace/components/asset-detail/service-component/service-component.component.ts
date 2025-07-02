import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ServiceService } from '@app/modules/marketplace/services/assets-services/service.service';
import { ServiceModel } from '@app/shared/models/service.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-service-component',
  templateUrl: './service-component.component.html',
  styleUrls: ['./service-component.component.scss']
})
export class ServiceComponentComponent implements OnInit, OnDestroy {
  constructor(
    private serviceService: ServiceService ,
  ) {}
 
  private subscriptions: Subscription = new Subscription();
  public service!: ServiceModel;
  @Input() identifier!: string;

  private getServiceModel() {
    const subscribe = this.serviceService
      .getAsset(this.identifier).subscribe((service: ServiceModel) => {
        this.service = service;
      });

    this.subscriptions.add(subscribe);
  }

  ngOnInit(): void {
    this.getServiceModel();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
