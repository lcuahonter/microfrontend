import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { PasoUnoComponent } from './paso-uno.component';
import { EntregaActaService } from '../../services/entrega-acta.service';
import { Tramite32507Store } from '../../../../estados/tramites/tramite32507.store';
import { Tramite32507Query } from '../../../../estados/queries/tramite32507.query';
import { ConsultaioQuery, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let entregaActaServiceMock: any;
  let storeMock: any;
  let tramiteQueryMock: any;
  let consultaioQueryMock: any;
  let validacionesServiceMock: any;

  beforeEach(async () => {
    entregaActaServiceMock = {
      getDatosConsulta: jest.fn(),
      obtenerDatosSolicitante: jest.fn().mockReturnValue(of({
        rfc: 'TEST123',
        denominacion: 'Test Company',
        actividadEconomica: 'Test Activity',
        correoElectronico: 'test@test.com',
        pais: 'México',
        codigoPostal: '12345',
        entidadFederativa: 'Test Estado',
        municipio: 'Test Municipio',
        localidad: 'Test Localidad',
        colonia: 'Test Colonia',
        calle: 'Test Calle',
        nExt: '123',
        nInt: 'A',
        lada: '55',
        telefono: '1234567890',
        adace: 'Test Adace'
      })),
      obtenerLevantaActa: jest.fn().mockReturnValue(of({
        datos: [{ clave: '1', descripcion: 'Mock Adace' }]
      })),
      obtenerUnidadMedida: jest.fn().mockReturnValue(of({
        datos: [{ clave: 'kg', descripcion: 'Kilogramo' }]
      })),
      obtenerAvisoTabla: jest.fn().mockReturnValue(of({
        datos: [{
          idTransaccionVUCEM: 'TX-001',
          cantidad: '10',
          pesoKg: '5',
          descripcionUnidadMedida: 'kg',
          descripcion: 'Test Item'
        }]
      }))
    };

    storeMock = {
      setAvisoFormularioAdace: jest.fn(),
      setAvisoFormularioValorAnioProgramaImmex: jest.fn(),
      setAvisoFormularioValorProgramaImmex: jest.fn(),
      setAvisoFormularioTipoBusqueda: jest.fn(),
      setAvisoFormularioLevantaActa: jest.fn(),
      setDatosSolicitante: jest.fn(),
      setAvisoFormularioTransaccionId: jest.fn(),
      setAvisoFormularioCantidad: jest.fn(),
      setAvisoFormularioPeso: jest.fn(),
      setAvisoFormularioUnidadMedida: jest.fn(),
      setAvisoFormularioDescripcion: jest.fn()
    };

    tramiteQueryMock = {
      selectSolicitud$: of({
        datosSolicitante: {
          rfc: 'TEST123',
          denominacion: 'Test Company'
        },
        avisoFormulario: {
          adace: 'Test Adace',
          valorProgramaImmex: '12345',
          valorAnioProgramaImmex: '2024'
        }
      })
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({
        procedureId: '',
        parameter: '',
        department: '',
        folioTramite: '',
        tipoDeTramite: '',
        estadoDeTramite: '',
        readonly: false,
        create: true,
        update: false,
        consultaioSolicitante: null
      })
    };

    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [
        PasoUnoComponent,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: EntregaActaService, useValue: entregaActaServiceMock },
        { provide: Tramite32507Store, useValue: storeMock },
        { provide: Tramite32507Query, useValue: tramiteQueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fetchGetDatosConsulta', () => {
    it('should handle successful response and update store with all data', () => {
      const mockSuccessResponse = {
        success: true,
        datos: {
          adace: 'Test Adace Value',
          valorAnioProgramaImmex: '2024',
          valorProgramaImmex: '67890',
          tipoBusqueda: 'Tipo Test',
          levantaActa: 'Levanta Test'
        }
      };

      entregaActaServiceMock.getDatosConsulta.mockReturnValue(of(mockSuccessResponse));

      component.fetchGetDatosConsulta();

      expect(entregaActaServiceMock.getDatosConsulta).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(true);
      expect(storeMock.setAvisoFormularioAdace).toHaveBeenCalledWith('Test Adace Value');
      expect(storeMock.setAvisoFormularioValorAnioProgramaImmex).toHaveBeenCalledWith('2024');
      expect(storeMock.setAvisoFormularioValorProgramaImmex).toHaveBeenCalledWith('67890');
      expect(storeMock.setAvisoFormularioTipoBusqueda).toHaveBeenCalledWith('Tipo Test');
      expect(storeMock.setAvisoFormularioLevantaActa).toHaveBeenCalledWith('Levanta Test');
    });

    it('should handle successful response with undefined valorProgramaImmex', () => {
      const mockSuccessResponse = {
        success: true,
        datos: {
          adace: 'Test Adace',
          valorAnioProgramaImmex: '2024',
          valorProgramaImmex: undefined,
          tipoBusqueda: 'Tipo Test',
          levantaActa: 'Levanta Test'
        }
      };

      entregaActaServiceMock.getDatosConsulta.mockReturnValue(of(mockSuccessResponse));

      component.fetchGetDatosConsulta();

      expect(storeMock.setAvisoFormularioValorProgramaImmex).toHaveBeenCalledWith(undefined);
    });

    it('should handle successful response with null datos.valorProgramaImmex', () => {
      const mockSuccessResponse = {
        success: true,
        datos: {
          adace: 'Test Adace',
          valorAnioProgramaImmex: '2024',
          valorProgramaImmex: null,
          tipoBusqueda: 'Tipo Test',
          levantaActa: 'Levanta Test'
        }
      };

      entregaActaServiceMock.getDatosConsulta.mockReturnValue(of(mockSuccessResponse));

      component.fetchGetDatosConsulta();

      expect(storeMock.setAvisoFormularioValorProgramaImmex).toHaveBeenCalledWith(null);
    });

    it('should not update store when response.success is false', () => {
      const mockFailureResponse = {
        success: false,
        datos: {
          adace: 'Test Adace',
          valorAnioProgramaImmex: '2024',
          valorProgramaImmex: '12345',
          tipoBusqueda: 'Tipo Test',
          levantaActa: 'Levanta Test'
        }
      };

      entregaActaServiceMock.getDatosConsulta.mockReturnValue(of(mockFailureResponse));
      component.esDatosRespuesta = false;

      component.fetchGetDatosConsulta();

      expect(entregaActaServiceMock.getDatosConsulta).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(false);
      expect(storeMock.setAvisoFormularioAdace).not.toHaveBeenCalled();
      expect(storeMock.setAvisoFormularioValorAnioProgramaImmex).not.toHaveBeenCalled();
      expect(storeMock.setAvisoFormularioValorProgramaImmex).not.toHaveBeenCalled();
      expect(storeMock.setAvisoFormularioTipoBusqueda).not.toHaveBeenCalled();
      expect(storeMock.setAvisoFormularioLevantaActa).not.toHaveBeenCalled();
    });

    it('should not update store when response.success is undefined', () => {
      const mockResponse = {
        datos: {
          adace: 'Test Adace',
          valorAnioProgramaImmex: '2024',
          valorProgramaImmex: '12345',
          tipoBusqueda: 'Tipo Test',
          levantaActa: 'Levanta Test'
        }
      };

      entregaActaServiceMock.getDatosConsulta.mockReturnValue(of(mockResponse));
      component.esDatosRespuesta = false;

      component.fetchGetDatosConsulta();

      expect(component.esDatosRespuesta).toBe(false);
      expect(storeMock.setAvisoFormularioAdace).not.toHaveBeenCalled();
    });

    it('should handle subscription lifecycle with takeUntil', () => {
      const mockResponse = {
        success: true,
        datos: {
          adace: 'Test Adace',
          valorAnioProgramaImmex: '2024',
          valorProgramaImmex: '12345',
          tipoBusqueda: 'Tipo Test',
          levantaActa: 'Levanta Test'
        }
      };

      entregaActaServiceMock.getDatosConsulta.mockReturnValue(of(mockResponse));
      const destroyNotifierSpy = jest.spyOn(component.destroyNotifier$, 'next');

      component.fetchGetDatosConsulta();
      component.ngOnDestroy();

      expect(destroyNotifierSpy).toHaveBeenCalled();
    });

    it('should handle empty datos object', () => {
      const mockResponse = {
        success: true,
        datos: {}
      };

      entregaActaServiceMock.getDatosConsulta.mockReturnValue(of(mockResponse));

      component.fetchGetDatosConsulta();

      expect(component.esDatosRespuesta).toBe(true);
      expect(storeMock.setAvisoFormularioAdace).toHaveBeenCalledWith(undefined);
      expect(storeMock.setAvisoFormularioValorAnioProgramaImmex).toHaveBeenCalledWith(undefined);
      expect(storeMock.setAvisoFormularioValorProgramaImmex).toHaveBeenCalledWith(undefined);
      expect(storeMock.setAvisoFormularioTipoBusqueda).toHaveBeenCalledWith(undefined);
      expect(storeMock.setAvisoFormularioLevantaActa).toHaveBeenCalledWith(undefined);
    });

    it('should handle null datos', () => {
      const mockResponse = {
        success: true,
        datos: null
      };

      entregaActaServiceMock.getDatosConsulta.mockReturnValue(of(mockResponse));

      expect(() => component.fetchGetDatosConsulta()).not.toThrow();
      expect(component.esDatosRespuesta).toBe(true);
    });

    it('should set esDatosRespuesta to true only when success is true', () => {
      const mockResponse = {
        success: true,
        datos: {
          adace: 'Test'
        }
      };

      entregaActaServiceMock.getDatosConsulta.mockReturnValue(of(mockResponse));
      component.esDatosRespuesta = false;

      component.fetchGetDatosConsulta();

      expect(component.esDatosRespuesta).toBe(true);
    });
  });

  describe('Component lifecycle and initialization', () => {
    it('should properly handle ngOnDestroy', () => {
      const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
      const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should initialize with correct default values', () => {
      expect(component.indice).toBe(1);
      expect(component.esDatosRespuesta).toBe(true);
    });

    it('should handle seleccionaTab method', () => {
      component.seleccionaTab(3);
      expect(component.indice).toBe(3);

      component.seleccionaTab(0);
      expect(component.indice).toBe(0);
    });

    it('should call fetchGetDatosConsulta when consultaDatos.update is true', () => {
      const mockSuccessResponse = {
        success: true,
        datos: {
          adace: 'Test Adace',
          valorAnioProgramaImmex: '2024',
          valorProgramaImmex: '12345',
          tipoBusqueda: 'Tipo Test',
          levantaActa: 'Levanta Test'
        }
      };
      entregaActaServiceMock.getDatosConsulta.mockReturnValue(of(mockSuccessResponse));

      const consultaioQueryWithUpdate = {
        selectConsultaioState$: of({
          procedureId: '',
          parameter: '',
          department: '',
          folioTramite: '',
          tipoDeTramite: '',
          estadoDeTramite: '',
          readonly: false,
          create: true,
          update: true,
          consultaioSolicitante: null
        })
      } as any;

      const testComponent = new PasoUnoComponent(
        storeMock,
        tramiteQueryMock,
        entregaActaServiceMock,
        consultaioQueryWithUpdate
      );
      
      const spyFetch = jest.spyOn(testComponent, 'fetchGetDatosConsulta');
      
      testComponent.ngOnInit();

      expect(spyFetch).toHaveBeenCalled();
    });

    it('should set esDatosRespuesta to true when consultaDatos.update is false', () => {
      expect(component.esDatosRespuesta).toBe(true);
      expect(component.consultaDatos.update).toBe(false);
    });

    it('should handle component subscriptions in ngOnInit', () => {
      expect(component.consultaDatos).toBeDefined();
      expect(component.consultaDatos.update).toBe(false);
      expect(component.consultaDatos.readonly).toBe(false);
    
    });
  });
});
