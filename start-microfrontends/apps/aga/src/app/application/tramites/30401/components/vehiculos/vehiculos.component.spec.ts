import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { VehiculosComponent } from './vehiculos.component';
import { createInitialState, Tramite30401Store } from '../../estados/tramites30401.store';
import { Tramite30401Query } from '../../estados/tramites30401.query';
import { of } from 'rxjs';
import { Modal } from 'bootstrap';
import { TipoNotificacionEnum, CategoriaMensaje } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { TablaDinamicaComponent, TituloComponent, NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { VehiculosTabla } from '../../modelos/registro-empresas-transporte.model';

describe('VehiculosComponent', () => {
  let fixture: ComponentFixture<VehiculosComponent>;
  let component: VehiculosComponent;
  let tramite30401StoreMock: Partial<Tramite30401Store>;
  let tramite30401QueryMock: Partial<Tramite30401Query>;

  beforeEach(() => {
    tramite30401StoreMock = {
       establecerDatos: jest.fn(),
    };

    tramite30401QueryMock = {
      selectTramite30401$: of({
        ...createInitialState(),
        vehiculosTablaDatos: [],
      }),
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CommonModule,
        VehiculosComponent,
        TablaDinamicaComponent,
        TituloComponent,
        NotificacionesComponent,
      ],
      providers: [
        FormBuilder,
        { provide: Tramite30401Store, useValue: tramite30401StoreMock },
        { provide: Tramite30401Query, useValue: tramite30401QueryMock },
      ],
    });

    fixture = TestBed.createComponent(VehiculosComponent);
    component = fixture.componentInstance;
    component.registroDeVehiculosElemento = {
      nativeElement: document.createElement('div'),
    } as any;
    component.modalArchivo = {
      nativeElement: document.createElement('div'),
    } as any;
    component.confirmacionElemento = {
      nativeElement: document.createElement('div'),
    } as any;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe inicializar formularios y suscribirse a la tienda en ngOnInit', () => {
    expect(component.registroVehiculosForm).toBeDefined();
    expect(component.formularioArchivo).toBeDefined();
    expect(component.vehiculosInfoList).toEqual([]);
    expect(component.seccionState).toBeDefined();
  });

  it('Debe inicializar registroVehiculosForm con controles y validadores correctos', () => {
    const form = component.registroVehiculosForm;
    expect(form.get('id')).toBeDefined();
    expect(form.get('marca')).toBeDefined();
    expect(form.get('modelo')).toBeDefined();
    expect(form.get('vin')).toBeDefined();
    expect(form.valid).toBeFalsy();
  });

  it('Debe inicializar formularioArchivo con los controles y validadores correctos', () => {
    const form = component.formularioArchivo;
    expect(form.get('archivo')).toBeDefined();
    expect(form.valid).toBeFalsy();
  });

  it('Debería reiniciar registroVehiculosForm cuando se llama a limpiarFormulario', () => {
    component.registroVehiculosForm.patchValue({
      marca: 'Toyota',
      modelo: 'Corolla',
      vin: '123456789ABCDEFG',
    });
    component.limpiarFormulario();
    expect(component.registroVehiculosForm.value).toEqual({
      id: null,
      marca: null,
      modelo: null,
      vin: null,
    });
  });

  it('debería abrir modalArchivo cuando se llame a cargaArchivo', () => {
    const modalShowSpy = jest.spyOn(Modal.prototype, 'show').mockImplementation(() => {});
    component.cargaArchivo();
    expect(modalShowSpy).toHaveBeenCalled();
  });

  it('Debería abrir el modal registroDeVehiculos cuando se llama a agregarDialogoDatos', () => {
    const modalShowSpy = jest.spyOn(Modal.prototype, 'show').mockImplementation(() => {});
    component.agregarDialogoDatos();
    expect(modalShowSpy).toHaveBeenCalled();
  });

  it('Debería cerrar el modal de registroDeVehiculos cuando se llama a cambiarEstadoModal', () => {
    const modalHideSpy = jest.spyOn(Modal.prototype, 'hide').mockImplementation(() => {});
    jest.spyOn(Modal, 'getInstance').mockReturnValue({
      hide: modalHideSpy,
    } as any);
    component.cambiarEstadoModal();
    expect(modalHideSpy).toHaveBeenCalled();
  });

  it('Debe marcar todos los controles de formulario como tocados si registroVehiculosForm no es válido en enviarDialogData', () => {
    component.enviarDialogData();
    expect(component.registroVehiculosForm.get('marca')?.touched).toBe(true);
    expect(component.registroVehiculosForm.get('modelo')?.touched).toBe(true);
    expect(component.registroVehiculosForm.get('vin')?.touched).toBe(true);
  });

  it('Debe agregar un nuevo vehículo y mostrar la confirmación cuando se llama a enviarDialogData con un formato válido', () => {
    component.registroVehiculosForm.patchValue({
      marca: 'Toyota',
      modelo: 'Corolla',
      vin: '123456789ABCDEFG',
    });
    const cambiarEstadoModalSpy = jest.spyOn(component, 'cambiarEstadoModal');
    component.enviarDialogData();
    expect(component.vehiculosInfoList).toEqual([
      { id: 1, marca: 'Toyota', modelo: 'Corolla', vin: '123456789ABCDEFG' },
    ]);
   expect(tramite30401StoreMock.establecerDatos).toHaveBeenCalledWith({
  vehiculosTablaDatos: [
    { id: 1, marca: 'Toyota', modelo: 'Corolla', vin: '123456789ABCDEFG' },
  ],
});

    expect(component.nuevaNotificacion).toEqual({
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: component.CONFIRMACION_VEHICULO,
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    });
    expect(component.esHabilitarElDialogo).toBe(true);
    expect(cambiarEstadoModalSpy).toHaveBeenCalled();
    expect(component.registroVehiculosForm.pristine).toBe(true);
  });

  it('Debe actualizar el vehículo existente cuando se llama a vehiculosInfoDatos con la fila seleccionada', () => {
    component.filaSeleccionadaVehiculos = { id: 1, marca: 'Old', modelo: 'Old', vin: 'OLD123' };
    component.vehiculosInfoList = [{ id: 1, marca: 'Old', modelo: 'Old', vin: 'OLD123' }];
    component.registroVehiculosForm.patchValue({
      marca: 'Toyota',
      modelo: 'Corolla',
      vin: '123456789ABCDEFG',
    });
    component.vehiculosInfoDatos();
    expect(component.vehiculosInfoList).toEqual([
      { id: 1, marca: 'Toyota', modelo: 'Corolla', vin: '123456789ABCDEFG' },
    ]);
  expect(tramite30401StoreMock.establecerDatos).toHaveBeenCalledWith({
  vehiculosTablaDatos: [
    { id: 1, marca: 'Toyota', modelo: 'Corolla', vin: '123456789ABCDEFG' },
  ],
});
    expect(component.filaSeleccionadaVehiculos).toEqual({});
  });

  it('debe cerrar el modal de confirmación cuando se llama a cerrarModal', () => {
    component.esHabilitarElDialogo = true;
    component.cerrarModal();
    expect(component.esHabilitarElDialogo).toBe(false);
  });

  it('deberia actualizar filaSeleccionadaVehículos en actualizarFilaSeleccionada', () => {
    component.vehiculosInfoList = [
      { id: 1, marca: 'Toyota', modelo: 'Corolla', vin: '123456789ABCDEFG' },
    ];
    component.filaSeleccionadaVehiculos = { id: 1, marca: 'Old', modelo: 'Old', vin: 'OLD123' };
    component.actualizarFilaSeleccionada();
    expect(component.filaSeleccionadaVehiculos).toEqual({
      id: 1,
      marca: 'Toyota',
      modelo: 'Corolla',
      vin: '123456789ABCDEFG',
    });
  });

  it('Debería eliminar los vehículos seleccionados en eliminarVehiculosItem', () => {
    component.vehiculosInfoList = [
      { id: 1, marca: 'Toyota', modelo: 'Corolla', vin: '123456789ABCDEFG' },
      { id: 2, marca: 'Honda', modelo: 'Civic', vin: '987654321ZYXWVUT' },
    ];
    component.listaFilaSeleccionadaVehiculos = [
      { id: 1, marca: 'Toyota', modelo: 'Corolla', vin: '123456789ABCDEFG' },
    ];
    const cerrarSpy = jest.spyOn(component, 'cerrarEliminarConfirmationPopup');
    component.eliminarVehiculosItem(true);
    expect(component.vehiculosInfoList).toEqual([
      { id: 2, marca: 'Honda', modelo: 'Civic', vin: '987654321ZYXWVUT' },
    ]);
    expect(component.listaFilaSeleccionadaVehiculos).toEqual([]);
  

    expect(cerrarSpy).toHaveBeenCalled();
  });

  it('Debería cerrar la ventana emergente de confirmación de eliminación en cerrarEliminarConfirmationPopup', () => {
    component.confirmEliminarPopupAbierto = true;
    component.cerrarEliminarConfirmationPopup();
    expect(component.confirmEliminarPopupAbierto).toBe(false);
  });


  it('Debería manejar modificarItemVehiculos correctamente según listaFilaSeleccionadaVehiculos', () => {
    const actualizarFilaSeleccionadaSpy = jest.spyOn(component, 'actualizarFilaSeleccionada').mockImplementation(() => {});
    const agregarDialogoDatosSpy = jest.spyOn(component, 'agregarDialogoDatos').mockImplementation(() => {});
    const patchModifiedDataSpy = jest.spyOn(component, 'patchModifyiedData').mockImplementation(() => {});
    component.listaFilaSeleccionadaVehiculos = [];
    component.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: '',
      cerrar: false,
      txtBtnAceptar: '',
      txtBtnCancelar: '',
    };
    component.multipleSeleccionPopupAbierto = false;
    component.modificarItemVehiculos();

    expect(component.multipleSeleccionPopupAbierto).toBe(true);
    expect(component.nuevaNotificacion).toEqual({
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'Selecciona un registro',
      cerrar: false,
      txtBtnAceptar: 'Cerrar',
      txtBtnCancelar: '',
    });
    expect(actualizarFilaSeleccionadaSpy).not.toHaveBeenCalled();
    expect(agregarDialogoDatosSpy).not.toHaveBeenCalled();
    expect(patchModifiedDataSpy).not.toHaveBeenCalled();
    actualizarFilaSeleccionadaSpy.mockReset();
    agregarDialogoDatosSpy.mockReset();
    patchModifiedDataSpy.mockReset();
    component.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: '',
      cerrar: false,
      txtBtnAceptar: '',
      txtBtnCancelar: '',
    };
    component.multipleSeleccionPopupAbierto = false;

    component.listaFilaSeleccionadaVehiculos = [
      { id: 1, marca: 'Toyota', modelo: 'Corolla', vin: '123456789ABCDEFG' },
      { id: 2, marca: 'Honda', modelo: 'Civic', vin: '987654321ZYXWVUT' },
    ];
    component.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: '',
      cerrar: false,
      txtBtnAceptar: '',
      txtBtnCancelar: '',
    };
    component.multipleSeleccionPopupAbierto = false;
    component.modificarItemVehiculos();

    expect(component.multipleSeleccionPopupAbierto).toBe(true);
    expect(component.nuevaNotificacion).toEqual({
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'Selecciona sólo un registro para modificar.',
      cerrar: false,
      txtBtnAceptar: 'Cerrar',
      txtBtnCancelar: '',
    });
    expect(actualizarFilaSeleccionadaSpy).not.toHaveBeenCalled();
    expect(agregarDialogoDatosSpy).not.toHaveBeenCalled();
    expect(patchModifiedDataSpy).not.toHaveBeenCalled();
    actualizarFilaSeleccionadaSpy.mockReset();
    agregarDialogoDatosSpy.mockReset();
    patchModifiedDataSpy.mockReset();
    
    component.multipleSeleccionPopupAbierto = false;
    component.listaFilaSeleccionadaVehiculos = [
      { id: 1, marca: 'Toyota', modelo: 'Corolla', vin: '123456789ABCDEFG' },
    ];

    component.multipleSeleccionPopupAbierto = false;
    component.modificarItemVehiculos();

  });
  it('Debe parchear el formulario con los datos del vehículo seleccionado en patchModifiedData', () => {
    component.filaSeleccionadaVehiculos = {
      id: 1,
      marca: 'Toyota',
      modelo: 'Corolla',
      vin: '123456789ABCDEFG',
    };
    component.patchModifyiedData();
    expect(component.registroVehiculosForm.value).toEqual({
      id: 1,
      marca: 'Toyota',
      modelo: 'Corolla',
      vin: '123456789ABCDEFG',
    });
  });

  it('Debería mostrarse una notificación si no se ha seleccionado nada al confirmarEliminarVehiculosItem', () => {
    component.listaFilaSeleccionadaVehiculos = [];
    component.confirmEliminarVehiculosItem();
    expect(component.multipleSeleccionPopupAbierto).toBe(true);
    expect(component.nuevaNotificacion).toEqual({
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'Debes seleccionar al menos un registro para eliminar.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    });
  });

  it('Debería abrir la ventana emergente de confirmación de eliminación en abrirEliminarConfirmationPopup', () => {
    component.abrirElimninarConfirmationopup();
    expect(component.confirmEliminarPopupAbierto).toBe(true);
    expect(component.nuevaNotificacion).toEqual({
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal',
      titulo: '',
      mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    });
  });

  it('Debería cerrar la ventana emergente de selección múltiple en cerrarMultipleSeleccionPopup', () => {
    component.multipleSeleccionPopupAbierto = true;
    component.cerrarMultipleSeleccionPopup();
    expect(component.multipleSeleccionPopupAbierto).toBe(false);
  });

  it('Debe devolver verdadero para controles no válidos y tocados en esInvalido', () => {
    component.registroVehiculosForm.get('marca')?.setErrors({ required: true });
    component.registroVehiculosForm.get('marca')?.markAsTouched();
    expect(component.esInvalido('marca')).toBe(true);
    expect(component.esInvalido('modelo')).toBe(false);
  });
});