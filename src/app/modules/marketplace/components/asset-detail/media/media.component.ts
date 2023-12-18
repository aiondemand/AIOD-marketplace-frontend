import { Component, Input, OnInit } from '@angular/core';
import { Media } from '@app/shared/models/media.model';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent {
  @Input() public media!: Media;
  public panelOpenState = false;

  constructor() {}
}
