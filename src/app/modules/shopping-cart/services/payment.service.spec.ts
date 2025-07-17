import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { PaymentService } from "./payment.service";
import { AuthService } from "@app/core/services/auth/auth.service";

describe("PaymentService", () => {
  let service: PaymentService;
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule,],  providers: [{
      provide: AuthService,     useValue: { getToken: jest.fn() } }]

     });
    service = TestBed.inject(PaymentService);
    httpClient = TestBed.inject(HttpClient);
  });
  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
