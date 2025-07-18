import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AIModelService } from '@app/modules/marketplace/services/AIModel.service';
import { AIModelModel } from '@app/shared/models/AIModel.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aimodel',
  templateUrl: './aimodel.component.html',
  styleUrls: ['./aimodel.component.scss'],
})
export class AimodelComponent implements OnInit, OnDestroy {
  constructor(private aiModelService: AIModelService) {}

  private subscriptions: Subscription = new Subscription();
  public aiModel!: AIModelModel;
  @Input() identifier!: string;

  private getDatatset() {
    const subscribe = this.aiModelService
      .getAsset(this.identifier)
      .subscribe((aimodel: AIModelModel) => {
        this.aiModel = aimodel;
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
