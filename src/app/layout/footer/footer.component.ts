import { Component } from '@angular/core';
import { EXTERNAL_LINKS } from '@app/shared/constants/external-links';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  protected externalLinks = EXTERNAL_LINKS;
}
