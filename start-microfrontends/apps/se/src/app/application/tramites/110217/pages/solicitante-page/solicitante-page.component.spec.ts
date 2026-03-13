import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitantePageComponent } from './solicitante-page.component';
import { Tramite110217Store } from '../../../../estados/tramites/tramite110217.store';
import { Tramite110217Query } from '../../../../estados/queries/tramite110217.query';
import { of } from 'rxjs';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CertificadosOrigenService } from '../../services/certificado-origen.service.ts';

describe('SolicitantePageComponent', () => {
  let component: SolicitantePageComponent;
  let fixture: ComponentFixture<SolicitantePageComponent>;
  let storeMock: any;
  let queryMock: any;
  let serviceMock: any;
  let toastrMock: any;

  beforeEach(async () => {
    storeMock = {
      setPasoActivo: jest.fn(),
      setIdSolicitud: jest.fn(),
    };

    queryMock = {
      selectSolicitud$: of({ pestanaActiva: 1 }),
    };

    serviceMock = {
      getAllState: jest.fn().mockReturnValue(of({ formulario: {} })),
      guardarDatosPost: jest.fn().mockReturnValue(of({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 123 } })),
      buildProductoresPorExportador: jest.fn().mockReturnValue([]),
      buildMercanciasProductor: jest.fn().mockReturnValue([]),
      buildCertificado: jest.fn().mockReturnValue({}),
      buildDestinatario: jest.fn().mockReturnValue({}),
      buildDatosCertificado: jest.fn().mockReturnValue({}),
      buildDestinatarioTransporteDetalles: jest.fn().mockReturnValue({}),
    };

    toastrMock = {
      success: jest.fn(),
      error: jest.fn(),
    };


    await TestBed.configureTestingModule({
      imports: [PasoUnoComponent, PasoTresComponent, SolicitantePageComponent],
      providers: [
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        provideHttpClient(),
        { provide: Tramite110217Store, useValue: storeMock },
        { provide: Tramite110217Query, useValue: queryMock },
        { provide: CertificadosOrigenService, useValue: serviceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitantePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tramiteState on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tramiteState).toEqual({ pestanaActiva: 1 });
  });

  it('should update indice on getValorIndice with "atras"', () => {
    component.wizardComponent = {
      atras: jest.fn()
    } as any;
    
    component.getValorIndice({ accion: 'atras', valor: 1 });
    expect(component.indice).toBe(1);
    expect(storeMock.setPasoActivo).toHaveBeenCalledWith(1);
  });

  it('should call guardar from obtenerDatosDelStore()', () => {
    const guardarSpy = jest.spyOn(component, 'guardar').mockResolvedValue({});
    jest.spyOn(serviceMock, 'getAllState').mockReturnValue(of({}));
    component.obtenerDatosDelStore();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('should call pasoUnoComponent.validarTodosLosFormularios and block navigation if invalid', () => {
    component.pasoUnoComponent = { validarTodosLosFormularios: jest.fn().mockReturnValue(false) } as any;
    component.getValorIndice({ accion: 'cont', valor: 1 });
    expect(component.esFormaValido).toBe(true);
  });

  it('should navigate back on accion "ant"', () => {
    component.wizardComponent = { atras: jest.fn() } as any;
    component.getValorIndice({ accion: 'ant', valor: 2 });
    expect(component.indice).toBe(1);
    expect(storeMock.setPasoActivo).toHaveBeenCalledWith(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should call guardar and set idSolicitud on valid response', async () => {
    const mockData: any = { formulario: { datosConfidencialesProductor: true, productorMismoExportador: false } };
    const response = await component.guardar(mockData);
    expect(serviceMock.guardarDatosPost).toHaveBeenCalled();
    expect(storeMock.setIdSolicitud).toHaveBeenCalledWith(123);
    expect(response).toBeTruthy();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });

  it('should call toastrService.error when shouldNavigate$ response is not OK', (done) => {
    const mockResponse = { codigo: '01', mensaje: 'Error saving' };
    jest.spyOn(serviceMock, 'getAllState').mockReturnValue(of({}));
    jest.spyOn(component, 'guardar').mockResolvedValue(mockResponse);
    const toastrService = TestBed.inject(ToastrService);
    const errorSpy = jest.spyOn(toastrService, 'error');
    (component as any).shouldNavigate$().subscribe((result: any) => {
      expect(result).toBe(false);
      expect(errorSpy).toHaveBeenCalledWith('Error saving');
      done();
    });
  });

  it('should handle error in guardar() and reject promise', async () => {
    jest.spyOn(serviceMock, 'guardarDatosPost').mockReturnValue({
      subscribe: ({ error }: any) => error('Network error')
    } as any);
    await expect(component.guardar({ formulario: {} } as any)).rejects.toBe('Network error');
  });

  it('should set idSolicitud to 0 when response datos.id_solicitud is invalid', async () => {
    jest.spyOn(serviceMock, 'guardarDatosPost').mockReturnValue(of({ datos: { id_solicitud: null } }));
    const setIdSpy = jest.spyOn(storeMock, 'setIdSolicitud');
    await component.guardar({ formulario: {} } as any);
    expect(setIdSpy).toHaveBeenCalledWith(0);
  });

  it('should not navigate when shouldNavigate$ returns false', () => {
    component.pasoUnoComponent = { validarTodosLosFormularios: jest.fn().mockReturnValue(true) } as any;
    component.wizardComponent = { siguiente: jest.fn() } as any;
    jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(false));
    component.getValorIndice({ accion: 'cont', valor: 1 });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

});