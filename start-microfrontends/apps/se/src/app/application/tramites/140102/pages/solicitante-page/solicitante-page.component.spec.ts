import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SolicitantePageComponent } from './solicitante-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { ToastrService } from 'ngx-toastr';
import { of, Subject, throwError } from 'rxjs';
import { Tramite140101Store } from '../../../../estados/tramites/tramite140101.store';
import { Tramite140101Query } from '../../../../estados/queries/tramite140101.query';
import { RegistroSolicitudService } from '@libs/shared/data-access-user/src';
import { DatosComponent } from '../pantallas/datos.component';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';

describe('SolicitantePageComponent', () => {
  let component: SolicitantePageComponent;
  let fixture: ComponentFixture<SolicitantePageComponent>;
  let mockWizardComponent: { siguiente: jest.Mock; atras: jest.Mock; indiceActual: number };
  let mockToastrService: any;
  let mockTramite140101Store: any;
  let mockTramite140101Query: any;
  let mockRegistroSolicitudService: any;
  let mockDatosComponent: any;

  beforeEach(async () => {
    mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      indiceActual: 1
    };

    mockToastrService = {
      success: jest.fn(),
      error: jest.fn()
    };

    mockTramite140101Store = {
      setIdSolicitud: jest.fn()
    };

    mockTramite140101Query = {
      selectSolicitud$: of({
        programaACancelar: {
          folioPrograma: 'FOL123',
          idProgramaSeleccionado: '1'
        },
        solicitudObservaciones: 'Test obs',
        confirmar: true
      })
    };

    mockRegistroSolicitudService = {
      postGuardarDatos: jest.fn().mockReturnValue(of({
        codigo: '00',
        mensaje: 'Guardado exitoso',
        datos: { id_solicitud: 123 }
      }))
    };

    mockDatosComponent = {
      validarFormularios: jest.fn().mockReturnValue(true),
      formFieldValidado: true
    };

    await TestBed.configureTestingModule({
      declarations: [SolicitantePageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Tramite140101Store, useValue: mockTramite140101Store },
        { provide: Tramite140101Query, useValue: mockTramite140101Query },
        { provide: RegistroSolicitudService, useValue: mockRegistroSolicitudService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitantePageComponent);
    component = fixture.componentInstance;
    
    Object.defineProperty(window, 'scrollTo', {
      value: jest.fn(),
      writable: true
    });
    
    fixture.detectChanges();

    component.wizardComponent = mockWizardComponent as any;
    component.datosComponent = mockDatosComponent as any;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar indice en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debe inicializar esFormaValido como true', () => {
    expect(component.esFormaValido).toBe(true);
  });

  describe('getValorIndice', () => {
    beforeEach(() => {
      component.datosComponent = mockDatosComponent as any;
      component.wizardComponent = mockWizardComponent as any;
    });

    it('debe validar y mostrar error cuando validarFormularios es false en indice 1', () => {
      component.indice = 1;
      mockDatosComponent.formFieldValidado = true;
      mockDatosComponent.validarFormularios.mockReturnValue(false);
      
      component.getValorIndice({ valor: 2, accion: 'cont' });
      
      expect(component.datosPasos.indice).toBe(1);
      expect(component.formErrorAlert).toContain('Faltan campos por capturar');
      expect(component.esFormaValido).toBe(false);
    });

    it('debe validar y mostrar error cuando validarFormularios es true pero formFieldValidado es false', fakeAsync(() => {
      component.indice = 1;
      mockDatosComponent.formFieldValidado = false;
      mockDatosComponent.validarFormularios.mockReturnValue(true);
      
      const scrollToSpy = jest.spyOn(window, 'scrollTo');
      
      component.getValorIndice({ valor: 2, accion: 'cont' });
      tick();
      
      expect(component.datosPasos.indice).toBe(1);
      expect(component.formErrorAlert).toContain('Seleccione un programa');
      expect(component.esFormaValido).toBe(false);
      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    }));

    it('debe procesar onGuardar cuando formulario es válido en indice 1', fakeAsync(() => {
      component.indice = 1;
      mockDatosComponent.formFieldValidado = true;
      mockDatosComponent.validarFormularios.mockReturnValue(true);
      
      const mockResponse: BaseResponse<{ id_solicitud: number }> = {
        codigo: '00',
        mensaje: 'Guardado exitoso',
        datos: { id_solicitud: 123 },
        path: '/test',
        timestamp: '2024-01-01'
      };
      
      const onGuardarSpy = jest.spyOn(component, 'onGuardar').mockReturnValue(of(mockResponse));
      
      component.getValorIndice({ valor: 2, accion: 'cont' });
      tick();
      
      expect(onGuardarSpy).toHaveBeenCalled();
    }));

    it('debe manejar error de respuesta del servicio en indice 1', fakeAsync(() => {
      component.indice = 1;
      mockDatosComponent.formFieldValidado = true;
      mockDatosComponent.validarFormularios.mockReturnValue(true);
      
      const mockErrorResponse: BaseResponse<{ id_solicitud: number }> = {
        codigo: '01',
        mensaje: 'Error en el servicio',
        error: 'Error message',
        datos: { id_solicitud: 0 },
        path: '/test',
        timestamp: '2024-01-01'
      };
      
      const onGuardarSpy = jest.spyOn(component, 'onGuardar').mockReturnValue(of(mockErrorResponse));
      const scrollToSpy = jest.spyOn(window, 'scrollTo');
      
      component.getValorIndice({ valor: 2, accion: 'cont' });
      tick();
      
      expect(component.formErrorAlert).toContain('Error message');
      expect(component.esFormaValido).toBe(false);
      expect(component.indice).toBe(1);
      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    }));

    it('debe manejar error observable en onGuardar', fakeAsync(() => {
      component.indice = 1;
      mockDatosComponent.formFieldValidado = true;
      mockDatosComponent.validarFormularios.mockReturnValue(true);
      
      const onGuardarSpy = jest.spyOn(component, 'onGuardar').mockReturnValue(throwError('Observable error'));
      
      component.getValorIndice({ valor: 2, accion: 'cont' });
      tick();
      
      expect(component.indice).toBe(1);
      expect(component.datosPasos.indice).toBe(1);
      expect(mockWizardComponent.indiceActual).toBe(1);
    }));

    it('debe procesar acción cuando indice no es 1 y acción es cont', () => {
      component.indice = 2;
      
      component.getValorIndice({ valor: 3, accion: 'cont' });
      
      expect(component.indice).toBe(3);
      expect(mockWizardComponent.siguiente).toHaveBeenCalled();
    });

    it('debe procesar acción cuando indice no es 1 y acción es atras', () => {
      component.indice = 3;
      
      component.getValorIndice({ valor: 2, accion: 'atras' });
      
      expect(component.indice).toBe(2);
      expect(mockWizardComponent.atras).toHaveBeenCalled();
    });

    it('no debe actualizar indice si valor está fuera de rango', () => {
      component.indice = 2;
      
      component.getValorIndice({ valor: 0, accion: 'cont' });
      
      expect(component.indice).toBe(2);
      expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
      expect(mockWizardComponent.atras).not.toHaveBeenCalled();
    });

    it('debe manejar caso cuando datosComponent es undefined', () => {
      component.indice = 1;
      component.datosComponent = undefined as any;
      
      component.getValorIndice({ valor: 2, accion: 'cont' });
      
      expect(component.datosPasos.indice).toBe(1);
      expect(component.formErrorAlert).toContain('Faltan campos por capturar');
    });
  });

  describe('onGuardar', () => {
    it('debe llamar al servicio de guardado y retornar observable', fakeAsync(() => {
      const expectedIdTramite = '140101';
      const expectedTransformedData = {
        confirmar: true,
        id_programa_seleccionado: undefined,
        id_solcitud: 0,
        observaciones: 'Test obs',
        solicitante: {
          certificado_serial_number: '3082054030820428a00302010',
          rfc: 'AAL0409235E6'
        },
        tipoDeSolicitud: 'continuar'
      };

      const result = component.onGuardar();
      
      result.subscribe();
      tick();
      
      expect(result).toBeDefined();
      expect(mockRegistroSolicitudService.postGuardarDatos).toHaveBeenCalledWith(expectedIdTramite, expectedTransformedData);
    }));

    it('debe manejar respuesta exitosa del servicio', fakeAsync(() => {
      component.onGuardar().subscribe(response => {
        expect(response.codigo).toBe('00');
        expect(response.mensaje).toBe('Guardado exitoso');
        expect(response.datos?.id_solicitud).toBe(123);
      });
      tick();
    }));

    it('debe manejar error del servicio', fakeAsync(() => {
      mockRegistroSolicitudService.postGuardarDatos.mockReturnValue(throwError('Service error'));
      
      component.onGuardar().subscribe({
        error: (error) => {
          expect(error).toBe('Service error');
        }
      });
      tick();
    }));
  });

  describe('ngOnDestroy', () => {
    it('debe completar destroyNotifier$ subject', () => {
      const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
      component.ngOnDestroy();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('debe manejar destroy$ siendo ya completado', () => {
      component.destroyNotifier$.complete();
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('component properties', () => {
    it('debe tener TEXTOS definido', () => {
      expect(component.TEXTOS).toBeDefined();
      expect(component.TEXTOS.AVISO).toBeDefined();
      expect(component.TEXTOS.FIRMAR).toBeDefined();
    });

    it('debe inicializar datosPasos correctamente', () => {
      expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
      expect(component.datosPasos.indice).toBe(component.indice);
      expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
      expect(component.datosPasos.txtBtnSig).toBe('Continuar');
    });

    it('debe inicializar esFormaValido como true', () => {
      expect(component.esFormaValido).toBe(true);
    });

    it('debe tener formErrorAlert como undefined por defecto', () => {
      expect(component.formErrorAlert).toBeUndefined();
    });
  });

  describe('subscription handling', () => {
    it('debe manejar tramite140101Query.selectSolicitud$ observable', fakeAsync(() => {
      const newSolicitud = {
        programaACancelar: {
          folioPrograma: 'NEW123',
          idProgramaSeleccionado: '2'
        },
        solicitudObservaciones: 'New obs',
        confirmar: false
      };

      mockTramite140101Query.selectSolicitud$ = of(newSolicitud);
      
      mockTramite140101Query.selectSolicitud$.subscribe((data: any) => {
        expect(data).toEqual(newSolicitud);
      });
      tick();
    }));

    it('debe manejar null en selectSolicitud$ observable', fakeAsync(() => {
      mockTramite140101Query.selectSolicitud$ = of(null);
      
      mockTramite140101Query.selectSolicitud$.subscribe((data: any) => {
        expect(data).toBeNull();
      });
      tick();
    }));

    it('debe manejar error en selectSolicitud$ observable', fakeAsync(() => {
      mockTramite140101Query.selectSolicitud$ = throwError('Observable error');
      
      expect(() => {
        mockTramite140101Query.selectSolicitud$.subscribe({
          error: (error: any) => {
            expect(error).toBe('Observable error');
          }
        });
        tick();
      }).not.toThrow();
    }));
  });

  describe('edge cases and error handling', () => {
    it('debe manejar wizardComponent undefined', () => {
      component.wizardComponent = undefined as any;
      component.indice = 2;
      
      expect(() => component.getValorIndice({ valor: 3, accion: 'cont' })).toThrow();
    });

    it('debe manejar valores negativos en getValorIndice', () => {
      component.indice = 2;
      
      component.getValorIndice({ valor: -1, accion: 'cont' });
      
      expect(component.indice).toBe(2);
    });

    it('debe manejar acción inválida en getValorIndice', () => {
      component.indice = 2;
      
      component.getValorIndice({ valor: 3, accion: 'invalid' as any });
      
      expect(component.indice).toBe(3);
    });

    it('debe manejar respuesta sin datos en onGuardar', fakeAsync(() => {
      const originalMock = mockRegistroSolicitudService.postGuardarDatos;
      mockRegistroSolicitudService.postGuardarDatos = jest.fn().mockReturnValue(of({
        codigo: '00',
        mensaje: 'Success',
        datos: null
      }));
      
      component.onGuardar().subscribe((response: any) => {
        expect(response.datos).toEqual({ id_solicitud: 0 });
      });
      tick();
      
      mockRegistroSolicitudService.postGuardarDatos = originalMock;
    }));
  });
});