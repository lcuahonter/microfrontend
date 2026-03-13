import { DatosTramiteComponent } from './datos-tramite.component';
import { DatosTramiteService } from '../../services/datos-tramite.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tramite40402Service } from '../../estados/tramite40402.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite40402Query } from '../../estados/tramite40402.query';
import { Tramite40402Store } from '../../estados/tramite40402.store';
import { ChangeDetectorRef } from '@angular/core';
import { of, Subject } from 'rxjs';

describe('DatosTramiteComponent', () => {
  let component: DatosTramiteComponent;
  let datosTramiteService: jest.Mocked<DatosTramiteService>;
  let fb: FormBuilder;
  let tramite40402Service: jest.Mocked<Tramite40402Service>;
  let consultaioQuery: jest.Mocked<ConsultaioQuery>;
  let tramite40402Query: jest.Mocked<Tramite40402Query>;
  let store: jest.Mocked<Tramite40402Store>;
  let cdr: jest.Mocked<ChangeDetectorRef>;

  beforeEach(() => {
    datosTramiteService = {
      formulario: undefined as any,
    } as jest.Mocked<DatosTramiteService>;
    tramite40402Service = {
      geTideCodTransportacionAerea: jest.fn(),
      getTipoDeCaatAerea: jest.fn(),
    } as any;
    consultaioQuery = {
      selectConsultaioState$: of({ readonly: false }),
    } as any;
    tramite40402Query = {
      selectSeccionState$: of({}),
    } as any;
    store = {
      setCodIataIcao: jest.fn(),
      setOtherField: jest.fn(),
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn(),
      setSeguroNumero: jest.fn(),
      setNombrePFE: jest.fn(),
      destroy: jest.fn(),
    } as unknown as jest.Mocked<Tramite40402Store>;
    cdr = {
      detectChanges: jest.fn(),
    } as any;
    fb = new FormBuilder();

    const formInstance = fb.group({
      tipoDeCaatAerea: ['A', [Validators.required]],
      ideCodTransportacionAerea: ['B', [Validators.required]],
      codIataIcao: ['C', [Validators.required]],
      solicitud: fb.group({
        caatSolicitudes: fb.array([fb.control('dummy', Validators.required)])
      })
    });
    Object.defineProperty(datosTramiteService, 'formulario', {
      get: () => formInstance,
      configurable: true
    });

    component = new DatosTramiteComponent(
      datosTramiteService,
      fb,
      tramite40402Service,
      consultaioQuery,
      tramite40402Query,
      store,
      cdr
    );
  });

  it('debe ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('marcarTodoComoTocado debería marcar todos los controles como tocados', () => {
  const formulario = component.formulario;
  formulario.get('tipoDeCaatAerea')!.setValue('A');
  formulario.get('ideCodTransportacionAerea')!.setValue('B');
  formulario.get('codIataIcao')!.setValue('C');
  const tipoSpy = jest.spyOn(formulario.get('tipoDeCaatAerea')!, 'markAsTouched');
  const ideSpy = jest.spyOn(formulario.get('ideCodTransportacionAerea')!, 'markAsTouched');
  const codSpy = jest.spyOn(formulario.get('codIataIcao')!, 'markAsTouched');
  component.marcarTodoComoTocado();
  expect(tipoSpy).toHaveBeenCalled();
  expect(ideSpy).toHaveBeenCalled();
  expect(codSpy).toHaveBeenCalled();
  });

  it('validarFormularios debe devolver falso si el formulario no es válido', () => {
    const formulario = component.formulario;
    formulario.get('tipoDeCaatAerea')!.setValue('');
    formulario.get('ideCodTransportacionAerea')!.setValue('');
    formulario.get('codIataIcao')!.setValue('');
    expect(component.validarFormularios()).toBe(false);
  });

  it('validarFormularios debería devolver verdadero si el formulario es válido', () => {
    const formulario = component.formulario;
    formulario.get('tipoDeCaatAerea')!.setValue('A');
    formulario.get('ideCodTransportacionAerea')!.setValue('B');
    formulario.get('codIataIcao')!.setValue('C');
    const solicitudGroup = formulario.get('solicitud') as FormGroup;
    if (solicitudGroup && solicitudGroup.get('caatSolicitudes')) {
      const caatSolicitudesArray = fb.array([fb.control('dummy', Validators.required)]);
      solicitudGroup.setControl('caatSolicitudes', caatSolicitudesArray);
      caatSolicitudesArray.at(0).setValue('dummy');
    }
    formulario.markAllAsTouched();
    expect(component.validarFormularios()).toBe(true);
  });

  it('hayCamposLlenos debería devolver falso si todos los campos están vacíos', () => {
    datosTramiteService.formulario.get('tipoDeCaatAerea')!.setValue('');
    datosTramiteService.formulario.get('ideCodTransportacionAerea')!.setValue('');
    datosTramiteService.formulario.get('codIataIcao')!.setValue('');
    expect(component.hayCamposLlenos()).toBe(false);
  });

  it('hayCamposLlenos debería devolver verdadero si algún campo está lleno', () => {
    const formulario = component.formulario;
    formulario.get('tipoDeCaatAerea')!.setValue('A');
    expect(component.hayCamposLlenos()).toBe(true);
  });

  it('limpiarFormulario debería reiniciar el formulario y marcar codIataIcao como tocado', () => {
  const formulario = component.formulario;
  const spyReset = jest.spyOn(formulario, 'reset');
  const codIataIcaoControl = formulario.get('codIataIcao');
  const spyMark = jest.spyOn(codIataIcaoControl!, 'markAsTouched');
  component.limpiarFormulario();
  expect(spyReset).toHaveBeenCalled();
  expect(spyMark).toHaveBeenCalled();
  });

  it('markFormGroupTouched debe marcar todos los controles como tocados', () => {
    const formGroup = fb.group({
      field1: [''],
      field2: ['']
    });
    const spy1 = jest.spyOn(formGroup.get('field1')!, 'markAsTouched');
    const spy2 = jest.spyOn(formGroup.get('field2')!, 'markAsTouched');
    component.markFormGroupTouched(formGroup);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('markFormGroupTouched debería marcar controles anidados como tocados', () => {
    const nestedGroup = fb.group({
      nested: fb.group({
        inner: ['']
      })
    });
    const spy = jest.spyOn(nestedGroup.get('nested.inner')!, 'markAsTouched');
    component.markFormGroupTouched(nestedGroup);
    expect(spy).toHaveBeenCalled();
  });

  it('setValoresStore debe escribir codIataIcao en mayúsculas y llamar al método de almacenamiento', () => {
    const form = fb.group({ codIataIcao: ['abc'] });
    component.setValoresStore(form, 'codIataIcao', 'setCodIataIcao');
    expect(form.get('codIataIcao')!.value).toBe('ABC');
    expect(store.setCodIataIcao).toHaveBeenCalledWith('ABC');
    expect(store.setCodIataIcao).toHaveBeenCalledWith('ABC');
  });

  it('setValoresStore debería llamar al método de tienda con valor para otros campos', () => {
    const form = fb.group({ codIataIcao: ['value'] });
    component.setValoresStore(form, 'codIataIcao', 'setCodIataIcao');
    expect(store.setCodIataIcao).toHaveBeenCalledWith('VALUE');
  });

  it('inicializarEstadoFormulario debería deshabilitar el formulario si soloLectura es verdadero', () => {
  component.soloLectura = true;
  const spy = jest.spyOn(component.formulario, 'disable');
  component.inicializarEstadoFormulario();
  expect(spy).toHaveBeenCalled();
  });

  it('inicializarEstadoFormulario debería habilitar el formulario si soloLectura es falso', () => {
  component.soloLectura = false;
  const spy = jest.spyOn(component.formulario, 'enable');
  component.inicializarEstadoFormulario();
  expect(spy).toHaveBeenCalled();
  });

  it('mostrarErrores debería llamar a detectChanges', () => {
    component.mostrarErrores();
    expect(cdr.detectChanges).toHaveBeenCalled();
  });

  it('ngOnDestroy debería completar destroyNotifier$', () => {
    const destroyNotifier$ = (component as any).destroyNotifier$ as Subject<void>;
    const spyNext = jest.spyOn(destroyNotifier$, 'next');
    const spyComplete = jest.spyOn(destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('cargarCodigoTransportacion debería establecer codigoTransportacion', () => {
    const mockCatalogos = [
      { id: 1, descripcion: 'Descripcion A' },
      { id: 2, descripcion: 'Descripcion B' }
    ];
    tramite40402Service.geTideCodTransportacionAerea.mockReturnValue(of(mockCatalogos));
    component.cargarCodigoTransportacion();
    setTimeout(() => {
      expect(component.codigoTransportacion).toEqual(mockCatalogos);
    }, 0);
  });

  it('cargarTipoCaatAereo debería establecer tipoCaatAereo', () => {
    const mockCatalogos = [
      { id: 1, descripcion: 'Tipo X' },
      { id: 2, descripcion: 'Tipo Y' }
    ];
    tramite40402Service.getTipoDeCaatAerea.mockReturnValue(of(mockCatalogos));
    component.cargarTipoCaatAereo();
    setTimeout(() => {
      expect(component.tipoCaatAereo).toEqual(mockCatalogos);
    }, 0);
  });

  it('tipoDeCaatAereaData debería establecer tipoDeCaatAerea', () => {
    const mockCatalogos = [
      { id: 1, descripcion: 'Tipo 1' }
    ];
    tramite40402Service.getTipoDeCaatAerea.mockReturnValue(of(mockCatalogos));
    component.tipoDeCaatAereaData();
    setTimeout(() => {
      expect(component.tipoDeCaatAerea).toEqual(mockCatalogos);
    }, 0);
  });

  it('ideCodTransportacionAereaData debería establecer ideCodTransportacionAerea', () => {
    const mockCatalogos = [
      { id: 2, descripcion: 'Descripcion 2' }
    ];
    tramite40402Service.geTideCodTransportacionAerea.mockReturnValue(of(mockCatalogos));
    component.ideCodTransportacionAereaData();
    setTimeout(() => {
      expect(component.ideCodTransportacionAerea).toEqual(mockCatalogos);
    }, 0);
  });

  it('debería obtener caatSolicitudes como FormArray', () => {
    expect(component.caatSolicitudes).toBeInstanceOf(FormArray);
    expect(component.caatSolicitudes.controls).toBeDefined();
  });

  it('debería inicializar formulario en ngOnInit', () => {
    const spy = jest.spyOn(component as any, 'inicializarFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('debería inicializar estado formulario en consultaioQuery', () => {
    const spy = jest.spyOn(component as any, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('no debería lanzar si el formulario es indefinido en marcarTodoComoTocado', () => {
    jest.spyOn(datosTramiteService, 'formulario', 'get').mockReturnValue(undefined as any);
    expect(() => component.marcarTodoComoTocado()).not.toThrow();
  });

  it('no debería lanzar si el formulario es indefinido en validarFormularios', () => {
    jest.spyOn(datosTramiteService, 'formulario', 'get').mockReturnValue(undefined as any);
    expect(component.validarFormularios()).toBe(false);
  });

  it('no debería lanzar si el formulario es indefinido en hayCamposLlenos', () => {
    jest.spyOn(datosTramiteService, 'formulario', 'get').mockReturnValue(undefined as any);
    expect(component.hayCamposLlenos()).toBe(false);
  });
});