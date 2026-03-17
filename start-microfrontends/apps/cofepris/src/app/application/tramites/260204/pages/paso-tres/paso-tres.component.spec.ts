import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of as observableOf, Subject, throwError } from 'rxjs';
import { PasoTresComponent } from './paso-tres.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { TramiteCofeprisStore } from '../../../../estados/tramite.store';
import { provideToastr } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;

  let mockRouter: any;
  let mockServiciosPantallaService: any;
  let mockTramiteCofeprisStore: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    };

    mockServiciosPantallaService = {
      obtenerTramite: jest.fn()
    };

    mockTramiteCofeprisStore = {
      establecerTramite: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PasoTresComponent, FirmaElectronicaComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ServiciosPantallaService, useValue: mockServiciosPantallaService },
        { provide: TramiteCofeprisStore, useValue: mockTramiteCofeprisStore },
        provideToastr({
              positionClass: 'toast-top-right',
            })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle obtieneFirma() correctly when firma is valid', () => {
    const mockTramiteData = { data: { id: 123, nombre: 'Trámite 19' } };

    mockServiciosPantallaService.obtenerTramite.mockReturnValue(observableOf(mockTramiteData));

    component.obtieneFirma('FIRMA_VALID');

    expect(mockServiciosPantallaService.obtenerTramite).toHaveBeenCalledWith(19);
    expect(mockTramiteCofeprisStore.establecerTramite).toHaveBeenCalledWith(mockTramiteData.data, 'FIRMA_VALID');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should not call services when obtieneFirma is called with falsy value', () => {
    component.obtieneFirma('');

    expect(mockServiciosPantallaService.obtenerTramite).not.toHaveBeenCalled();
    expect(mockTramiteCofeprisStore.establecerTramite).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should catch error in obtieneFirma', () => {
    const mockError = throwError(() => new Error('Failed'));
    mockServiciosPantallaService.obtenerTramite.mockReturnValue(mockError);

    expect(() => {
      component.obtieneFirma('FIRMA_INVALID');
    }).not.toThrow();
  });

  it('should clean up subscriptions on destroy', () => {
    const nextSpy = jest.spyOn<any, any>(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn<any, any>(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
