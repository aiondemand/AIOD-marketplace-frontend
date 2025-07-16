import { Component, Input } from '@angular/core';
import { Media } from '@app/shared/models/media.model';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaComponent {
  @Input() public media!: Media;
  public panelOpenState = false;

  existsMediaProps() {
    if (
      this.media.checksumAlgorithm ||
      this.media.encodingFormat ||
      this.media.contentSizeKb ||
      this.media.checksum ||
      this.media.copyright ||
      this.media.datePublished
    ) {
      return true;
    }

    return false;
  }
}
