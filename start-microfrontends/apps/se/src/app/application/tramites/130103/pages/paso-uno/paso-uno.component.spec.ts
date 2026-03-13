import { PasoUnoComponent } from './paso-uno.component';
import { Subject, of } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let importacionDefinitivaService: any;
  let consultaState: any;
  const mockConsultaioState = {
    update: false,
    procedureId: '',
    parameter: '',
    department: '',
    folioTramite: '',
    readonly: false,
    tramite: '',
    tramiteId: '',
    tramiteName: '',
    tramiteType: '',
    tramiteStatus: '',
    tramiteDate: '',
    tramiteUser: '',
    tramiteDepartment: '',
    tramiteFolio: '',
    tipoDeTramite: '',
    estadoDeTramite: '',
    create: false,
    consultaioSolicitante: {
      folioDelTramite: '',
      fechaDeInicio: '',
      estadoDelTramite: '',
      tipoDeTramite: ''
    },
    consultaioRepresentacion: {},
    consultaioMercancia: {},
    consultaioPartidas: {},
    consultaioDocumentos: {},
    action_id: '',
    current_user: '',
    id_solicitud: '',
    nombre_pagina: ''
  };

  beforeEach(() => {
    importacionDefinitivaService = {
      getImportacionDefinitivaData: jest.fn(() => of({ test: 'value' })),
      actualizarEstadoFormulario: jest.fn()
    };
    consultaState = { ...mockConsultaioState };
    component = new PasoUnoComponent(importacionDefinitivaService);
    component.consultaState = consultaState;
    component.pestanaCambiado = { emit: jest.fn() } as any;
    component.solicitudComponent = { validarFormulario: jest.fn() } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call guardarDatosFormulario and set esDatosRespuesta true if consultaState.update', () => {
    component.consultaState = { ...mockConsultaioState, update: true };
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta true if consultaState.update is false', () => {
    component.consultaState = { ...mockConsultaioState, update: false };
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call actualizarEstadoFormulario for each key in guardarDatosFormulario', () => {
    importacionDefinitivaService.getImportacionDefinitivaData.mockReturnValue(of({ a: 1, b: 2 }));
    component.guardarDatosFormulario();
    expect(importacionDefinitivaService.actualizarEstadoFormulario).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should set indice and emit pestanaCambiado in seleccionaTab', () => {
    component.indice = 1;
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
    expect(component.pestanaCambiado.emit).toHaveBeenCalledWith(2);
  });

  it('should call destroyNotifier$ next and complete in ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
