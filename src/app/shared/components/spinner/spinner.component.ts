import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  @Input() isVisible?: boolean = false;
  @Input() message?: string = '';
}
