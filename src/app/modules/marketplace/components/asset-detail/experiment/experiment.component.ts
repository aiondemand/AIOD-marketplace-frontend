import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ExperimentService } from '@app/modules/marketplace/services/assets-services/experiment.service';
import { ExperimentModel } from '@app/shared/models/experiment.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss']
})
export class ExperimentComponent implements OnInit, OnDestroy {
  constructor(
    private experimentService: ExperimentService,
  ) {}
 
  private subscriptions: Subscription = new Subscription();
  public experiment!: ExperimentModel;
  @Input() identifier!: number;

  private getExperiment() {
    const subscribe = this.experimentService
      .getAsset(this.identifier).subscribe((experiment: ExperimentModel) => {
        this.experiment = experiment;
      });

    this.subscriptions.add(subscribe);
  }

  ngOnInit(): void {
    this.getExperiment();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
