import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DatasetService } from '@app/modules/marketplace/services/assets-services/dataset.service';
import { DatasetModel } from '@app/shared/models/dataset.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit, OnDestroy {
  constructor(
    private datasetService: DatasetService,
  ) { }

  private subscriptions: Subscription = new Subscription();
  public dataset!: DatasetModel;
  @Input() identifier!: number;

  private getDatatset() {
    const subscribe = this.datasetService
      .getAsset(this.identifier).subscribe((dataset: DatasetModel) => {
        this.dataset = dataset;
      });

    this.subscriptions.add(subscribe);
  }

  ngOnInit(): void {
    this.getDatatset();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
