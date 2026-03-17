import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PasoTresComponent } from './paso-tres.component';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { provideHttpClient } from '@angular/common/http';


describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let routerMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports: [FirmaElectronicaComponent],
      providers: [
        provideHttpClient(),
        ToastrService,
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
  it('should navigate to "servicios-extraordinarios/acuse" if FIRMA is truthy', () => {
    const mockEvent = 'valid-firma';
    component.obtieneFirma(mockEvent);
    expect(routerMock.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should not navigate when obtieneFirma is called with an empty signature', () => {
    const firma = '';
    component.obtieneFirma(firma);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});