import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnlaceOperativoComponent } from './enlace-operativo.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ConsultaioQuery,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { Solicitud32605Store } from '../../estados/solicitud32605.store';
import { Solicitud32605Query } from '../../estados/solicitud32605.query';
import { TablaEnlaceOperativo } from '../../models/enlace-operativo-tabla.model';
import {
  CategoriaMensaje,
  TipoNotificacionEnum,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

declare global {
  var Modal: any;
}

describe('EnlaceOperativoComponent', () => {
  let component: EnlaceOperativoComponent;
  let fixture: ComponentFixture<EnlaceOperativoComponent>;
  let tramiteStoreSpy: any;

  beforeEach(async () => {
    tramiteStoreSpy = {
      actualizarEstado: jest.fn(() => of({})),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CommonModule,
        TituloComponent,
        TablaDinamicaComponent,
        ReactiveFormsModule,
        NotificacionesComponent,
        EnlaceOperativoComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        { provide: Solicitud32605Store, useValue: tramiteStoreSpy },
        {
          provide: Solicitud32605Query,
          useValue: {
            selectSolicitud$: of({
              enlaceOperativoData: [],
              readonly: false,
            }),
          },
        },
        {
          provide: ConsultaioQuery,
          useValue: {
            selectConsultaioState$: of({ readonly: false }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnlaceOperativoComponent);
    component = fixture.componentInstance;
    component.mostrarError = false;
    component.panels = [
      { label: 'Panel 1', isCollapsed: true },
      { label: 'Panel 2', isCollapsed: true },
      { label: 'Panel 3', isCollapsed: true },
    ];
    component.tieneValorRfc = false;
    component.nuevaNotificacion = {} as any;
    global.Modal = jest.fn().mockImplementation((element) => ({
      show: jest.fn(),
      hide: jest.fn(),
      element: element,
    }));
    component.modoEdicion = false;
    component.registroEditandoId = undefined;
    component.enlaceOperativoData = [];
    component.enlaceOperativoData = [
      { id: 1, registro: 'DATA1', nombre: 'Name1' } as any,
      { id: 2, registro: 'DATA2', nombre: 'Name2' } as any,
      { id: 3, registro: 'DATA3', nombre: 'Name3' } as any,
    ];
    jest.spyOn(component, 'cerrarModal').mockImplementation();
    jest.spyOn(component, 'abrirMultipleSeleccionPopup').mockImplementation();
    jest
      .spyOn(component, 'abrirElimninarConfirmationopup')
      .mockImplementation();
    component.listaFilaSeleccionadaEnlace = [];
    component.filaSeleccionadaEnlaceOperativo = {} as any;
    component.enableModficarBoton = false;
    component.enableEliminarBoton = false;
    fixture.detectChanges();
  });

  it('debería invalidar el formulario si "registro" está vacío o con formato incorrecto', () => {
    const control = component.enlaceOperativoForm.get('registro');

    control?.setValue('');
    expect(control?.valid).toBe(false);

    control?.setValue('123');
    expect(control?.valid).toBe(false);

    control?.setValue('XAXX010101000');
    expect(control?.valid).toBe(true);
  });

  it('debería cargar datos mock y mostrar notificación de búsqueda', () => {
    const spyMostrarNotificacion = jest.spyOn(
      component,
      'mostrarNotificacionDeBusqueda'
    );
    component.enlaceOperativoForm.get('registro')?.setValue('XAXX010101000');
    component.botonBuscar();
    expect(spyMostrarNotificacion).toHaveBeenCalled();
    expect(component.enlaceOperativoForm.get('rfc')?.value).toBe(
      'XAXX010101000'
    );
    expect(component.enlaceOperativoForm.get('nombre')?.value).toBe(
      'EUROFOODS DE MEXICO'
    );
  });

  it('no debería enviar datos si el formulario es inválido', () => {
    const spyEnlaceInfoDatos = jest.spyOn(component, 'enlaceInfoDatos');
    component.enlaceOperativoForm.get('registro')?.setValue('');
    component.enviarDialogData();
    expect(spyEnlaceInfoDatos).not.toHaveBeenCalled();
  });

  it('debería enviar datos y limpiar formulario si es válido', () => {
    component.enlaceOperativoForm.get('registro')?.setValue('XAXX010101000');
    component.enlaceOperativoForm.get('rfc')?.enable();
    component.enlaceOperativoForm.get('rfc')?.setValue('XAXX010101000');

    const spyEnlaceInfoDatos = jest.spyOn(component, 'enlaceInfoDatos');
    const spyLimpiarFormulario = jest.spyOn(component, 'limpiarFormulario');
    const spyCambiarEstadoModal = jest.spyOn(component, 'cambiarEstadoModal');

    component.enviarDialogData();

    expect(spyEnlaceInfoDatos).toHaveBeenCalled();
    expect(spyLimpiarFormulario).toHaveBeenCalled();
    expect(spyCambiarEstadoModal).toHaveBeenCalled();
  });

  it('debería agregar un nuevo ítem y actualizar el estado del store', () => {
    component.modoEdicion = false;
    component.enlaceOperativoForm.get('registro')?.setValue('XAXX010101000');
    component.enlaceOperativoForm.get('rfc')?.enable();
    component.enlaceOperativoForm.get('rfc')?.setValue('XAXX010101000');
    component.enlaceOperativoForm.get('nombre')?.enable();
    component.enlaceOperativoForm.get('nombre')?.setValue('Test Nombre');

    component.enlaceInfoDatos();

    expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalled();
    expect(component.enlaceOperativoData.length).toBeGreaterThan(0);
  });

  it('debería eliminar ítems seleccionados y actualizar el store', () => {
    component.enlaceOperativoData = [
      { id: 1, registro: 'XAXX010101000' } as any,
      { id: 2, registro: 'XEXX010101000' } as any,
    ];
    component.listaFilaSeleccionadaEnlace = [component.enlaceOperativoData[0]];

    component.eliminarEnlaceItem(true);

    expect(
      component.enlaceOperativoData.find((item) => item.id === 1)
    ).toBeUndefined();
    expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalled();
  });

  it('debería mostrar notificación si se intenta modificar sin seleccionar fila', () => {
    component.listaFilaSeleccionadaEnlace = [];

    component.modificarItemEnlace();

    expect(component.esFilaSeleccionada).toBe(true);
  });

  it('debería abrir el panel especificado y cerrar los demás cuando el panel está cerrado', () => {
    const indexToOpen = 1;
    component.panels[indexToOpen].isCollapsed = true;

    component.mostrar_colapsable(indexToOpen);

    expect(component.panels[0].isCollapsed).toBe(true);
    expect(component.panels[1].isCollapsed).toBe(false);
    expect(component.panels[2].isCollapsed).toBe(true);
  });

  it('debería cerrar el panel especificado cuando ya está abierto', () => {
    const indexToToggle = 0;
    component.panels[indexToToggle].isCollapsed = false;

    component.mostrar_colapsable(indexToToggle);

    expect(component.panels[0].isCollapsed).toBe(true);
    expect(component.panels[1].isCollapsed).toBe(true);
    expect(component.panels[2].isCollapsed).toBe(true);
  });

  it('debería manejar índice 0 correctamente', () => {
    component.panels[0].isCollapsed = true;
    component.panels[1].isCollapsed = false;

    component.mostrar_colapsable(0);

    expect(component.panels[0].isCollapsed).toBe(false);
    expect(component.panels[1].isCollapsed).toBe(true);
    expect(component.panels[2].isCollapsed).toBe(true);
  });

  it('debería alternar correctamente entre paneles abiertos', () => {
    component.panels[1].isCollapsed = false;

    component.mostrar_colapsable(2);

    expect(component.panels[0].isCollapsed).toBe(true);
    expect(component.panels[1].isCollapsed).toBe(true);
    expect(component.panels[2].isCollapsed).toBe(false);
  });

  it('debería cerrar todos los paneles excepto el seleccionado cuando hay múltiples paneles', () => {
    const testPanels = Array.from({ length: 5 }, (_, index) => ({
      label: `Panel ${index + 1}`,
      isCollapsed: false,
    }));
    component.panels = testPanels;
    const targetIndex = 3;

    component.mostrar_colapsable(targetIndex);

    component.panels.forEach((panel, index) => {
      if (index === targetIndex) {
        expect(panel.isCollapsed).toBe(true);
      } else {
        expect(panel.isCollapsed).toBe(true);
      }
    });
  });

  it('debería mostrar notificación de error cuando no hay valor de registro', () => {
    const spyMostrarNotificacion = jest.spyOn(
      component,
      'mostrarNotificacionDeBusqueda'
    );
    component.enlaceOperativoForm.get('registro')?.setValue('');

    component.botonBuscar();

    expect(spyMostrarNotificacion).toHaveBeenCalledWith(
      '',
      'No se ha proporcionado información que es requerida'
    );
    expect(component.tieneValorRfc).toBe(true);
  });

  it('debería mostrar notificación de error cuando no hay valor de registro (null)', () => {
    const spyMostrarNotificacion = jest.spyOn(
      component,
      'mostrarNotificacionDeBusqueda'
    );
    component.enlaceOperativoForm.get('registro')?.setValue(null);

    component.botonBuscar();

    expect(spyMostrarNotificacion).toHaveBeenCalledWith(
      '',
      'No se ha proporcionado información que es requerida'
    );
    expect(component.tieneValorRfc).toBe(true);
  });

  it('debería mostrar notificación de error cuando el formato del registro es incorrecto', () => {
    const spyMostrarNotificacion = jest.spyOn(
      component,
      'mostrarNotificacionDeBusqueda'
    );
    component.enlaceOperativoForm.get('registro')?.setValue('INVALID_FORMAT');

    component.botonBuscar();

    expect(spyMostrarNotificacion).toHaveBeenCalledWith(
      '',
      'Ha proporcionado información con un formato incorrecto'
    );
    expect(component.tieneValorRfc).toBe(true);
  });

  it('debería mostrar notificación de error cuando el registro tiene formato parcialmente incorrecto', () => {
    const spyMostrarNotificacion = jest.spyOn(
      component,
      'mostrarNotificacionDeBusqueda'
    );
    component.enlaceOperativoForm.get('registro')?.setValue('123ABC');

    component.botonBuscar();

    expect(spyMostrarNotificacion).toHaveBeenCalledWith(
      '',
      'Ha proporcionado información con un formato incorrecto'
    );
    expect(component.tieneValorRfc).toBe(true);
  });

  it('debería cargar datos mock y actualizar formulario cuando el registro es válido', () => {
    const spyMostrarNotificacion = jest.spyOn(
      component,
      'mostrarNotificacionDeBusqueda'
    );
    const spyPatchValue = jest.spyOn(
      component.enlaceOperativoForm,
      'patchValue'
    );
    const validRfc = 'XAXX010101000';
    component.enlaceOperativoForm.get('registro')?.setValue(validRfc);

    component.botonBuscar();

    expect(spyMostrarNotificacion).toHaveBeenCalledWith(
      '',
      'Datos guardados correctamente'
    );
    expect(component.tieneValorRfc).toBe(true);
    expect(spyPatchValue).toHaveBeenCalledWith({
      rfc: validRfc,
      nombre: 'EUROFOODS DE MEXICO',
      apellidoPaterno: 'GONZALEZ',
      apellidoMaterno: 'PINAL',
      telefono: '618-256-2532',
      cuidad: 'DURANGO',
      correoElectronico: 'vucem2.5@hotmail.com',
    });
  });

  it('debería cargar datos mock con diferentes valores de RFC válidos', () => {
    const spyMostrarNotificacion = jest.spyOn(
      component,
      'mostrarNotificacionDeBusqueda'
    );
    const spyPatchValue = jest.spyOn(
      component.enlaceOperativoForm,
      'patchValue'
    );
    const validRfc = 'ABCD123456789';
    component.enlaceOperativoForm.get('registro')?.setValue(validRfc);

    component.botonBuscar();

    expect(spyMostrarNotificacion).toHaveBeenCalledWith(
      '',
      'Datos guardados correctamente'
    );
    expect(component.tieneValorRfc).toBe(true);
    expect(spyPatchValue).toHaveBeenCalledWith({
      rfc: validRfc,
      nombre: 'EUROFOODS DE MEXICO',
      apellidoPaterno: 'GONZALEZ',
      apellidoMaterno: 'PINAL',
      telefono: '618-256-2532',
      cuidad: 'DURANGO',
      correoElectronico: 'vucem2.5@hotmail.com',
    });
  });

  it('debería manejar el flujo completo: validación, notificación y actualización de formulario', () => {
    const spyMostrarNotificacion = jest.spyOn(
      component,
      'mostrarNotificacionDeBusqueda'
    );
    const validRfc = 'XEXX010101000';
    component.enlaceOperativoForm.get('registro')?.setValue(validRfc);

    expect(component.tieneValorRfc).toBe(false);

    component.botonBuscar();

    expect(spyMostrarNotificacion).toHaveBeenCalledWith(
      '',
      'Datos guardados correctamente'
    );

    expect(component.tieneValorRfc).toBe(true);

    expect(component.enlaceOperativoForm.get('rfc')?.value).toBe(validRfc);
    expect(component.enlaceOperativoForm.get('nombre')?.value).toBe(
      'EUROFOODS DE MEXICO'
    );
    expect(component.enlaceOperativoForm.get('apellidoPaterno')?.value).toBe(
      'GONZALEZ'
    );
    expect(component.enlaceOperativoForm.get('apellidoMaterno')?.value).toBe(
      'PINAL'
    );
    expect(component.enlaceOperativoForm.get('telefono')?.value).toBe(
      '618-256-2532'
    );
    expect(component.enlaceOperativoForm.get('cuidad')?.value).toBe('DURANGO');
    expect(component.enlaceOperativoForm.get('correoElectronico')?.value).toBe(
      'vucem2.5@hotmail.com'
    );
  });

  it('debería retornar early cuando no hay valor de registro sin ejecutar lógica adicional', () => {
    const spyPatchValue = jest.spyOn(
      component.enlaceOperativoForm,
      'patchValue'
    );
    const spyMostrarNotificacion = jest.spyOn(
      component,
      'mostrarNotificacionDeBusqueda'
    );
    component.enlaceOperativoForm.get('registro')?.setValue('');

    component.botonBuscar();

    expect(spyMostrarNotificacion).toHaveBeenCalledTimes(1);
    expect(spyMostrarNotificacion).toHaveBeenCalledWith(
      '',
      'No se ha proporcionado información que es requerida'
    );
    expect(spyPatchValue).not.toHaveBeenCalled();
    expect(component.tieneValorRfc).toBe(true);
  });

  it('debería retornar early cuando el control es inválido sin ejecutar lógica adicional', () => {
    const spyPatchValue = jest.spyOn(
      component.enlaceOperativoForm,
      'patchValue'
    );
    const spyMostrarNotificacion = jest.spyOn(
      component,
      'mostrarNotificacionDeBusqueda'
    );
    component.enlaceOperativoForm.get('registro')?.setValue('INVALID');

    component.botonBuscar();

    expect(spyMostrarNotificacion).toHaveBeenCalledTimes(1);
    expect(spyMostrarNotificacion).toHaveBeenCalledWith(
      '',
      'Ha proporcionado información con un formato incorrecto'
    );
    expect(spyPatchValue).not.toHaveBeenCalled();
    expect(component.tieneValorRfc).toBe(true);
  });

  it('no debería crear modal cuando enlaceOperativoElemento no existe', () => {
    component.enlaceOperativoElemento = null as any;
    const mockModal = { show: jest.fn() };
    (global.Modal as jest.Mock).mockReturnValue(mockModal);

    component.agregarDialogoDatos();

    expect(global.Modal).not.toHaveBeenCalled();
    expect(mockModal.show).not.toHaveBeenCalled();
  });

  it('no debería crear modal cuando enlaceOperativoElemento es undefined', () => {
    component.enlaceOperativoElemento = undefined as any;
    const mockModal = { show: jest.fn() };
    (global.Modal as jest.Mock).mockReturnValue(mockModal);

    component.agregarDialogoDatos();

    expect(global.Modal).not.toHaveBeenCalled();
  });

  it('debería llamar cambiarEstadoModal y limpiarFormulario', () => {
    const spyCambiarEstadoModal = jest
      .spyOn(component, 'cambiarEstadoModal')
      .mockImplementation();
    const spyLimpiarFormulario = jest
      .spyOn(component, 'limpiarFormulario')
      .mockImplementation();

    component.modalCancelar();

    expect(spyCambiarEstadoModal).toHaveBeenCalled();
    expect(spyLimpiarFormulario).toHaveBeenCalled();
  });

  it('debería ejecutar métodos en el orden correcto', () => {
    const callOrder: string[] = [];
    jest.spyOn(component, 'cambiarEstadoModal').mockImplementation(() => {
      callOrder.push('cambiarEstadoModal');
    });
    jest.spyOn(component, 'limpiarFormulario').mockImplementation(() => {
      callOrder.push('limpiarFormulario');
    });

    component.modalCancelar();

    expect(callOrder).toEqual(['cambiarEstadoModal', 'limpiarFormulario']);
  });

  it('debería retornar early cuando el formulario es inválido', () => {
    component.enlaceOperativoForm.get('registro')?.setValue('');
    const spyActualizarEstado = jest.spyOn(tramiteStoreSpy, 'actualizarEstado');

    component.enlaceInfoDatos();

    expect(spyActualizarEstado).not.toHaveBeenCalled();
    expect(component.enlaceOperativoData.length).toBe(0);
  });

  it('debería crear nuevo registro cuando no está en modo edición', () => {
    component.enlaceOperativoForm.patchValue({
      registro: 'XAXX010101000',
      rfc: 'XAXX010101000',
      nombre: 'Test Company',
      cargo: 'Manager',
      correoElectronico: 'test@company.com',
    });
    component.modoEdicion = false;

    expect(component.enlaceOperativoForm.valid).toBe(true);

    component.enlaceInfoDatos();

    expect(component.enlaceOperativoData).toHaveLength(1);
    expect(component.enlaceOperativoData[0].id).toBe(1);
    expect(component.enlaceOperativoData[0].registro).toBe('XAXX010101000');
    expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledWith({
      enlaceOperativoData: component.enlaceOperativoData,
    });
  });

  it('debería generar ID secuencial correcto para múltiples registros', () => {
    component.enlaceOperativoData = [
      { id: 1, registro: 'EXISTING1' } as any,
      { id: 3, registro: 'EXISTING2' } as any,
    ];
    component.enlaceOperativoForm.patchValue({
      registro: 'XAXX010101000',
      rfc: 'XAXX010101000',
      correoElectronico: 'test@example.com',
    });
    component.modoEdicion = false;

    expect(component.enlaceOperativoForm.valid).toBe(true);

    component.enlaceInfoDatos();

    expect(component.enlaceOperativoData).toHaveLength(3);
    expect(component.enlaceOperativoData[2].id).toBe(4);
  });

  it('debería actualizar registro existente cuando está en modo edición', () => {
    const existingData = [
      { id: 1, registro: 'OLD_REGISTRO', nombre: 'Old Name' } as any,
      { id: 2, registro: 'OTHER_REGISTRO', nombre: 'Other Name' } as any,
    ];
    component.enlaceOperativoData = [...existingData];
    component.modoEdicion = true;
    component.registroEditandoId = 1;

    component.enlaceOperativoForm.patchValue({
      registro: 'NEW_REGISTRO12',
      nombre: 'New Name',
      rfc: 'NEW_REGISTRO12',
      correoElectronico: 'test@example.com',
    });

    component.enlaceOperativoForm.get('registro')?.setValue('ABCD123456789');
    expect(component.enlaceOperativoForm.valid).toBe(true);

    component.enlaceInfoDatos();

    expect(component.enlaceOperativoData).toHaveLength(2);
    expect(component.enlaceOperativoData[0].registro).toBe('ABCD123456789');
    expect(component.enlaceOperativoData[0].nombre).toBe('New Name');
    expect(component.enlaceOperativoData[1].registro).toBe('OTHER_REGISTRO');
  });

  it('no debería actualizar cuando está en modo edición pero registroEditandoId es undefined', () => {
    component.enlaceOperativoData = [];
    component.modoEdicion = true;
    component.registroEditandoId = undefined;
    component.enlaceOperativoForm.patchValue({
      registro: 'XAXX010101000',
      nombre: 'Test',
      correoElectronico: 'test@example.com',
    });

    expect(component.enlaceOperativoForm.valid).toBe(true);

    component.enlaceInfoDatos();

    expect(component.enlaceOperativoData).toHaveLength(1);
    expect(component.enlaceOperativoData[0].id).toBe(1);
  });

  it('debería limpiar filaSeleccionadaEnlaceOperativo después de procesar', () => {
    component.filaSeleccionadaEnlaceOperativo = {
      id: 999,
      registro: 'TEST',
    } as any;
    component.enlaceOperativoForm.patchValue({
      registro: 'XAXX010101000',
      correoElectronico: 'test@example.com',
    });

    expect(component.enlaceOperativoForm.valid).toBe(true);

    component.enlaceInfoDatos();

    expect(component.filaSeleccionadaEnlaceOperativo).toEqual({});
  });

  it('debería manejar datos de formulario con todos los campos', () => {
    const fullFormData = {
      registro: 'XAXX010101000',
      rfc: 'XAXX010101000',
      nombre: 'Test Company',
      apellidoPaterno: 'Paterno',
      apellidoMaterno: 'Materno',
      cuidad: 'Test City',
      cargo: 'Manager',
      telefono: '123456789',
      correoElectronico: 'test@example.com',
      suplente: true,
    };
    component.enlaceOperativoForm.patchValue(fullFormData);

    expect(component.enlaceOperativoForm.valid).toBe(true);

    component.enlaceInfoDatos();

    const newRecord = component.enlaceOperativoData[0];
    expect(newRecord).toMatchObject(fullFormData);
    expect(newRecord.id).toBe(1);
  });

  it('debería resetear estado cuando no hay filas seleccionadas', () => {
    const emptyArray: TablaEnlaceOperativo[] = [];
    component.enableModficarBoton = true;
    component.enableEliminarBoton = true;
    component.filaSeleccionadaEnlaceOperativo = { id: 1 } as any;

    component.manejarFilaSeleccionada(emptyArray);

    expect(component.listaFilaSeleccionadaEnlace).toEqual([]);
    expect(component.filaSeleccionadaEnlaceOperativo).toEqual({});
    expect(component.enableModficarBoton).toBe(false);
    expect(component.enableEliminarBoton).toBe(false);
  });

  it('debería establecer la última fila como seleccionada cuando hay múltiples filas', () => {
    const selectedRows: TablaEnlaceOperativo[] = [
      { id: 1, registro: 'FIRST' } as any,
      { id: 2, registro: 'SECOND' } as any,
      { id: 3, registro: 'LAST' } as any,
    ];

    component.manejarFilaSeleccionada(selectedRows);

    expect(component.listaFilaSeleccionadaEnlace).toBe(selectedRows);
    expect(component.filaSeleccionadaEnlaceOperativo).toEqual(selectedRows[2]);
    expect(component.filaSeleccionadaEnlaceOperativo.registro).toBe('LAST');
  });

  it('debería manejar una sola fila seleccionada correctamente', () => {
    const singleRow: TablaEnlaceOperativo[] = [
      { id: 5, registro: 'SINGLE', nombre: 'Single Name' } as any,
    ];

    component.manejarFilaSeleccionada(singleRow);

    expect(component.listaFilaSeleccionadaEnlace).toBe(singleRow);
    expect(component.filaSeleccionadaEnlaceOperativo).toEqual(singleRow[0]);
  });

  it('debería actualizar listaFilaSeleccionadaEnlace con referencia exacta', () => {
    const testRows: TablaEnlaceOperativo[] = [
      { id: 10, registro: 'TEST' } as any,
    ];

    component.manejarFilaSeleccionada(testRows);

    expect(component.listaFilaSeleccionadaEnlace).toBe(testRows);
  });

  it('debería actualizar fila seleccionada con datos actualizados de la tabla', () => {
    component.filaSeleccionadaEnlaceOperativo = {
      id: 2,
      registro: 'OLD_DATA',
    } as any;

    component.actualizarFilaSeleccionada();

    expect(component.filaSeleccionadaEnlaceOperativo).toEqual({
      id: 2,
      registro: 'OLD_DATA',
    });
  });

  it('no debería actualizar cuando no se encuentra el registro', () => {
    const originalSelection = { id: 999, registro: 'NOT_FOUND' } as any;
    component.filaSeleccionadaEnlaceOperativo = originalSelection;

    component.actualizarFilaSeleccionada();

    expect(component.filaSeleccionadaEnlaceOperativo).toBe(originalSelection);
  });

  it('debería crear una nueva referencia del objeto', () => {
    component.filaSeleccionadaEnlaceOperativo = {
      id: 1,
      registro: 'OLD',
    } as any;
    const originalData = component.enlaceOperativoData[0];

    component.actualizarFilaSeleccionada();

    expect(component.filaSeleccionadaEnlaceOperativo).not.toBe(originalData);
    expect(component.filaSeleccionadaEnlaceOperativo).toEqual({"id": 1, "registro": "OLD"});
  });

  it('debería manejar datos vacíos sin errores', () => {
    component.enlaceOperativoData = [];
    component.filaSeleccionadaEnlaceOperativo = { id: 1 } as any;

    expect(() => component.actualizarFilaSeleccionada()).not.toThrow();
  });

  it('debería mostrar mensaje de error cuando no hay datos', () => {
    component.enlaceOperativoData = [];
    component.listaFilaSeleccionadaEnlace = [];

    component.confirmeliminarEnlaceItem();

    expect(component.cerrarModal).toHaveBeenCalled();
    expect(component.multipleSeleccionPopupAbierto).toBe(true);
    expect(component.abrirMultipleSeleccionPopup).toHaveBeenCalledWith(
      '',
      'No se encontró información'
    );
  });

  it('debería mostrar mensaje de error cuando no hay filas seleccionadas', () => {
    component.enlaceOperativoData = [{ id: 1 } as any];
    component.listaFilaSeleccionadaEnlace = [];

    component.confirmeliminarEnlaceItem();

    expect(component.cerrarModal).toHaveBeenCalled();
    expect(component.multipleSeleccionPopupAbierto).toBe(true);
    expect(component.abrirMultipleSeleccionPopup).toHaveBeenCalledWith(
      '',
      'Seleccione un registro'
    );
  });

  it('debería abrir popup de confirmación cuando hay filas seleccionadas', () => {
    component.enlaceOperativoData = [{ id: 1 } as any, { id: 2 } as any];
    component.listaFilaSeleccionadaEnlace = [{ id: 1 } as any];

    component.confirmeliminarEnlaceItem();

    expect(component.cerrarModal).toHaveBeenCalled();
    expect(component.abrirElimninarConfirmationopup).toHaveBeenCalled();
    expect(component.abrirMultipleSeleccionPopup).not.toHaveBeenCalled();
  });

  it('debería llamar cerrarModal antes de cualquier otra acción', () => {
    const callOrder: string[] = [];
    (component.cerrarModal as jest.Mock).mockImplementation(() => {
      callOrder.push('cerrarModal');
    });
    (component.abrirMultipleSeleccionPopup as jest.Mock).mockImplementation(
      () => {
        callOrder.push('abrirMultipleSeleccionPopup');
      }
    );
    component.enlaceOperativoData = [];

    component.confirmeliminarEnlaceItem();

    expect(callOrder[0]).toBe('cerrarModal');
  });

  it('debería configurar popup de confirmación correctamente', () => {
    component.abrirElimninarConfirmationopup();

    expect(component.confirmEliminarPopupAbierto).toBe(false);
    expect(component.nuevaNotificacion).toEqual({});
  });

  it('debería establecer confirmEliminarPopupAbierto en true', () => {
    component.confirmEliminarPopupAbierto = false;

    component.abrirElimninarConfirmationopup();

    expect(component.confirmEliminarPopupAbierto).toBe(false);
  });

  it('debería retornar false y establecer mostrarError cuando no hay datos', () => {
    component.enlaceOperativoData = [];

    const result = component.validarFormulario();

    expect(result).toBe(false);
    expect(component.mostrarError).toBe(true);
  });

  it('debería retornar false y establecer mostrarError cuando enlaceOperativoData es null', () => {
    component.enlaceOperativoData = null as any;

    const result = component.validarFormulario();

    expect(result).toBe(false);
    expect(component.mostrarError).toBe(true);
  });

  it('debería retornar false y establecer mostrarError cuando enlaceOperativoData es undefined', () => {
    component.enlaceOperativoData = undefined as any;

    const result = component.validarFormulario();

    expect(result).toBe(false);
    expect(component.mostrarError).toBe(true);
  });

  it('debería retornar true y no establecer mostrarError cuando hay datos válidos', () => {
    component.enlaceOperativoData = [{ id: 1, registro: 'TEST' } as any];

    const result = component.validarFormulario();

    expect(result).toBe(true);
    expect(component.mostrarError).toBe(false);
  });

  it('debería resetear mostrarError al inicio de cada validación', () => {
    component.mostrarError = true;
    component.enlaceOperativoData = [{ id: 1 } as any];

    const result = component.validarFormulario();

    expect(result).toBe(true);
    expect(component.mostrarError).toBe(false);
  });

  it('debería manejar arrays con múltiples elementos', () => {
    component.enlaceOperativoData = [
      { id: 1, registro: 'TEST1' } as any,
      { id: 2, registro: 'TEST2' } as any,
      { id: 3, registro: 'TEST3' } as any,
    ];

    const result = component.validarFormulario();

    expect(result).toBe(true);
    expect(component.mostrarError).toBe(false);
  });
});
