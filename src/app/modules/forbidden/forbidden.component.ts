import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-forbidden',
    templateUrl: './forbidden.component.html',
    styleUrls: ['./forbidden.component.scss'],
})
export class ForbiddenComponent implements OnInit {
    constructor(private route: ActivatedRoute) {}
    errorMessage = '';

    ngOnInit(): void {
        this.errorMessage =
            this.route.snapshot.paramMap.get('errorMessage') || '';
    }
}
