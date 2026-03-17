import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoTresComponent } from './paso-tres.component';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let router: Router;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoTresComponent],
      providers: [
        ToastrService,
        provideHttpClient(),
        provideToastr({
          positionClass: 'toast-top-right',
        }),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should navigate to "aviso-traslado/acuse" when FIRMA is valid', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const mockFirma = 'valid-firma';
    component.obtieneFirma(mockFirma);
    expect(navigateSpy).toHaveBeenCalledWith(['aviso-traslado/acuse']);
  });
});
