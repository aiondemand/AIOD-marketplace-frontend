import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CaseStudyService } from '@app/modules/marketplace/services/assets-services/case-study.service';
import { CaseStudyModel } from '@app/shared/models/caseStudy.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-case-study',
  templateUrl: './case-study.component.html',
  styleUrls: ['./case-study.component.scss']
})
export class CaseStudyComponent implements OnInit, OnDestroy {
  constructor(
    private caseStudyService: CaseStudyService ,
  ) {}
 
  private subscriptions: Subscription = new Subscription();
  public caseStudy!: CaseStudyModel;
  @Input() identifier!: string;

  private getCaseStudyModel() {
    const subscribe = this.caseStudyService
      .getAsset(this.identifier).subscribe((caseStudy: CaseStudyModel) => {
        this.caseStudy = caseStudy;
      });

    this.subscriptions.add(subscribe);
  }

  ngOnInit(): void {
    this.getCaseStudyModel();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
