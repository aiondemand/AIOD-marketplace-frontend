import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetCardComponent } from "./asset-card.component";
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("AssetCardComponent", () => {
  let component: AssetCardComponent;
  let fixture: ComponentFixture<AssetCardComponent>;
  let httpClient: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetCardComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
   
    fixture = TestBed.createComponent(AssetCardComponent);

    component = fixture.componentInstance;
    component.asset = { identifier: "test-id" } as any; // Mock asset for testing
    httpClient = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
