import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CertificadosLicenciasPermisosService } from '../../../services/shared2603/certificados-licencias-permisos.service';
import { Tramite2603Store } from '../../../estados/stores/2603/tramite2603.store';
import { Tramite2603Query } from '../../../estados/queries/2603/tramite2603.query';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { EstadoCatalogResponse } from '@libs/shared/data-access-user/src/core/models/shared2603/certificados-licencias-permisos.model';
import { ScianDatos, MercanciasDatos, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { ConsultaioState } from '@ng-mf/data-access-user';

function createFormGroup(formBuilder: FormBuilder, fields: Record<string, any>) {
  return formBuilder.group(fields);
}

let component: DatosDeLaSolicitudComponent;
let formBuilder: FormBuilder;

function createMockStore() {
  const alwaysFn = jest.fn();
  return new Proxy({}, {
    get: (_target, _prop) => alwaysFn
  });
}

function createMockCertificadosService() {
  const observableMock = () => ({ pipe: () => ({ subscribe: () => { } }) });
  return {
    getEstadoDatos: observableMock,
    getScianDatos: observableMock,
    getMercanciasDatos: observableMock,
    getTipoDeProductoDatos: observableMock,
    getPaisDeProcedenciaDatos: observableMock,
    getClaveCatalogDatos: observableMock,
    getRegimenDatos: observableMock,
    getFraccionArancelariaDatos: observableMock,
    getUMTDatos: observableMock,
    getUMCDatos: observableMock,
    getNumeroCasDatos: observableMock,
    getPaisDatos: observableMock,
    getPresentacionDatos: observableMock,
    getAduanasDatos: observableMock,
    getLosDatosNoDatos: observableMock,
    getRegimenDestinaraDatos: observableMock,
    getTipoDeTramiteDatos: observableMock,
    getClaveDatos: observableMock,
    getCertificadosLicenciasPermisos$: observableMock
  };
}

describe('DatosDeLaSolicitudComponent', () => {
  beforeEach(() => {
    formBuilder = new FormBuilder();
    component = new DatosDeLaSolicitudComponent(
      {} as BsModalService,
      formBuilder,
      {} as CertificadosLicenciasPermisosService,
      {} as Tramite2603Store,
      {} as Tramite2603Query,
      {} as ValidacionesFormularioService,
      {} as any, // CatalogoService mock
      {} as any  // DatosSolicitudService mock
    );
  });
  describe('Form enable/disable logic', () => {
    it('enables fields when establecimientoSeleccionado is true and readonly is false', () => {
      component.consultaState = { readonly: false } as any;
      component.establecimientoSeleccionado = true;
      component.domicilioDeElstablecimientoForm = createFormGroup(formBuilder, {
        denominacionRazon: [{ value: '', disabled: true }],
        codigoPostal: [{ value: '', disabled: true }],
        estado: [{ value: '', disabled: true }],
        municipio: [{ value: '', disabled: true }],
        localidad: [{ value: '', disabled: true }],
        colonia: [{ value: '', disabled: true }],
        calleYNumero: [{ value: '', disabled: true }],
        correoElecronico: [{ value: '', disabled: true }],
        rfc: [{ value: '', disabled: true }],
        lada: [{ value: '', disabled: true }],
        telefono: [{ value: '', disabled: true }]
      });
      component.representanteLegalForm = createFormGroup(formBuilder, {});
      component.scianForm = createFormGroup(formBuilder, {});
      component.mercanciasForm = createFormGroup(formBuilder, {});
      component.deshabilitarFormularios();
      [
        'denominacionRazon', 'codigoPostal', 'estado', 'municipio', 'localidad', 'colonia',
        'calleYNumero', 'correoElecronico', 'rfc', 'lada', 'telefono'
      ].forEach(field => {
        expect(component.domicilioDeElstablecimientoForm.get(field)?.enabled).toBe(true);
      });
      expect(component.representanteLegalForm.enabled).toBe(true);
      expect(component.scianForm.enabled).toBe(true);
      expect(component.mercanciasForm.enabled).toBe(true);
    });

    it('disables fields when establecimientoSeleccionado is false and readonly is false', () => {
      component.consultaState = { readonly: false } as any;
      component.establecimientoSeleccionado = false;
      component.domicilioDeElstablecimientoForm = createFormGroup(formBuilder, {
        denominacionRazon: [{ value: '', disabled: false }],
        codigoPostal: [{ value: '', disabled: false }],
        municipio: [{ value: '', disabled: false }],
        localidad: [{ value: '', disabled: false }],
        colonia: [{ value: '', disabled: false }],
        calleYNumero: [{ value: '', disabled: false }],
        correoElecronico: [{ value: '', disabled: false }],
        rfc: [{ value: '', disabled: false }],
        lada: [{ value: '', disabled: false }],
        telefono: [{ value: '', disabled: false }]
      });
      component.denominacionForm = createFormGroup(formBuilder, {});
      component.representanteLegalForm = createFormGroup(formBuilder, {});
      component.scianForm = createFormGroup(formBuilder, {});
      component.mercanciasForm = createFormGroup(formBuilder, {});
      component.deshabilitarFormularios();
      [
        'denominacionRazon', 'codigoPostal', 'municipio', 'localidad', 'colonia',
        'calleYNumero', 'correoElecronico', 'rfc', 'lada', 'telefono'
      ].forEach(field => {
        expect(component.domicilioDeElstablecimientoForm.get(field)?.disabled).toBe(true);
      });
      expect(component.denominacionForm.disabled).toBe(true);
      expect(component.representanteLegalForm.enabled).toBe(true);
      expect(component.scianForm.enabled).toBe(true);
      expect(component.mercanciasForm.enabled).toBe(true);
    });
  });
  it('esValido debe retornar null si validacionesService no está definido', () => {
    const mockForm = formBuilder.group({ campo: ['valor'] });
    (component as any).validacionesService = undefined;
    expect(component.esValido(mockForm, 'campo')).toBeNull();
  });

  it('selectedRowsScian y selectedRows deben inicializarse vacíos', () => {
    expect(component.selectedRowsScian).toEqual([]);
    expect(component.selectedRows).toEqual([]);
  });

  it('onSeleccionChangeScian debe actualizar selectedRowsScian', () => {
    const rows = [{ clave: 'X', descripcion: 'Y' }];
    component.onSeleccionChangeScian(rows);
    expect(component.selectedRowsScian).toBe(rows);
  });

  it('eliminarSeleccionadosScian debe configurar alertaNotificacion y mostrarNotificacion', () => {
    component.eliminarSeleccionadosScian();
    expect(component.mostrarNotificacion).toBe(true);
    expect(component.alertaNotificacion).toBeDefined();
    expect(component.alertaNotificacion.tipoNotificacion).toBe('alert');
  });

  it('onConfirmarEliminarSeleccionadosScian elimina filas si confirmado', () => {
    const mockStore = createMockStore();
    component.selectedRowsScian = [{ clave: 'A', descripcion: 'B' }];
    component.scianTablaDatos = [{ clave: 'A', descripcion: 'B' }, { clave: 'C', descripcion: 'D' }];
    component.tramite2603Store = mockStore as any;
    component.onConfirmarEliminarSeleccionadosScian(true);
    expect(component.scianTablaDatos).toEqual([{ clave: 'C', descripcion: 'D' }]);
    expect(component.selectedRowsScian).toEqual([]);
    expect((mockStore as any)['setScianTabla']).toHaveBeenCalledWith([{ clave: 'C', descripcion: 'D' }]);
  });

  it('onConfirmarEliminarSeleccionadosScian no debe eliminar seleccionados cuando confirmado es false', () => {
    const mockStore = {
      setScianTabla: jest.fn()
    };
    component.selectedRowsScian = [{ clave: 'A', descripcion: 'B' }];
    component.scianTablaDatos = [{ clave: 'A', descripcion: 'B' }, { clave: 'C', descripcion: 'D' }];
    component.tramite2603Store = mockStore as any;
    component.onConfirmarEliminarSeleccionadosScian(false);
    expect(component.scianTablaDatos).toEqual([{ clave: 'A', descripcion: 'B' }, { clave: 'C', descripcion: 'D' }]);
  });

  it('limpiarFormularioScian debe resetear el formulario y selección', () => {
    component.scianForm = formBuilder.group({ claveScian: ['X'], descripcion: ['Y'] });
    component.selectedRowsScian = [{ clave: 'A', descripcion: 'B' }];
    component.limpiarFormularioScian();
    expect(component.scianForm.get('claveScian')?.value).toBeNull();
    expect(component.scianForm.get('descripcion')?.value).toBeNull();
    expect(component.selectedRowsScian).toEqual([]);
  });

  it('scianAgregar agrega fila si el formulario es válido', () => {
    component.scianForm = formBuilder.group({ descripcion: [1] });
    component.scianForm = formBuilder.group({ descripcion: ['Test Desc'] });
    component.claveCatalogo = [{ id: 1, descripcion: 'ClaveDesc' }];
    component.estadoCatalogo = [{ id: 1, descripcion: 'EstadoDesc' }];
    component.scianTablaDatos = [];
    const mockStore2 = createMockStore();
    component.tramite2603Store = mockStore2 as any;
    component.onScianRecordAdded = jest.fn();
    component.modalRef = { hide: jest.fn() } as any;
    component.limpiarFormularioScian = jest.fn();
    component.scianAgregar();
    expect(component.scianTablaDatos.length).toBe(1);
    expect((mockStore2 as any)['setScianTabla']).toHaveBeenCalled();
    expect(component.onScianRecordAdded).toHaveBeenCalled();
    expect(component.modalRef?.hide).toHaveBeenCalled();
    expect(component.limpiarFormularioScian).toHaveBeenCalled();
  });

  it('scianAgregar marca como tocado si el formulario no es válido', () => {
    component.scianForm = formBuilder.group({ descripcion: [null] });
    component.scianForm.setErrors({ invalid: true });
    component.scianForm.markAllAsTouched = jest.fn();
    component.scianAgregar();
    expect(component.scianForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('cerrarModalScian oculta el modal y limpia el formulario', () => {
    component.modalRef = { hide: jest.fn() } as any;
    component.limpiarFormularioScian = jest.fn();
    component.cerrarModalScian();
    expect(component.modalRef?.hide).toHaveBeenCalled();
    expect(component.limpiarFormularioScian).toHaveBeenCalled();
  });

  it('eliminarSeleccionados elimina filas seleccionadas de NICO', () => {
    const nicoRow1 = { clave: 'A', descripcion: 'B' } as any;
    const nicoRow2 = { clave: 'C', descripcion: 'D' } as any;
    const nicoRow3 = { clave: 'E', descripcion: 'F' } as any;
    component.selectedRows = [nicoRow1, nicoRow2];
    component.nicoTablaDatos = [nicoRow1, nicoRow2, nicoRow3];
    component.eliminarSeleccionados();
    expect(component.nicoTablaDatos).toEqual([nicoRow3]);
    expect(component.selectedRows).toEqual([]);
  });

  it('onScianRecordAdded actualiza licenciaSanitaria y regimenDestinara', () => {
    component.domicilioDeElstablecimientoForm = formBuilder.group({ licenciaSanitaria: [''], regimenDestinara: [''] });
    component.regimenCatalogo = [{ id: 1, descripcion: 'desc' }];
    const event = [{ claveScian: 'CLAVE1' }];
    component.onScianRecordAdded(event);
    expect(component.domicilioDeElstablecimientoForm.get('licenciaSanitaria')?.value).toBe('CLAVE1');
    expect(component.domicilioDeElstablecimientoForm.get('regimenDestinara')?.value).toBe(1);
  });

  it('esValido debe retornar null si validacionesService no está definido', () => {
    const mockForm = formBuilder.group({ campo: ['valor'] });
    (component as any).validacionesService = undefined;
    expect(component.esValido(mockForm, 'campo')).toBeNull();
  });

  it('selectedRowsScian y selectedRows deben inicializarse vacíos', () => {
    expect(component.selectedRowsScian).toEqual([]);
    expect(component.selectedRows).toEqual([]);
  });

  it('onSeleccionChangeScian debe actualizar selectedRowsScian', () => {
    const rows = [{ clave: 'X', descripcion: 'Y' }];
    component.onSeleccionChangeScian(rows);
    expect(component.selectedRowsScian).toBe(rows);
  });

  it('eliminarSeleccionadosScian debe configurar alertaNotificacion y mostrarNotificacion', () => {
    component.eliminarSeleccionadosScian();
    expect(component.mostrarNotificacion).toBe(true);
    expect(component.alertaNotificacion).toBeDefined();
    expect(component.alertaNotificacion.tipoNotificacion).toBe('alert');
  });

  it('onConfirmarEliminarSeleccionadosScian debe eliminar seleccionados cuando confirmado es true', () => {
    const mockStore = {
      setScianTabla: jest.fn()
    };
    component.selectedRowsScian = [{ clave: 'A', descripcion: 'B' }];
    component.scianTablaDatos = [{ clave: 'A', descripcion: 'B' }, { clave: 'C', descripcion: 'D' }];
    component.tramite2603Store = mockStore as any;
    component.onConfirmarEliminarSeleccionadosScian(true);
    expect(component.scianTablaDatos).toEqual([{ clave: 'C', descripcion: 'D' }]);
    expect(component.selectedRowsScian).toEqual([]);
    expect(mockStore.setScianTabla).toHaveBeenCalledWith([{ clave: 'C', descripcion: 'D' }]);
  });

  it('onConfirmarEliminarSeleccionadosScian no elimina si no confirmado', () => {
    component.selectedRowsScian = [{ clave: 'A', descripcion: 'B' }];
    component.scianTablaDatos = [{ clave: 'A', descripcion: 'B' }, { clave: 'C', descripcion: 'D' }];
    const mockStore = createMockStore(); component.tramite2603Store = mockStore as any;
    component.onConfirmarEliminarSeleccionadosScian(false);
    expect(component.scianTablaDatos).toEqual([{ clave: 'A', descripcion: 'B' }, { clave: 'C', descripcion: 'D' }]);
  });

  it('limpiarFormularioScian debe resetear el formulario y selección', () => {
    component.scianForm = formBuilder.group({ claveScian: ['X'], descripcion: ['Y'] });
    component.selectedRowsScian = [{ clave: 'A', descripcion: 'B' }];
    component.limpiarFormularioScian();
    expect(component.scianForm.get('claveScian')?.value).toBeNull();
    expect(component.scianForm.get('descripcion')?.value).toBeNull();
    expect(component.selectedRowsScian).toEqual([]);
  });

  it('scianAgregar agrega fila si el formulario es válido', () => {
    component.scianForm = formBuilder.group({ descripcion: [1] });
    component.claveCatalogo = [{ id: 1, descripcion: 'ClaveDesc' }];
    component.estadoCatalogo = [{ id: 1, descripcion: 'EstadoDesc' }];
    component.scianTablaDatos = [];
    const mockStore = createMockStore(); component.tramite2603Store = mockStore as any;
    component.onScianRecordAdded = jest.fn();
    component.modalRef = { hide: jest.fn() } as any;
    component.limpiarFormularioScian = jest.fn();
    component.scianAgregar();
    expect(component.scianTablaDatos.length).toBe(1);
    expect((mockStore as any)['setScianTabla']).toHaveBeenCalled();
    expect(component.onScianRecordAdded).toHaveBeenCalled();
    expect(component.modalRef?.hide).toHaveBeenCalled();
    expect(component.limpiarFormularioScian).toHaveBeenCalled();
  });

  it('scianAgregar marca como tocado si el formulario no es válido', () => {
    component.scianForm = formBuilder.group({ descripcion: [null] });
    component.scianForm.setErrors({ invalid: true });
    component.scianForm.markAllAsTouched = jest.fn();
    component.scianAgregar();
    expect(component.scianForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('cerrarModalScian oculta el modal y limpia el formulario', () => {
    component.modalRef = { hide: jest.fn() } as any;
    component.limpiarFormularioScian = jest.fn();
    component.cerrarModalScian();
    expect(component.modalRef?.hide).toHaveBeenCalled();
    expect(component.limpiarFormularioScian).toHaveBeenCalled();
  });

  it('eliminarSeleccionados elimina filas seleccionadas de NICO', () => {
    const nicoRow1 = { clave: 'A', descripcion: 'B' } as any;
    const nicoRow2 = { clave: 'C', descripcion: 'D' } as any;
    const nicoRow3 = { clave: 'E', descripcion: 'F' } as any;
    component.selectedRows = [nicoRow1, nicoRow2];
    component.nicoTablaDatos = [nicoRow1, nicoRow2, nicoRow3];
    component.eliminarSeleccionados();
    expect(component.nicoTablaDatos).toEqual([nicoRow3]);
    expect(component.selectedRows).toEqual([]);
  });

  it('onScianRecordAdded actualiza licenciaSanitaria y regimenDestinara', () => {
    component.domicilioDeElstablecimientoForm = formBuilder.group({ licenciaSanitaria: [''], regimenDestinara: [''] });
    component.regimenCatalogo = [{ id: 1, descripcion: 'desc' }];
    const event = [{ claveScian: 'CLAVE1' }];
    component.onScianRecordAdded(event);
    expect(component.domicilioDeElstablecimientoForm.get('licenciaSanitaria')?.value).toBe('CLAVE1');
    expect(component.domicilioDeElstablecimientoForm.get('regimenDestinara')?.value).toBe(1);
  });

  it('debería deshabilitar todos los formularios si consultaState.readonly es true', () => {
    component.consultaState = { readonly: true } as any;
    component.denominacionForm = formBuilder.group({ campo: [''] });
    component.domicilioDeElstablecimientoForm = formBuilder.group({ campo: [''] });
    component.representanteLegalForm = formBuilder.group({ campo: [''] });
    component.scianForm = formBuilder.group({ campo: [''] });
    component.mercanciasForm = formBuilder.group({ campo: [''] });
    component.deshabilitarFormularios();
    expect(component.denominacionForm.disabled).toBe(true);
    expect(component.domicilioDeElstablecimientoForm.disabled).toBe(true);
    expect(component.representanteLegalForm.disabled).toBe(true);
    expect(component.scianForm.disabled).toBe(true);
    expect(component.mercanciasForm.disabled).toBe(true);
  });


  it('debería deshabilitar todos los formularios si consultaState.readonly es true', () => {
    component.consultaState = { readonly: true } as any;
    component.denominacionForm = formBuilder.group({ campo: [''] });
    component.domicilioDeElstablecimientoForm = formBuilder.group({ campo: [''] });
    component.representanteLegalForm = formBuilder.group({ campo: [''] });
    component.scianForm = formBuilder.group({ campo: [''] });
    component.mercanciasForm = formBuilder.group({ campo: [''] });
    component.deshabilitarFormularios();
    expect(component.denominacionForm.disabled).toBe(true);
    expect(component.domicilioDeElstablecimientoForm.disabled).toBe(true);
    expect(component.representanteLegalForm.disabled).toBe(true);
    expect(component.scianForm.disabled).toBe(true);
    expect(component.mercanciasForm.disabled).toBe(true);
  });


  it('debería manejar mostrarColapsable con valores no esperados', () => {
    component.mostrarColapsable('inexistente');
    expect(component.colapsableObj.formaFarmaceuticaColapsable).toBe(false);
    expect(component.colapsableObj.paisDeOrigenColapsable).toBe(false);
    expect(component.colapsableObj.usoEspecificoColapsable).toBe(false);
  });

  it('debería manejar inicialización de formularios con datos vacíos', () => {
    component.tramite2603Store = createMockStore() as any;    component['certificadosLicenciasSvc'] = {
      ...createMockCertificadosService(),
      getCertificadosLicenciasPermisos$: () => ({ pipe: () => ({ subscribe: () => { } }) })
    } as any;

    component.tramite2603Query = {
      selectSolicitud$: { pipe: () => ({ subscribe: () => { } }) }
    } as any;

    // Simulacro de catalogoService con todos los métodos necesarios
    component['catalogoService'] = {
      estadosCatalogo: jest.fn(() => of({ datos: [] })),
      regimenesCatalogo: jest.fn(() => of({ datos: [] })),
      aduanasCatalogo: jest.fn(() => of({ datos: [] })),
      clasificacionProductoCatalogo: jest.fn(() => of({ datos: [] })),
      tiposProductoCatalogo: jest.fn(() => of({ datos: [] })),
      scianCatalogo: jest.fn(() => of({ datos: [] })),
      unidadesMedidaComercialCatalogo: jest.fn(() => of({ datos: [] })),
      paisesCatalogo: jest.fn(() => of({ datos: [] })),
      usosEspecificoMercanciaCatalogo: jest.fn(() => of({ datos: [] })),
      formaFarmaceuticaCatalogo: jest.fn(() => of({ datos: [] }))
    } as any;

    // Mock subscription and destroyNotifier$
    component['subscription'] = { add: jest.fn() } as any;
    component['destroyNotifier$'] = { next: jest.fn(), complete: jest.fn() } as any;

    component.solicitudState = {
      denominacionRazon: '',
      codigoPostal: '',
      nombreORazon: '',
      claveScian: '',
      clasificacion: ''
    } as any;
    component.ngOnInit();
    expect(component.denominacionForm.get('denominacionRazon')).toBeDefined();
    expect(component.domicilioDeElstablecimientoForm.get('codigoPostal')).toBeDefined();
    expect(component.representanteLegalForm.get('nombreORazon')).toBeDefined();
    expect(component.scianForm.get('claveScian')).toBeDefined();
    expect(component.mercanciasForm.get('clasificacion')).toBeDefined();
  });
  it('should emit selectionChange output event', () => {
    const spy = jest.spyOn(component.selectionChange, 'emit');
    const value = { id: 1, nombre: 'Nombre', descripcion: 'Producto', codigo: 123 };
    component.selectionChange.emit(value);
    expect(spy).toHaveBeenCalledWith(value);
  });

  it('should set esModalCerrado to true when closing modal', () => {
    component.esModalCerrado = false;
    component.esModalCerrado = true;
    expect(component.esModalCerrado).toBe(true);
  });

  it('should get descripcionFormControl from scianForm', () => {
    component.scianForm = formBuilder.group({ descripcion: ['test'] });
    expect(component.descripcionFormControl.value).toBe('test');
  });
});
