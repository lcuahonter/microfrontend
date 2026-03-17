import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PasoTresComponent } from './paso-tres.component';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';


describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let routerMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PasoTresComponent],
      providers: [
        ToastrService,
        provideHttpClient(),
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        { provide: Router, useValue: routerMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "modificacion-descripcion/acuse" when obtieneFirma is called with a valid signature', () => {
    const firma = 'valid-signature';
    component.obtieneFirma(firma);
    expect(routerMock.navigate).toHaveBeenCalledWith(['modificacion-descripcion/acuse']);
  });

  it('should not navigate when obtieneFirma is called with an empty signature', () => {
    const firma = '';
    component.obtieneFirma(firma);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});