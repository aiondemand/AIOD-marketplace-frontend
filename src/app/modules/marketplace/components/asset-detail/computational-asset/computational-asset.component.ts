import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ComputationalAssetService } from '@app/modules/marketplace/services/assets-services/computational-asset.service';
import { ComputationalAssetModel } from '@app/shared/models/computationalAsset.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-computational-asset',
  templateUrl: './computational-asset.component.html',
  styleUrls: ['./computational-asset.component.scss']
})
export class ComputationalAssetComponent implements OnInit, OnDestroy {
  constructor(
    private computationalAssetService: ComputationalAssetService ,
  ) {}

  private subscriptions: Subscription = new Subscription();
  public computationalAsset!: ComputationalAssetModel;
  @Input() identifier!: number;

  private getComputationalAssetModel() {
    const subscribe = this.computationalAssetService
      .getAsset(this.identifier).subscribe((computationalAsset: ComputationalAssetModel) => {
        this.computationalAsset = computationalAsset;
      });

    this.subscriptions.add(subscribe);
  }

  ngOnInit(): void {
    this.getComputationalAssetModel();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
