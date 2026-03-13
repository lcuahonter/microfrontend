import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { SolicitanteComponent } from '../../components/solicitante/solicitante.component';
import { AvisoComponent } from '../../components/aviso/aviso.component';
import { Tramite32503Query } from '../../../../estados/queries/tramite32503.query';
import { Tramite32503Store } from '../../../../estados/tramites/tramite32503.store';
import { of, Subject } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { AvisoTrasladoService } from '../../services/aviso-traslado.service';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let tramiteQueryMock: any;
  let tramiteStoreMock: any;
  let avisoTrasladoServiceMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    avisoTrasladoServiceMock = {
      getDatosConsulta: jest.fn().mockReturnValue(
        of({
          success: true,
          datos: {
            avisoFormulario: { tipoAviso: 'Test Tipo Aviso' },
            tablaDeDatos: [{ id: 1, descripcion: 'Test Tabla' }],
          },
        })
      ),
    };
    tramiteQueryMock = {
      selectSolicitud$: of({
        pestanaActiva: 1,
        datosSolicitante: {
          tipoPersona: 'MORAL_NACIONAL',
          rfc: 'TEST123456789',
          nombres: 'Juan',
          apellidoPaterno: 'Pérez'
        }
      }),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({
        action_id: "",
        consultaioSolicitante: null,
        create: true,
        current_user: "",
        department: "",
        estadoDeTramite: "",
        folioTramite: "",
        id_solicitud: "",
        nombre_pagina: "",
        parameter: "",
        procedureId: "",
        readonly: false,
        tipoDeTramite: "",
        update: false
      })
    };

    tramiteStoreMock = {
      setPestanaActiva: jest.fn(),
      setAvisoFormulario: jest.fn(),
      setTablaDeDatos: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PasoUnoComponent, SolicitanteComponent, AvisoComponent],
      providers: [
        provideHttpClient(),
        { provide: Tramite32503Query, useValue: tramiteQueryMock },
        { provide: Tramite32503Store, useValue: tramiteStoreMock },
        { provide: AvisoTrasladoService, useValue: avisoTrasladoServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the active tab index on ngOnInit', () => {
    component.ngOnInit();
    expect(component.indice).toBe(1);
  });

  it('should call setPestanaActiva when seleccionaTab is called', () => {
    const tabIndex = 2;
    component.seleccionaTab(tabIndex);
    expect(component.indice).toBe(tabIndex);
    expect(tramiteStoreMock.setPestanaActiva).toHaveBeenCalledWith(tabIndex);
  });

  it('should subscribe to tramiteQuery and update tramiteState', () => {
    component.ngOnInit();
    expect(component.tramiteState).toEqual({
      pestanaActiva: 1,
      datosSolicitante: {
        tipoPersona: 'MORAL_NACIONAL',
        rfc: 'TEST123456789',
        nombres: 'Juan',
        apellidoPaterno: 'Pérez'
      }
    });
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should fetch data and update the store when fetchGetDatosConsulta is called', () => {
    component.fetchGetDatosConsulta();
    expect(avisoTrasladoServiceMock.getDatosConsulta).toHaveBeenCalled();
    expect(tramiteStoreMock.setAvisoFormulario).toHaveBeenCalledWith({
      tipoAviso: 'Test Tipo Aviso',
    });
    expect(tramiteStoreMock.setTablaDeDatos).toHaveBeenCalledWith([
      { id: 1, descripcion: 'Test Tabla' },
    ]);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call obtenerTipoPersona on ngAfterViewInit', () => {
    const obtenerTipoPersonaSpy = jest.spyOn(component, 'obtenerTipoPersona');
    component.ngAfterViewInit();
    expect(obtenerTipoPersonaSpy).toHaveBeenCalled();
  });

  it('should call solicitante.obtenerTipoPersona with TIPO_PERSONA.MORAL_NACIONAL', (done) => {
    const mockSolicitante = {
      obtenerTipoPersona: jest.fn()
    };
    component.solicitante = mockSolicitante as any;
    
    component.obtenerTipoPersona();
    
    setTimeout(() => {
      expect(mockSolicitante.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
      done();
    }, 60);
  });

  it('should not call solicitante.obtenerTipoPersona if solicitante is undefined', (done) => {
    component.solicitante = undefined as any;
    
    component.obtenerTipoPersona();
    
    setTimeout(() => {
      expect(component.solicitante).toBeUndefined();
      done();
    }, 60);
  });


  it('should set esDatosRespuesta to true when consultaDatos.update is false', () => {
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should not update store when fetchGetDatosConsulta returns unsuccessful response', () => {
    avisoTrasladoServiceMock.getDatosConsulta.mockReturnValue(
      of({
        success: false,
        datos: null
      })
    );
    
    component.esDatosRespuesta = false;
    
    component.fetchGetDatosConsulta();
    expect(avisoTrasladoServiceMock.getDatosConsulta).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(false);
  });

  it('should return true when both solicitante and aviso are valid', () => {
    const mockSolicitante = {
      obtenerTipoPersona: jest.fn()
    };
    const mockAviso = {
      activarValidacionFormulario: jest.fn().mockReturnValue(true)
    };
    
    component.solicitante = mockSolicitante as any;
    component.aviso = mockAviso as any;
    component.tramiteState = {
      datosSolicitante: {
        tipoPersona: 'MORAL_NACIONAL',
        rfc: 'TEST123456789',
        nombres: 'Juan',
        apellidoPaterno: 'Pérez'
      }
    } as any;
    
    const result = component.triggerValidation();
    expect(result).toBe(true);
    expect(mockAviso.activarValidacionFormulario).toHaveBeenCalled();
  });

  it('should return false when solicitante is invalid', () => {
    const mockAviso = {
      activarValidacionFormulario: jest.fn().mockReturnValue(true)
    };
    
    component.solicitante = {} as any;
    component.aviso = mockAviso as any;
    component.tramiteState = {
      datosSolicitante: {
        tipoPersona: '',
        rfc: '',
        nombres: '',
        apellidoPaterno: ''
      }
    } as any;
    
    const result = component.triggerValidation();
    expect(result).toBe(false);
  });

  it('should return false when aviso is invalid and switch to tab 2', () => {
    const mockSolicitante = {
      obtenerTipoPersona: jest.fn()
    };
    const mockAviso = {
      activarValidacionFormulario: jest.fn().mockReturnValue(false)
    };
    
    component.solicitante = mockSolicitante as any;
    component.aviso = mockAviso as any;
    component.tramiteState = {
      datosSolicitante: {
        tipoPersona: 'MORAL_NACIONAL',
        rfc: 'TEST123456789',
        nombres: 'Juan',
        apellidoPaterno: 'Pérez'
      }
    } as any;
    component.indice = 1;
    
    const seleccionaTabSpy = jest.spyOn(component, 'seleccionaTab');
    const result = component.triggerValidation();
    
    expect(result).toBe(false);
    expect(seleccionaTabSpy).toHaveBeenCalledWith(2);
  });

  it('should not switch tabs when aviso is invalid but already on tab 2', () => {
    const mockSolicitante = {
      obtenerTipoPersona: jest.fn()
    };
    const mockAviso = {
      activarValidacionFormulario: jest.fn().mockReturnValue(false)
    };
    
    component.solicitante = mockSolicitante as any;
    component.aviso = mockAviso as any;
    component.tramiteState = {
      datosSolicitante: {
        tipoPersona: 'MORAL_NACIONAL',
        rfc: 'TEST123456789',
        nombres: 'Juan',
        apellidoPaterno: 'Pérez'
      }
    } as any;
    component.indice = 2;
    
    const seleccionaTabSpy = jest.spyOn(component, 'seleccionaTab');
    const result = component.triggerValidation();
    
    expect(result).toBe(false);
    expect(seleccionaTabSpy).not.toHaveBeenCalled();
  });

  it('should handle triggerValidation when solicitante is undefined', () => {
    const mockAviso = {
      activarValidacionFormulario: jest.fn().mockReturnValue(true)
    };
    
    component.solicitante = undefined as any;
    component.aviso = mockAviso as any;
    component.tramiteState = undefined as any;
    
    const result = component.triggerValidation();
    expect(result).toBe(true);
  });

  it('should handle triggerValidation when aviso is undefined', () => {
    const mockSolicitante = {
      obtenerTipoPersona: jest.fn()
    };
    
    component.solicitante = mockSolicitante as any;
    component.aviso = undefined as any;
    component.tramiteState = {
      datosSolicitante: {
        tipoPersona: 'MORAL_NACIONAL',
        rfc: 'TEST123456789',
        nombres: 'Juan',
        apellidoPaterno: 'Pérez'
      }
    } as any;
    
    const result = component.triggerValidation();
    expect(result).toBe(true);
  });

  it('should return false when tramiteState is undefined', () => {
    const result = PasoUnoComponent.validateSolicitanteData(undefined as any);
    expect(result).toBe(false);
  });

  it('should return false when datosSolicitante is undefined', () => {
    const tramiteState = {
      datosSolicitante: undefined
    } as any;
    const result = PasoUnoComponent.validateSolicitanteData(tramiteState);
    expect(result).toBe(false);
  });

  it('should return false when required fields are missing', () => {
    const tramiteState = {
      datosSolicitante: {
        tipoPersona: '',
        rfc: 'TEST123456789',
        nombres: 'Juan',
        apellidoPaterno: 'Pérez'
      }
    } as any;
    const result = PasoUnoComponent.validateSolicitanteData(tramiteState);
    expect(result).toBe(false);
  });

  it('should return false when required fields are whitespace only', () => {
    const tramiteState = {
      datosSolicitante: {
        tipoPersona: 'MORAL_NACIONAL',
        rfc: '   ',
        nombres: 'Juan',
        apellidoPaterno: 'Pérez'
      }
    } as any;
    const result = PasoUnoComponent.validateSolicitanteData(tramiteState);
    expect(result).toBe(false);
  });

  it('should return true when all required fields are present', () => {
    const tramiteState = {
      datosSolicitante: {
        tipoPersona: 'MORAL_NACIONAL',
        rfc: 'TEST123456789',
        nombres: 'Juan',
        apellidoPaterno: 'Pérez'
      }
    } as any;
    const result = PasoUnoComponent.validateSolicitanteData(tramiteState);
    expect(result).toBe(true);
  });

  it('should return false when any required field is null', () => {
    const tramiteState = {
      datosSolicitante: {
        tipoPersona: 'MORAL_NACIONAL',
        rfc: null,
        nombres: 'Juan',
        apellidoPaterno: 'Pérez'
      }
    } as any;
    const result = PasoUnoComponent.validateSolicitanteData(tramiteState);
    expect(result).toBe(false);
  });

  it('should call obtenerTipoPersona when seleccionaTab is called', () => {
    const obtenerTipoPersonaSpy = jest.spyOn(component, 'obtenerTipoPersona');
    component.seleccionaTab(3);
    expect(obtenerTipoPersonaSpy).toHaveBeenCalled();
  });

  it('should handle undefined tramiteState.pestanaActiva', () => {
    tramiteQueryMock.selectSolicitud$ = of({
      pestanaActiva: undefined
    });
    
    component.ngOnInit();
    expect(component.indice).toBeUndefined();
  });

});