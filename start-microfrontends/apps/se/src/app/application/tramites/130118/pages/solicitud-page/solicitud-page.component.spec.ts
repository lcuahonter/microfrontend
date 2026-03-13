import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';

import { SolicitudPageComponent } from './solicitud-page.component';
import { IniciarService } from '../../services/iniciar.service';
import { GuardarService } from '../../services/guardar.service';
import { Solicitud130118State, Tramite130118Store } from '../../estados/tramites/tramite130118.store';
import { Tramite130118Query } from '../../estados/queries/tramite130118.query';
import { CategoriaMensaje, Notificacion } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const getMockSolicitud130118State = (): Solicitud130118State => ({
  idSolicitud: 123,
  regimenMercancia: 'IMPORTACIÓN',
  clasifiRegimen: 'A',
  valueTA: 'TA123',
  fraccionArancelaria: '0102030405',
  nico: '99',
  unidadMedidaTarifaria: 'KG',
  cantidadTarifaria: 100,
  valorFacturaUSD: 2000,
  precioUnitarioUSD: 20,
  paisOrigen: 'MX',
  paisDestino: 'US',
  lote: 'L123',
  fechaSalida: '2025-07-20',
  observaciones: 'Observaciones generales',
  observacionMerc: 'Observaciones sobre la mercancía',
  tipoPersona: 'FISICA',
  nombre: 'Juan',
  apellidoPaterno: 'Pérez',
  apellidoMaterno: 'López',
  razonSocial: '',
  domicilio: 'Av. Siempre Viva 742',
  estado: 'CDMX',
  representacionFederal: 'Sí'
});


describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;
  
  // Mocks de servicios
  const mockIniciarService = {
    postIniciar: jest.fn()
  };
  

  const mockGuardarService = {
    postSolicitud: jest.fn()
  };

  const mockTramite130118Store = {
    setIdSolicitud: jest.fn(),
    setSeccionState: jest.fn()
  };

  const mockTramite130118Query = {
    selectSeccionState$: of(getMockSolicitud130118State())
  };


  const mockLocation = {
    back: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule],
      declarations: [SolicitudPageComponent, PasoUnoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: IniciarService, useValue: mockIniciarService },
        { provide: GuardarService, useValue: mockGuardarService },
        { provide: Tramite130118Store, useValue: mockTramite130118Store },
        { provide: Tramite130118Query, useValue: mockTramite130118Query },
        { provide: Location, useValue: mockLocation }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;

    component.solicitudState = getMockSolicitud130118State();
    
    // Mock WizardComponent
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      indiceActual: 1
    } as unknown as WizardComponent;
    
    // Mock PasoUnoComponent
    component.pasoUnoComponent = {
      solicitudComponent: {
        form: {
          valid: true,
          getRawValue: jest.fn().mockReturnValue({
            datosRegimen: { regimenMercancia: '1', clasifiRegimen: '1' },
            datosMercancia: { 
              fraccionArancelaria: '1', 
              nico: '1',
              valueTA: 'Test',
              unidadMedidaTarifaria: '1',
              paisOrigen: '1',
              paisDestino: '1',
              cantidadTarifaria: 10,
              valorFacturaUSD: 100,
              precioUnitarioUSD: 10,
              lote: 'L1',
              fechaSalida: '01/01/2023',
              observaciones: 'Test'
            },
            datosProducto: { 
              tipoPersona: 'pfisica',
              nombre: 'Test',
              apellidoPaterno: 'User',
              apellidoMaterno: 'Test',
              razonSocial: '',
              domicilio: 'Test'
            },
            registroFederal: { 
              estado: '1',
              representacionFederal: '1'
            }
          })
        }
      }
    } as unknown as PasoUnoComponent;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component and call postIniciar', fakeAsync(() => {
      mockIniciarService.postIniciar.mockReturnValue(of({ codigo: '00' }));
      
      component.ngOnInit();
      tick();
      
      expect(mockIniciarService.postIniciar).toHaveBeenCalled();
      expect(component.solicitudState.idSolicitud).toBe(123);
    }));

    it('should handle error on postIniciar', fakeAsync(() => {
      mockIniciarService.postIniciar.mockReturnValue(throwError(() => ({ error: { error: 'Error' } })));
      
      component.ngOnInit();
      tick();
      
      expect(mockIniciarService.postIniciar).toHaveBeenCalled();
      expect(component.nuevaNotificacion).toBeDefined();
      expect(mockLocation.back).toHaveBeenCalled();
    }));
  });

  describe('getValorIndice', () => {
   
    it('should handle failed form submission and show error', fakeAsync(() => {
      mockGuardarService.postSolicitud.mockReturnValue(of({ 
        exito: false,
        mensaje: 'Error',
        erroresModelo: []
      }));
      
      component.getValorIndice({ accion: 'cont', valor: 2 });
      tick();
      
      expect(mockGuardarService.postSolicitud).toHaveBeenCalled();
      expect(component.nuevaNotificacion).toBeDefined();
      expect(component.indice).toBe(1);
    }));

    it('should handle error on form submission', fakeAsync(() => {
      mockGuardarService.postSolicitud.mockReturnValue(throwError(() => ({ mensaje: 'Error' })));
      
      component.getValorIndice({ accion: 'cont', valor: 2 });
      tick();
      
      expect(component.nuevaNotificacion).toBeDefined();
    }));

    it('should move to next step when not on first step', () => {
      component.indice = 2;
      component.getValorIndice({ accion: 'cont', valor: 3 });
      
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      expect(component.indice).toBe(3);
    });
  });

  describe('enviaSolicitudRequest', () => {
    it('should return success when postSolicitud succeeds', fakeAsync(() => {
      mockGuardarService.postSolicitud.mockReturnValue(of({ 
        codigo: '00',
        datos: { id_solicitud: 123 }
      }));
      
      let result: any;
      component.enviaSolicitudRequest().subscribe(res => result = res);
      tick();
      
      expect(result.exito).toBe(true);
      expect(mockTramite130118Store.setIdSolicitud).toHaveBeenCalledWith(123);
    }));

    it('should return error when postSolicitud fails', fakeAsync(() => {
      mockGuardarService.postSolicitud.mockReturnValue(of({ 
        codigo: '99',
        error: 'Error',
        errores_modelo: []
      }));
      
      let result: any;
      component.enviaSolicitudRequest().subscribe(res => result = res);
      tick();
      
      expect(result.exito).toBe(false);
    }));
  });

  describe('convertirFechaISO', () => {
    it('should convert date from DD/MM/YYYY to YYYY-MM-DD', () => {
      const result = component.convertirFechaISO('01/02/2023');
      expect(result).toBe('2023-02-01');
    });
  });

  describe('navigation methods', () => {
    it('should emit regresarSeccionCargarDocumentoEvento', () => {
      jest.spyOn(component.regresarSeccionCargarDocumentoEvento, 'emit');
      component.anteriorSeccionCargarDocumento();
      expect(component.regresarSeccionCargarDocumentoEvento.emit).toHaveBeenCalled();
    });

    it('should update seccionCargarDocumentos on cargaRealizada', () => {
      component.cargaRealizada(true);
      expect(component.seccionCargarDocumentos).toBe(false);
    });

    it('should update activarBotonCargaArchivos on manejaEventoCargaDocumentos', () => {
      component.manejaEventoCargaDocumentos(true);
      expect(component.activarBotonCargaArchivos).toBe(true);
    });

    it('should emit cargarArchivosEvento', () => {
      jest.spyOn(component.cargarArchivosEvento, 'emit');
      component.onClickCargaArchivos();
      expect(component.cargarArchivosEvento.emit).toHaveBeenCalled();
    });
  });

  describe('wizard navigation', () => {
    it('should call siguiente and update indices', () => {
      component.siguiente();
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
    });

    it('should call anterior and update indices', () => {
      component.anterior();
      expect(component.wizardComponent.atras).toHaveBeenCalled();
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
    });
  });

  describe('seleccionaTab', () => {
    it('should update indice', () => {
      component.seleccionaTab(3);
      expect(component.indice).toBe(3);
    });
  });

  describe('actualizarDatosPasos', () => {
    it('should update datosPasos', () => {
      component.actualizarDatosPasos();
      expect(component.datosPasos.indice).toBe(1);
      expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    });
  });
});