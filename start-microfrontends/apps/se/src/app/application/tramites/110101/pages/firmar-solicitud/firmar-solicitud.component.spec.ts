import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirmarSolicitudComponent } from './firmar-solicitud.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ServiciosPantallaService } from 'libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { TramiteStore } from '../../../../estados/tramite.store';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FirmarSolicitudComponent', () => {
  let component: FirmarSolicitudComponent;
  let fixture: ComponentFixture<FirmarSolicitudComponent>;

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockTramiteService = {
    obtenerTramite: jest.fn()
  };

  const mockTramiteStore = {
    establecerTramite: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      declarations: [FirmarSolicitudComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ServiciosPantallaService, useValue: mockTramiteService },
        { provide: TramiteStore, useValue: mockTramiteStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FirmarSolicitudComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar obtenerTramite, actualizar el store y navegar cuando se proporciona la firma', () => {
    const MOCK_TRAMITE_RESPONSE = { data: { idTramite: '123' } };
    mockTramiteService.obtenerTramite.mockReturnValue(of(MOCK_TRAMITE_RESPONSE));

    const FIRMA = 'firma-electronica';
    component.obtieneFirma(FIRMA);

    expect(mockTramiteService.obtenerTramite).toHaveBeenCalledWith(19);
    expect(mockTramiteStore.establecerTramite).toHaveBeenCalledWith(
      MOCK_TRAMITE_RESPONSE.data,
      FIRMA
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('no debe llamar nada si la firma es falsy', () => {
    component.obtieneFirma('');

    expect(mockTramiteService.obtenerTramite).not.toHaveBeenCalled();
    expect(mockTramiteStore.establecerTramite).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('debe capturar y retornar el error de obtenerTramite', () => {
    const mockError = new Error('Network error');
    mockTramiteService.obtenerTramite.mockReturnValue(throwError(() => mockError));

    const FIRMA = 'firma-electronica';
    expect(() => component.obtieneFirma(FIRMA)).not.toThrow();

    expect(mockTramiteService.obtenerTramite).toHaveBeenCalledWith(19);
  });
});
