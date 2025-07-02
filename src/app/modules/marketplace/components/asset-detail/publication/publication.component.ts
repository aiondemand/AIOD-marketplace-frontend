import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PublicationService } from '@app/modules/marketplace/services/assets-services/publication.service';
import { PublicationModel } from '@app/shared/models/publication.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss']
})
export class PublicationComponent implements OnInit, OnDestroy {
  constructor(
    private publicationService: PublicationService ,
  ) {}
 
  private subscriptions: Subscription = new Subscription();
  public publication!: PublicationModel;
  @Input() identifier!: string;

  private getPublicationModel() {
    const subscribe = this.publicationService
      .getAsset(this.identifier).subscribe((publication: PublicationModel) => {
        this.publication = publication;
      });

    this.subscriptions.add(subscribe);
  }

  ngOnInit(): void {
    this.getPublicationModel();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
