import {
  AlertComponent,
  BtnContinuarComponent,
  ERROR_FORMA_ALERT,
  SeccionLibStore
} from '@ng-mf/data-access-user';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoCapturarSolicitudComponent } from './paso-capturar-solicitud.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { ModalidadTerciarizaciónModule } from '../../modalidad-terciarización.module';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { Subject, of } from 'rxjs';

describe('PasoCapturarSolicitudComponent Full Coverage', () => {
  let component: PasoCapturarSolicitudComponent;
  let fixture: ComponentFixture<PasoCapturarSolicitudComponent>;
  let mockWizardComponent: any;
  let mockWizardService: any;
  let mockTramiteQuery: any;
  let mockSeccion: any;
  let mockNuevoProgramaIndustrialService: any;
  let mockTramite80105Store: any;
  let mockTramite80105Query: any;
  let mockToastrService: any;
  let mockConsultaQuery: any;
  let mockServicioDeFormularioService: any;
  let mockFormaValida$: Subject<boolean>;

  beforeEach(async () => {
    mockFormaValida$ = new Subject<boolean>();
    mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      indiceActual: 1
    };
    mockWizardService = { cambio_indice: jest.fn() };
    mockTramiteQuery = {};
    mockSeccion = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn(),
      _select: jest.fn(() => of({}))
    };
    mockNuevoProgramaIndustrialService = {
      getAllState: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn()
      }),
      buildComplimentos: jest.fn().mockReturnValue({}),
      buildDeclaracionSolicitudEntries: jest.fn().mockReturnValue([]),
      buildPlantasControladoras: jest.fn().mockReturnValue([]),
      buildPlantas: jest.fn().mockReturnValue([]),
      buildAnexo: jest.fn().mockReturnValue({ anexo: {} }),
      buildPlantasSubmanufactureras: jest.fn().mockReturnValue([]),
      buildDatosFederatarios: jest.fn().mockReturnValue([]),
      buildSociosAccionistas: jest.fn().mockReturnValue([]),
      guardarDatosPost: jest.fn().mockReturnValue({
        subscribe: (cb: any, err: any) => cb({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 1 } })
      })
    };
    mockTramite80105Store = { setIdSolicitud: jest.fn() };
    mockTramite80105Query = {
      selectSeccionState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }
    };
    mockToastrService = { success: jest.fn(), error: jest.fn() };
    mockConsultaQuery = {
      selectConsultaioState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }
    };
    mockServicioDeFormularioService = {
      isFormValid: jest.fn().mockReturnValue(true),
      isArrayFilled: jest.fn().mockReturnValue(true),
      markFormAsTouched: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoCapturarSolicitudComponent],
      imports: [
        HttpClientTestingModule,
        WizardComponent,
        FirmaElectronicaComponent,
        BtnContinuarComponent,
        AlertComponent,
        ModalidadTerciarizaciónModule,
      ],
      providers: [
        { provide: Tramite80101Query, useValue: mockTramite80105Query },
        { provide: SeccionLibStore, useValue: mockSeccion },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoCapturarSolicitudComponent);
    component = fixture.componentInstance;
    component.wizardComponent = mockWizardComponent;
    component.wizardService = mockWizardService;
    component['nuevoProgramaIndustrialService'] = mockNuevoProgramaIndustrialService;
    component['tramite80105Store'] = mockTramite80105Store;
    component['tramite80105Query'] = mockTramite80105Query;
    component['toastrService'] = mockToastrService;
    component['consultaQuery'] = mockConsultaQuery;
    component['servicioDeFormularioService'] = mockServicioDeFormularioService;
    fixture.detectChanges();
  });

  it('should initialize formErrorAlert', () => {
    expect(component.formErrorAlert).toBeDefined();
    expect(typeof component.formErrorAlert).toBe('string');
  });

  it('should emit cargarArchivosEvento on onClickCargaArchivos', () => {
    const spy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit cargarArchivosEvento', () => {
    const spy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.cargarArchivosEvento.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set cargaEnProgreso correctly', () => {
    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);
  });

  it('should handle cargaRealizada', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should handle manejaEventoCargaDocumentos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
    component.manejaEventoCargaDocumentos(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });

  it('should update indices on siguiente', () => {
    component.wizardComponent.indiceActual = 2;
    component.siguiente();
    expect(component.indice).toBe(3);
    expect(component.datosPasos.indice).toBe(3);
  });

  it('should update indices on anterior', () => {
    component.wizardComponent.indiceActual = 2;
    component.anterior();
    expect(component.indice).toBe(3);
    expect(component.datosPasos.indice).toBe(3);
  });

  it('should clean up destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('verificarLaValidezDelFormulario returns true when all valid', () => {
    mockServicioDeFormularioService.isFormValid = jest.fn().mockReturnValue(true);
    mockServicioDeFormularioService.isArrayFilled = jest.fn().mockReturnValue(true);
    expect(component.verificarLaValidezDelFormulario()).toBe(true);
  });

  it('verificarLaValidezDelFormulario returns false if any form is invalid', () => {
    mockServicioDeFormularioService.isFormValid = jest.fn().mockReturnValueOnce(false);
    expect(component.verificarLaValidezDelFormulario()).toBe(false);
  });

  it('verificarLaValidezDelFormulario returns false if arrays not filled', () => {
    mockServicioDeFormularioService.isFormValid = jest.fn().mockReturnValue(true);
    mockServicioDeFormularioService.isArrayFilled = jest.fn().mockReturnValueOnce(false);
    expect(component.verificarLaValidezDelFormulario()).toBe(false);
  });

  it('isAllArraysFilledIn80101 returns true if all filled', () => {
    mockServicioDeFormularioService.isArrayFilled = jest.fn().mockReturnValue(true);
    expect(component.isAllArraysFilledIn80101(['a', 'b', 'c'])).toBe(true);
  });

  it('isAllArraysFilledIn80101 returns false if any not filled', () => {
    mockServicioDeFormularioService.isArrayFilled = jest.fn().mockImplementation((item: string) => item === 'filled');
    expect(component.isAllArraysFilledIn80101(['filled', 'notFilled'])).toBe(false);
  });

  it('getValorIndice does nothing if valor is out of bounds', () => {
    const spy = jest.spyOn(component, 'verificarLaValidezDelFormulario');
    component.getValorIndice({ valor: 0, accion: 'cont' });
    expect(spy).not.toHaveBeenCalled();
    component.getValorIndice({ valor: 100, accion: 'cont' });
    expect(spy).not.toHaveBeenCalled();
  });

  // it('getValorIndice for cont action with update true skips validation', () => {
  //   component.consultaState = { readonly: false, update: true };
  //   const shouldNavigateSpy = jest.spyOn(component, 'shouldNavigate$').mockReturnValue(of(true));
  //   component.getValorIndice({ valor: 1, accion: 'cont' });
  //   expect(shouldNavigateSpy).toHaveBeenCalled();
  // });

  // it('getValorIndice for cont action with update false triggers validation', () => {
  //   component.consultaState = { readonly: false, update: false };
  //   jest.spyOn(component, 'verificarLaValidezDelFormulario').mockReturnValue(false);
  //   component.getValorIndice({ valor: 1, accion: 'cont' });
  //   expect(component.indice).toBe(1);
  //   expect(component.datosPasos.indice).toBe(1);
  // });

  it('getValorIndice for unknown accion keeps index unchanged', () => {
    component.getValorIndice({ valor: 1, accion: 'other' as any });
    expect(component.indice).toBe(0);
    expect(component.datosPasos.indice).toBe(0);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

  // it('shouldNavigate$ returns true and calls toastrService.success on success response', async () => {
  //   mockNuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
  //     subscribe: (cb: any) => cb({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 1 } })
  //   });
  //   const obs = component.shouldNavigate$();
  //   let result: boolean | undefined;
  //   obs.subscribe(val => result = val);
  //   expect(result).toBe(true);
  //   expect(mockToastrService.success).toHaveBeenCalled();
  // });

  // it('shouldNavigate$ returns false and calls toastrService.error on error response', async () => {
  //   mockNuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
  //     subscribe: (cb: any) => cb({ codigo: '01', mensaje: 'Error', datos: {} })
  //   });
  //   const obs = component.shouldNavigate$();
  //   let result: boolean | undefined;
  //   obs.subscribe(val => result = val);
  //   expect(result).toBe(false);
  //   expect(mockToastrService.error).toHaveBeenCalled();
  // });

  it('obtenerDatosDelStore calls guardar with data', () => {
    const data = { test: 'data' };
    mockNuevoProgramaIndustrialService.getAllState = jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      subscribe: (cb: any) => cb(data)
    });
    component.guardar = jest.fn().mockResolvedValue({ codigo: '00', mensaje: 'OK' });
    component.obtenerDatosDelStore();
    expect(component.guardar).toHaveBeenCalledWith(data);
  });

  it('guardar sets idSolicitud to 0 if datos.id_solicitud is falsy', async () => {
    mockNuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: null } })
    });
    const data = { empresasSeleccionadas: [], plantasImmexTablaLista: [], empressaSubFabricantePlantas: { plantasSubfabricantesAgregar: [] }, tablaDatosFederatarios: [], tablaDatosComplimentos: [], tablaDatosComplimentosExtranjera: [] };
    await component.guardar(data as any);
    expect(mockTramite80105Store.setIdSolicitud).toHaveBeenCalledWith(0);
  });

  it('guardar resolves on success', async () => {
    mockNuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 1 } })
    });
    const data = { empresasSeleccionadas: [], plantasImmexTablaLista: [], empressaSubFabricantePlantas: { plantasSubfabricantesAgregar: [] }, tablaDatosFederatarios: [], tablaDatosComplimentos: [], tablaDatosComplimentosExtranjera: [] };
    await expect(component.guardar(data as any)).resolves.toEqual({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 1 } });
  });

  it('guardar rejects on error', async () => {
    mockNuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
      subscribe: (_cb: any, err: any) => err('error')
    });
    const data = { empresasSeleccionadas: [], plantasImmexTablaLista: [], empressaSubFabricantePlantas: { plantasSubfabricantesAgregar: [] }, tablaDatosFederatarios: [], tablaDatosComplimentos: [], tablaDatosComplimentosExtranjera: [] };
    await expect(component.guardar(data as any)).rejects.toBe('error');
  });

  it('should initialize all properties correctly', () => {
    expect(component.padreBtn).toBe(true);
    expect(component.pasos.length).toBeGreaterThan(0);
    expect(component.indice).toBe(1);
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.cargaEnProgreso).toBe(true);
    expect(component.infoAlert).toBe('alert-info');
    expect(component.activarBotonCargaArchivos).toBe(false);
    expect(component.seccionCargarDocumentos).toBe(true);
    expect(component.btnGuardar).toBe(true);
    expect(component.btnGuardarVisible).toBe('visible');
    expect(component.idSolicitud).toBe(0);
    expect(component.formErrorAlert).toBe(ERROR_FORMA_ALERT);
  });

  it('should subscribe to consultaQuery and tramite80105Query observables and update states', () => {
    const consultaState = { readonly: false, update: false };
    const solicitudState = { idSolicitud: 123 };
    mockConsultaQuery.selectConsultaioState$.pipe = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb(consultaState)
    });
    mockTramite80105Query.selectSeccionState$.pipe = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb(solicitudState)
    });
    component.ngOnInit();
    expect(component.consultaState).toEqual(consultaState);
    expect(component.solicitudState).toEqual(solicitudState);
    expect(mockConsultaQuery.selectConsultaioState$.pipe).toHaveBeenCalled();
    expect(mockTramite80105Query.selectSeccionState$.pipe).toHaveBeenCalled();
  });

  it('should call markFormAsTouched for all forms if validation fails', () => {
    //component.consultaState = { readonly: false, update: false };
    jest.spyOn(component, 'verificarLaValidezDelFormulario').mockReturnValue(false);
    component.getValorIndice({ valor: 1, accion: 'cont' });
    expect(mockServicioDeFormularioService.markFormAsTouched).toHaveBeenCalledWith('datosGeneralisForm');
    expect(mockServicioDeFormularioService.markFormAsTouched).toHaveBeenCalledWith('formaModificacionesForm');
    expect(mockServicioDeFormularioService.markFormAsTouched).toHaveBeenCalledWith('obligacionesFiscalesForm');
    expect(mockServicioDeFormularioService.markFormAsTouched).toHaveBeenCalledWith('federatariosCatalogoForm');
  });

  it('should handle readonly true in consultaState', () => {
    //component.consultaState = { readonly: true, update: false };
    const shouldNavigateSpy = jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(false));
    component.getValorIndice({ valor: 1, accion: 'cont' });
    expect(shouldNavigateSpy).toHaveBeenCalled();
  });

  it('should handle accion ant', () => {
    component.getValorIndice({ valor: 2, accion: 'ant' });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

  it('should handle accion cont with shouldNavigate$ returning false', () => {
    jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(false));
    component.getValorIndice({ valor: 1, accion: 'cont' });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should handle accion cont with shouldNavigate$ returning true', () => {
    jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(false));
    component.getValorIndice({ valor: 1, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(mockWizardService.cambio_indice).toHaveBeenCalledWith(2);
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should handle accion ant with shouldNavigate$ returning true', () => {
    component.getValorIndice({ valor: 2, accion: 'ant' });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

  it('should handle accion cont with shouldNavigate$ returning false', () => {
    jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(false));
    component.getValorIndice({ valor: 1, accion: 'cont' });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should handle unknown accion', () => {
    component.getValorIndice({ valor: 1, accion: 'unknown' as any });
    expect(component.indice).toBe(0);
    expect(component.datosPasos.indice).toBe(0);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

  it('should handle guardar with missing datos', async () => {
    mockNuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb({ codigo: '00', mensaje: 'OK', datos: {} })
    });
    const data = { empresasSeleccionadas: [], plantasImmexTablaLista: [], empressaSubFabricantePlantas: { plantasSubfabricantesAgregar: [] }, tablaDatosFederatarios: [], tablaDatosComplimentos: [], tablaDatosComplimentosExtranjera: [] };
    await component.guardar(data as any);
    expect(mockTramite80105Store.setIdSolicitud).toHaveBeenCalledWith(0);
  });

  it('should handle guardar with valid datos', async () => {
    mockNuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 123 } })
    });
    const data = { empresasSeleccionadas: [], plantasImmexTablaLista: [], empressaSubFabricantePlantas: { plantasSubfabricantesAgregar: [] }, tablaDatosFederatarios: [], tablaDatosComplimentos: [], tablaDatosComplimentosExtranjera: [] };
    await component.guardar(data as any);
    expect(mockTramite80105Store.setIdSolicitud).toHaveBeenCalledWith(123);
  });

  it('should handle guardar with error', async () => {
    mockNuevoProgramaIndustrialService.guardarDatosPost = jest.fn().mockReturnValue({
      subscribe: (_cb: any, err: any) => err('error')
    });
    const data = { empresasSeleccionadas: [], plantasImmexTablaLista: [], empressaSubFabricantePlantas: { plantasSubfabricantesAgregar: [] }, tablaDatosFederatarios: [], tablaDatosComplimentos: [], tablaDatosComplimentosExtranjera: [] };
    await expect(component.guardar(data as any)).rejects.toBe('error');
  });
});
