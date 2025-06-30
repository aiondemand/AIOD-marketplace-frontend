import { AfterViewInit, Component,Input, OnChanges } from "@angular/core";

@Component({

    selector: 'app-footer',
    templateUrl:'./footer.component.html',
    styleUrls: ['./footer.component.scss']

}) export class FooterComponent implements AfterViewInit{

    ngAfterViewInit() {
        const script = document.createElement('script');
        script.src = 'https://aiod.eu/common/assets/header.js';
        document.body.appendChild(script);
      }

}
