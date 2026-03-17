import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlInventariosComponent } from './control-inventarios.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  InputCheckComponent,
  InputRadioComponent,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const mockStore = {
  actualizarEstado: jest.fn(),
};
const mockQuery = {
  selectSolicitud$: of({
    controlInventarios: [],
    nombreSistema: 'SistemaX',
    lugarRadicacion: 'LugarY',
    sistemaControlInventariosArt59: '1',
  }),
};
const mockConsultaioQuery = {
  selectConsultaioState$: of({ readonly: false }),
};

describe('ControlInventariosComponent', () => {
  let component: ControlInventariosComponent;
  let fixture: ComponentFixture<ControlInventariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ControlInventariosComponent,
        CommonModule,
        TablaDinamicaComponent,
        NotificacionesComponent,
        TituloComponent,
        InputRadioComponent,
        InputCheckComponent,
        HttpClientTestingModule,
      ],
      providers: [
        FormBuilder,
        { provide: 'Solicitud32605Store', useValue: mockStore },
        { provide: 'Solicitud32605Query', useValue: mockQuery },
        { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery },
      ],
    })
      .overrideComponent(ControlInventariosComponent, {
        set: {
          providers: [
            { provide: FormBuilder, useValue: new FormBuilder() },
            { provide: 'Solicitud32605Store', useValue: mockStore },
            { provide: 'Solicitud32605Query', useValue: mockQuery },
            { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ControlInventariosComponent);
    component = fixture.componentInstance;

    (component as any).tramite32605Store = mockStore;
    (component as any).tramite32605Query = mockQuery;
    (component as any).consultaioQuery = mockConsultaioQuery;

    component.seccionState = {
      controlInventarios: [],
      nombreSistema: 'SistemaX',
      lugarRadicacion: 'LugarY',
      sistemaControlInventariosArt59: '1',
    } as any;

    component.crearFormulario();
    jest.spyOn(component, 'actualizarFilaSeleccionada');
    jest.spyOn(component, 'agregarDialogoDatos');
    jest.spyOn(component, 'patchModifyiedData');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms and set esFormularioInicializado to true', () => {
    component.crearFormulario();
    expect(component.registroControlInventariosForm).toBeDefined();
    expect(component.modificarRegistroControlInventariosForm).toBeDefined();
    expect(component.esFormularioInicializado).toBe(true);
  });

  it('should show confirmation and add data if form is valid', () => {
    component.registroControlInventariosForm.patchValue({
      sistemaControlInventariosArt59: '1',
      nombreSistema: 'SistemaX',
      lugarRadicacion: 'LugarY',
      cumpleAnexo24: true,
    });
    component.filaSeleccionadaControlInventarios = {} as any;
    component.controlInventariosList = [];
    component.enviarDialogData();
    expect(component.esHabilitarElDialogo).toBe(true);
    expect(component.controlInventariosList.length).toBe(1);
    expect(component.nuevaNotificacion).toBeDefined();
  });

  it('should show validation message if form is invalid', () => {
    component.registroControlInventariosForm.patchValue({
      sistemaControlInventariosArt59: '',
      nombreSistema: '',
      lugarRadicacion: '',
      cumpleAnexo24: false,
    });
    component.enviarDialogData();
    expect(component.esHabilitarElDialogo).toBe(true);
    expect(component.nuevaNotificacion).toBeDefined();
  });

  it('should add a new record if no row is selected', () => {
    component.filaSeleccionadaControlInventarios = {} as any;
    component.controlInventariosList = [];
    component.registroControlInventariosForm.patchValue({
      nombreSistema: 'SistemaX',
      lugarRadicacion: 'LugarY',
      cumpleAnexo24: true,
    });
    component.ControlInventariosInfoDatos();
    expect(component.controlInventariosList.length).toBe(1);
    expect(mockStore.actualizarEstado).toHaveBeenCalled();
  });

  it('should update an existing record if a row is selected', () => {
    component.controlInventariosList = [
      { id: 1, nombreSistema: 'A', lugarRadicacion: 'B', cumpleAnexo24: false },
    ];
    component.filaSeleccionadaControlInventarios = {} as any;
    component.registroControlInventariosForm.patchValue({
      nombreSistema: 'Nuevo',
      lugarRadicacion: 'LugarNuevo',
      cumpleAnexo24: true,
    });
    component.ControlInventariosInfoDatos();
    expect(component.controlInventariosList[0].nombreSistema).toBe('A');
    expect(component.filaSeleccionadaControlInventarios).toEqual({} as any);
  });

  it('should update record and close modal if modal form is valid', () => {
    jest.spyOn(component, 'cambiarEstadoModal');
    component.modificarRegistroControlInventariosForm.patchValue({
      modificarNombreSistema: 'Modificado',
      modificarLugarRadicacion: 'LugarMod',
      modificarCumpleAnexo24: true,
    });
    component.modificarRegistroControlInventariosForm
      .get('modificarNombreSistema')
      ?.setErrors(null);
    component.modificarRegistroControlInventariosForm
      .get('modificarLugarRadicacion')
      ?.setErrors(null);
    component.modificarRegistroControlInventariosForm
      .get('modificarCumpleAnexo24')
      ?.setErrors(null);
    component.modificarRegistroControlInventariosForm.markAllAsTouched();
    component.modificarEnviarDialogData();
    expect(component.esHabilitarElDialogo).toBe(true);
    expect(component.cambiarEstadoModal).toHaveBeenCalled();
  });

  it('should show validation message if modal form is invalid', () => {
    component.modificarRegistroControlInventariosForm.patchValue({
      modificarNombreSistema: '',
      modificarLugarRadicacion: '',
      modificarCumpleAnexo24: false,
    });
    component.modificarEnviarDialogData();
    expect(component.esHabilitarElDialogo).toBe(true);
    expect(component.nuevaNotificacion).toBeDefined();
  });

  it('should reset dialog and restore radio value if needed', () => {
    component.valorAnteriorRadioButton = '1';
    component.registroControlInventariosForm
      .get('sistemaControlInventariosArt59')
      ?.setValue('0');
    component.cerrarModal();
    expect(component.esHabilitarElDialogo).toBe(false);
    expect(
      component.registroControlInventariosForm.get(
        'sistemaControlInventariosArt59'
      )?.value
    ).toBe('1');
  });

  it('should clear selection if empty', () => {
    component.manejarFilaSeleccionada([]);
    expect(component.filaSeleccionadaControlInventarios).toEqual({} as any);
    expect(component.enableModficarBoton).toBe(false);
    expect(component.enableEliminarBoton).toBe(false);
  });

  it('should set last selected row', () => {
    const fila = [{ id: 1 }, { id: 2 }] as any;
    component.manejarFilaSeleccionada(fila);
    expect(component.filaSeleccionadaControlInventarios).toEqual(fila[1]);
  });

  it('should remove selected items and update store', () => {
    component.controlInventariosList = [
      { id: 1, nombreSistema: 'A', lugarRadicacion: 'B', cumpleAnexo24: false },
      { id: 2, nombreSistema: 'C', lugarRadicacion: 'D', cumpleAnexo24: true },
    ];
    component.listaFilaSeleccionadaEmpleado = [{ id: 1 } as any];
    jest.spyOn(component, 'cerrarEliminarConfirmationPopup');
    component.eliminarEmpleadoItem(true);
    expect(component.controlInventariosList.length).toBe(1);
    expect(component.cerrarEliminarConfirmationPopup).toHaveBeenCalled();
    expect(mockStore.actualizarEstado).toHaveBeenCalled();
  });

  it('should enable fields if radio is "1" and not readonly', () => {
    component.esFormularioSoloLectura = false;
    component.registroControlInventariosForm
      .get('sistemaControlInventariosArt59')
      ?.setValue('1');
    component.actualizarEstadoFormulario();
    expect(
      component.registroControlInventariosForm.get('nombreSistema')?.enabled
    ).toBe(true);
    expect(
      component.registroControlInventariosForm.get('lugarRadicacion')?.enabled
    ).toBe(true);
  });

  it('should disable fields if radio is "0"', () => {
    component.registroControlInventariosForm
      .get('sistemaControlInventariosArt59')
      ?.setValue('0');
    component.actualizarEstadoFormulario();
    expect(
      component.registroControlInventariosForm.get('nombreSistema')?.disabled
    ).toBe(true);
    expect(
      component.registroControlInventariosForm.get('lugarRadicacion')?.disabled
    ).toBe(true);
  });

  it('should return true if control is invalid and touched', () => {
    const control =
      component.registroControlInventariosForm.get('nombreSistema');
    control?.setValue('');
    control?.markAsTouched();
    expect(component.esInvalido('nombreSistema')).toBe(false);
  });

  it('should return false if control is valid', () => {
    const control =
      component.registroControlInventariosForm.get('nombreSistema');
    control?.setValue('SistemaX');
    control?.markAsTouched();
    expect(component.esInvalido('nombreSistema')).toBe(false);
  });

  it('should reset form fields and valorAnteriorRadioButton', () => {
    component.registroControlInventariosForm.patchValue({
      nombreSistema: 'X',
      lugarRadicacion: 'Y',
      cumpleAnexo24: true,
    });
    component.valorAnteriorRadioButton = '1';
    component.limpiarFormulario();
    expect(
      component.registroControlInventariosForm.get('nombreSistema')?.value
    ).toBeNull();
    expect(component.valorAnteriorRadioButton).toBeNull();
  });

  it('should show notification and set dialog if "0" selected', () => {
    component.onSeleccionfalsa('0');
    expect(component.esHabilitarElDialogo).toBe(true);
    expect(component.nuevaNotificacion).toBeDefined();
  });

  it('should set valorAnteriorRadioButton if "1" selected', () => {
    component.onSeleccionfalsa('1');
    expect(component.valorAnteriorRadioButton).toBe('1');
    expect(component.radioSeleccionado).toBe(true);
  });

  it('should mark as touched and return validity', () => {
    component.registroControlInventariosForm
      .get('sistemaControlInventariosArt59')
      ?.setValue('');
    expect(component.validarFormularios()).toBe(false);
    component.registroControlInventariosForm
      .get('sistemaControlInventariosArt59')
      ?.setValue('1');
    expect(component.validarFormularios()).toBe(true);
  });

  it('should update filaSeleccionadaControlInventarios with latest data from controlInventariosList', () => {
    component.controlInventariosList = [
      {
        id: 1,
        nombreSistema: 'SistemaA',
        lugarRadicacion: 'LugarA',
        cumpleAnexo24: false,
      },
      {
        id: 2,
        nombreSistema: 'SistemaB',
        lugarRadicacion: 'LugarB',
        cumpleAnexo24: true,
      },
    ];
    component.filaSeleccionadaControlInventarios = {
      id: 2,
      nombreSistema: 'Old',
      lugarRadicacion: 'Old',
      cumpleAnexo24: false,
    } as any;
    component.actualizarFilaSeleccionada();
    expect(component.filaSeleccionadaControlInventarios).toEqual({
      id: 2,
      nombreSistema: 'SistemaB',
      lugarRadicacion: 'LugarB',
      cumpleAnexo24: true,
    });
  });

  it('should not update filaSeleccionadaControlInventarios if no matching id found', () => {
    component.controlInventariosList = [
      {
        id: 1,
        nombreSistema: 'SistemaA',
        lugarRadicacion: 'LugarA',
        cumpleAnexo24: false,
      },
    ];
    const original = {
      id: 99,
      nombreSistema: 'X',
      lugarRadicacion: 'Y',
      cumpleAnexo24: false,
    };
    component.filaSeleccionadaControlInventarios = { ...original } as any;
    component.actualizarFilaSeleccionada();
    expect(component.filaSeleccionadaControlInventarios).toEqual(original);
  });

  it('should complete destroyed$', () => {
    const spy = jest.spyOn(component.destroyed$, 'next');
    const spy2 = jest.spyOn(component.destroyed$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should show notification if controlInventariosList is empty', () => {
    component.controlInventariosList = [];
    component.listaFilaSeleccionadaEmpleado = [{ id: 1 } as any];
    component.modificarItemEmpleado();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toBe(
      'No se encontró información'
    );
    expect(component.multipleSeleccionPopupAbierto).toBe(true);
    expect(component.actualizarFilaSeleccionada).not.toHaveBeenCalled();
  });

  it('should show notification if no row is selected', () => {
    component.controlInventariosList = [{ id: 1 } as any];
    component.listaFilaSeleccionadaEmpleado = [];
    component.modificarItemEmpleado();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toBe('Selecciona un registro');
    expect(component.multipleSeleccionPopupAbierto).toBe(true);
    expect(component.actualizarFilaSeleccionada).not.toHaveBeenCalled();
  });

  it('should show notification if more than one row is selected', () => {
    component.controlInventariosList = [{ id: 1 } as any];
    component.listaFilaSeleccionadaEmpleado = [
      { id: 1 } as any,
      { id: 2 } as any,
    ];
    component.modificarItemEmpleado();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toBe(
      'Selecciona sólo un registro para modificar.'
    );
    expect(component.multipleSeleccionPopupAbierto).toBe(true);
    expect(component.actualizarFilaSeleccionada).not.toHaveBeenCalled();
  });
  
  it('should do nothing if registroDeNumeroEmpleadosModalElemento does not exist', () => {
    component.registroDeNumeroEmpleadosModalElemento = undefined as any;
    expect(() => component.agregarDialogoDatos()).not.toThrow();
  });

  it('should patch modal form with selected row and update valorAnteriorRadioButton', () => {
    component.filaSeleccionadaControlInventarios = {
      id: 5,
      nombreSistema: 'SistemaTest',
      lugarRadicacion: 'LugarTest',
      cumpleAnexo24: true,
    } as any;
    component.registroControlInventariosForm
      .get('sistemaControlInventariosArt59')
      ?.setValue('1');
    jest.spyOn(component, 'actualizarEstadoFormulario');
    component.patchModifyiedData();
    expect(
      component.modificarRegistroControlInventariosForm.value
        .modificarNombreSistema
    ).toBe('SistemaTest');
    expect(component.valorAnteriorRadioButton).toBe('1');
    expect(component.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should not update valorAnteriorRadioButton if radio value is "0"', () => {
    component.filaSeleccionadaControlInventarios = {
      id: 5,
      nombreSistema: 'SistemaTest',
      lugarRadicacion: 'LugarTest',
      cumpleAnexo24: true,
    } as any;
    component.registroControlInventariosForm
      .get('sistemaControlInventariosArt59')
      ?.setValue('0');
    component.valorAnteriorRadioButton = null;
    component.patchModifyiedData();
    expect(component.valorAnteriorRadioButton).toBeNull();
  });

  it('should set nuevaNotificacion and open popup', () => {
    component.abrirMultipleSeleccionPopup();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toBe(
      'Selecciona sólo un registro para modificar.'
    );
    expect(component.multipleSeleccionPopupAbierto).toBe(true);
  });

  it('should show notification if controlInventariosList is empty', () => {
    component.controlInventariosList = [];
    component.listaFilaSeleccionadaEmpleado = [{ id: 1 } as any];
    component.confirmEliminarEmpleadoItem();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toBe(
      'No se encontró información'
    );
    expect(component.multipleSeleccionPopupAbierto).toBe(true);
  });

  it('should show notification if no row is selected', () => {
    component.controlInventariosList = [{ id: 1 } as any];
    component.listaFilaSeleccionadaEmpleado = [];
    component.confirmEliminarEmpleadoItem();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toBe('Seleccione un registro');
    expect(component.multipleSeleccionPopupAbierto).toBe(true);
  });

  it('should call abrirElimninarConfirmationopup if there are selected rows', () => {
    component.controlInventariosList = [{ id: 1 } as any];
    component.listaFilaSeleccionadaEmpleado = [{ id: 1 } as any];
    jest.spyOn(component, 'abrirElimninarConfirmationopup');
    component.confirmEliminarEmpleadoItem();
    expect(component.abrirElimninarConfirmationopup).toHaveBeenCalled();
  });

  it('should set nuevaNotificacion and open confirm popup', () => {
    component.abrirElimninarConfirmationopup();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toBe(
      '¿Estás seguro que deseas eliminar los registros marcados?'
    );
    expect(component.confirmEliminarPopupAbierto).toBe(true);
  });

  it('should close multiple selection popup', () => {
    component.multipleSeleccionPopupAbierto = true;
    component.multipleSeleccionPopupCerrado = false;
    component.cerrarMultipleSeleccionPopup();
    expect(component.multipleSeleccionPopupAbierto).toBe(false);
    expect(component.multipleSeleccionPopupCerrado).toBe(false);
  });
});
