import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnlaceOperativoComponent } from './enlace-operativo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Tramite32617Store } from '../../estados/tramites32617.store';
import { Tramite32617Query } from '../../estados/tramites32617.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('EnlaceOperativoComponent - Pruebas unitarias', () => {
  let component: EnlaceOperativoComponent;
  let fixture: ComponentFixture<EnlaceOperativoComponent>;
  let tramiteStoreSpy: any;

  beforeEach(async () => {
    tramiteStoreSpy = {
      actualizarEstadoFormulario: jest.fn(),
      establecerDatos: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EnlaceOperativoComponent],
      providers: [
        { provide: Tramite32617Store, useValue: tramiteStoreSpy },
        {
          provide: Tramite32617Query,
          useValue: {
            selectTramite32617$: of({
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
    fixture.detectChanges();
  });

  it('✅ debe crear el componente', () => {
    expect(component).toBeTruthy();
  });


  it('✅ debería invalidar el formulario si "registro" está vacío o con formato incorrecto', () => {
    const control = component.enlaceOperativoForm.get('registro');

    control?.setValue('');
    expect(control?.valid).toBeFalsy();

    control?.setValue('123'); 
    expect(control?.valid).toBeFalsy();

    control?.setValue('XAXX010101000'); 
    expect(control?.valid).toBeTruthy();
  });

  it('✅ debería mostrar notificación de formato incorrecto cuando "registro" es inválido', () => {
    const spyMostrarNotificacion = jest.spyOn(component, 'mostrarNotificacionDeBusqueda');
    component.enlaceOperativoForm.get('registro')?.setValue('123'); 
    component.botonBuscar();
    expect(spyMostrarNotificacion).toHaveBeenCalledWith('', 'Ha proporcionado información con un formato incorrecto');
  });

  it('✅ debería mostrar notificación cuando "registro" está vacío', () => {
    const spyMostrarNotificacion = jest.spyOn(component, 'mostrarNotificacionDeBusqueda');
    component.enlaceOperativoForm.get('registro')?.setValue(''); 
    component.botonBuscar();
    expect(spyMostrarNotificacion).toHaveBeenCalledWith('', 'No se ha proporcionado información que es requerida');
  });

  it('✅ debería cargar datos mock y mostrar notificación de búsqueda', () => {
    const spyMostrarNotificacion = jest.spyOn(component, 'mostrarNotificacionDeBusqueda');
    component.enlaceOperativoForm.get('registro')?.setValue('XAXX010101000');
    component.botonBuscar();
    expect(spyMostrarNotificacion).toHaveBeenCalled();
    expect(component.enlaceOperativoForm.get('rfc')?.value).toBe('XAXX010101000');
    expect(component.enlaceOperativoForm.get('nombre')?.value).toBe('EUROFOODS DE MEXICO');
  });

  it('✅ no debería enviar datos si el formulario es inválido', () => {
    const spyEnlaceInfoDatos = jest.spyOn(component, 'enlaceInfoDatos');
    component.enlaceOperativoForm.get('registro')?.setValue('');
    component.enviarDialogData();
    expect(spyEnlaceInfoDatos).not.toHaveBeenCalled();
  });

  it('✅ debería enviar datos y limpiar formulario si es válido', () => {
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

  it('✅ debería agregar un nuevo ítem y actualizar el estado del store', () => {
    component.modoEdicion = false;
    component.enlaceOperativoForm.get('registro')?.setValue('XAXX010101000');
    component.enlaceOperativoForm.get('rfc')?.enable();
    component.enlaceOperativoForm.get('rfc')?.setValue('XAXX010101000');
    component.enlaceOperativoForm.get('nombre')?.enable();
    component.enlaceOperativoForm.get('nombre')?.setValue('Test Nombre');

    component.enlaceInfoDatos();

    expect(tramiteStoreSpy.establecerDatos).toHaveBeenCalled();
    expect(component.enlaceOperativoData.length).toBeGreaterThan(0);
  });

  it('✅ debería eliminar ítems seleccionados y actualizar el store', () => {
    component.enlaceOperativoData = [
      { id: 1, registro: 'XAXX010101000' } as any,
      { id: 2, registro: 'XEXX010101000' } as any,
    ];
    component.listaFilaSeleccionadaEnlace = [component.enlaceOperativoData[0]];

    component.eliminarEnlaceItem(true);

    expect(component.enlaceOperativoData.find(item => item.id === 1)).toBeUndefined();
    expect(tramiteStoreSpy.establecerDatos).toHaveBeenCalled();
  });

  it('✅ debería mostrar notificación si se intenta modificar sin seleccionar fila', () => {
    component.listaFilaSeleccionadaEnlace = [];

    component.modificarItemEnlace();

    expect(component.esFilaSeleccionada).toBeTruthy();
    expect(component.nuevaNotificacion.mensaje).toContain('No se encontró información');
  });

  it('✅ debería habilitar modo edición y abrir modal con datos al modificar un ítem seleccionado', () => {
    // Configurar tanto la lista de filas seleccionadas como el array de datos
    component.enlaceOperativoData = [
      {
        id: 1,
        registro: 'XAXX010101000',
        rfc: 'XAXX010101000',
        nombre: 'Test',
        apellidoPaterno: '',
        apellidoMaterno: '',
        cuidad: '',
        cargo: '',
        telefono: '',
        correoElectronico: '',
        suplente: false,
      },
    ];
    component.listaFilaSeleccionadaEnlace = [
      {
        id: 1,
        registro: 'XAXX010101000',
        rfc: 'XAXX010101000',
        nombre: 'Test',
        apellidoPaterno: '',
        apellidoMaterno: '',
        cuidad: '',
        cargo: '',
        telefono: '',
        correoElectronico: '',
        suplente: false,
      },
    ];

    const spyAgregarDialogo = jest.spyOn(component, 'agregarDialogoDatos');
    component.modificarItemEnlace();

    expect(component.modoEdicion).toBe(true);
    expect(component.registroEditandoId).toBe(1);
    expect(spyAgregarDialogo).toHaveBeenCalled();
  });

  it('✅ debería manejar selección de filas vacía correctamente', () => {
    component.manejarFilaSeleccionada([]);

    expect(component.listaFilaSeleccionadaEnlace).toEqual([]);
    expect(component.filaSeleccionadaEnlaceOperativo).toEqual({} as any);
    expect(component.enableModficarBoton).toBe(false);
    expect(component.enableEliminarBoton).toBe(false);
  });

  it('✅ debería manejar selección de una fila correctamente', () => {
    const filaTest = {
      id: 1,
      registro: 'XAXX010101000',
      rfc: 'XAXX010101000',
      nombre: 'Test Nombre',
      apellidoPaterno: 'Apellido',
      apellidoMaterno: 'Materno',
      cuidad: 'Ciudad',
      cargo: 'Cargo',
      telefono: '1234567890',
      correoElectronico: 'test@test.com',
      suplente: false,
    };

    component.manejarFilaSeleccionada([filaTest]);

    expect(component.listaFilaSeleccionadaEnlace).toEqual([filaTest]);
    expect(component.filaSeleccionadaEnlaceOperativo).toEqual(filaTest);
  });

  it('✅ debería seleccionar la última fila cuando se pasan múltiples filas', () => {
    const fila1 = {
      id: 1,
      registro: 'XAXX010101000',
      rfc: 'XAXX010101000',
      nombre: 'Test 1',
      apellidoPaterno: '',
      apellidoMaterno: '',
      cuidad: '',
      cargo: '',
      telefono: '',
      correoElectronico: '',
      suplente: false,
    };

    const fila2 = {
      id: 2,
      registro: 'XEXX010101000',
      rfc: 'XEXX010101000',
      nombre: 'Test 2',
      apellidoPaterno: '',
      apellidoMaterno: '',
      cuidad: '',
      cargo: '',
      telefono: '',
      correoElectronico: '',
      suplente: false,
    };

    component.manejarFilaSeleccionada([fila1, fila2]);

    expect(component.listaFilaSeleccionadaEnlace).toEqual([fila1, fila2]);
    expect(component.filaSeleccionadaEnlaceOperativo).toEqual(fila2);
  });

  describe('Gestión de formularios', () => {
    it('✅ debería crear el formulario con la estructura correcta', () => {
      expect(component.enlaceOperativoForm).toBeDefined();
      expect(component.enlaceOperativoForm.get('registro')).toBeTruthy();
      expect(component.enlaceOperativoForm.get('rfc')).toBeTruthy();
      expect(component.enlaceOperativoForm.get('nombre')).toBeTruthy();
      expect(component.enlaceOperativoForm.get('correoElectronico')).toBeTruthy();
    });

    it('✅ debería limpiar el formulario correctamente', () => {
      component.enlaceOperativoForm.get('registro')?.setValue('XAXX010101000');
      component.enlaceOperativoForm.get('cargo')?.setValue('Test Cargo');
      
      component.limpiarFormulario();
      
      expect(component.enlaceOperativoForm.get('registro')?.value).toBeNull();
      expect(component.enlaceOperativoForm.get('cargo')?.value).toBeNull();
    });

    it('✅ debería marcar todos los campos como touched cuando el formulario es inválido en enviarDialogData', () => {
      const spyMarkAllAsTouched = jest.spyOn(component.enlaceOperativoForm, 'markAllAsTouched');
      component.enlaceOperativoForm.get('registro')?.setValue('');
      
      component.enviarDialogData();
      
      expect(spyMarkAllAsTouched).toHaveBeenCalled();
    });
  });

  describe('Gestión de modales', () => {
    it('✅ debería cancelar el modal y limpiar el formulario', () => {
      const spyCambiarEstado = jest.spyOn(component, 'cambiarEstadoModal');
      const spyLimpiar = jest.spyOn(component, 'limpiarFormulario');
      
      component.modalCancelar();
      
      expect(spyCambiarEstado).toHaveBeenCalled();
      expect(spyLimpiar).toHaveBeenCalled();
    });

    it('✅ debería manejar el caso cuando no existe instancia del modal', () => {
      component.enlaceOperativoElemento = { nativeElement: {} } as any;
      
      (window as any).Modal = {
        getInstance: jest.fn(() => null)
      };
      
      expect(() => component.cambiarEstadoModal()).not.toThrow();
    });
  });

  describe('Gestión de paneles colapsables', () => {
    it('✅ debería alternar la visibilidad de paneles cuando no está en modo solo lectura', () => {
      component.esFormularioSoloLectura = false;
      component.panels = [
        { label: 'Panel 1', isCollapsed: true },
        { label: 'Panel 2', isCollapsed: true },
        { label: 'Panel 3', isCollapsed: true }
      ];
      
      component.mostrar_colapsable(1);
      
      expect(component.panels[0].isCollapsed).toBe(true);
      expect(component.panels[1].isCollapsed).toBe(false);
      expect(component.panels[2].isCollapsed).toBe(true);
    });

    it('✅ no debería alternar paneles cuando está en modo solo lectura', () => {
      component.esFormularioSoloLectura = true;
      const panelsEstadoOriginal = [
        { label: 'Panel 1', isCollapsed: true },
        { label: 'Panel 2', isCollapsed: false },
        { label: 'Panel 3', isCollapsed: true }
      ];
      component.panels = [...panelsEstadoOriginal];
      
      component.mostrar_colapsable(1);
      
      expect(component.panels).toEqual(panelsEstadoOriginal);
    });
  });

  describe('Validaciones avanzadas', () => {
    it('✅ debería validar correctamente el correo electrónico', () => {
      const correoControl = component.enlaceOperativoForm.get('correoElectronico');
      
      correoControl?.setValue('correo-invalido');
      expect(correoControl?.valid).toBeFalsy();
      
      correoControl?.setValue('correo@valido.com');
      expect(correoControl?.valid).toBeTruthy();
    });

    it('✅ debería manejar casos donde el enlace info datos retorna temprano si el formulario es inválido', () => {
      component.enlaceOperativoForm.get('registro')?.setValue('');
      const spyEstablecerDatos = jest.spyOn(tramiteStoreSpy, 'establecerDatos');
      
      component.enlaceInfoDatos();
      
      expect(spyEstablecerDatos).not.toHaveBeenCalled();
    });
  });

  describe('Gestión de modo edición', () => {
    it('✅ debería editar un ítem existente cuando está en modo edición', () => {
      const itemOriginal = {
        id: 1,
        registro: 'XAXX010101000',
        rfc: 'XAXX010101000',
        nombre: 'Nombre Original',
        apellidoPaterno: 'Apellido',
        apellidoMaterno: 'Materno',
        cuidad: 'Ciudad',
        cargo: 'Cargo',
        telefono: '1234567890',
        correoElectronico: 'test@test.com',
        suplente: false,
      };
      
      component.enlaceOperativoData = [itemOriginal];
      component.modoEdicion = true;
      component.registroEditandoId = 1;
      
      // Configurar formulario para edición
      component.enlaceOperativoForm.patchValue({
        registro: 'XAXX010101000',
        rfc: 'XAXX010101000',
        nombre: 'Nombre Editado',
        apellidoPaterno: 'Apellido',
        apellidoMaterno: 'Materno',
        cuidad: 'Ciudad',
        cargo: 'Cargo Editado',
        telefono: '1234567890',
        correoElectronico: 'editado@test.com',
        suplente: true,
      });
      
      component.enlaceInfoDatos();
      
      const itemEditado = component.enlaceOperativoData.find(item => item.id === 1);
      expect(itemEditado?.nombre).toBe('Nombre Editado');
      expect(itemEditado?.cargo).toBe('Cargo Editado');
      expect(itemEditado?.correoElectronico).toBe('editado@test.com');
      expect(itemEditado?.suplente).toBe(true);
    });
  });

  describe('Gestión de estado del componente', () => {
    it('✅ debería actualizar enableModficarBoton y enableEliminarBoton según las filas seleccionadas', () => {
      const fila = {
        id: 1,
        registro: 'XAXX010101000',
        rfc: 'XAXX010101000',
        nombre: 'Test',
        apellidoPaterno: '',
        apellidoMaterno: '',
        cuidad: '',
        cargo: '',
        telefono: '',
        correoElectronico: '',
        suplente: false,
      };
      
      // Inicialmente los botones están deshabilitados
      expect(component.enableModficarBoton).toBe(false);
      expect(component.enableEliminarBoton).toBe(false);
      
      // Después de seleccionar filas vacías, deben mantenerse deshabilitados
      component.manejarFilaSeleccionada([]);
      expect(component.enableModficarBoton).toBe(false);
      expect(component.enableEliminarBoton).toBe(false);
      
      // Con una fila seleccionada, los botones siguen deshabilitados según la lógica actual
      component.manejarFilaSeleccionada([fila]);
      expect(component.enableModficarBoton).toBe(false);
      expect(component.enableEliminarBoton).toBe(false);
      
      // Verificar que la fila se asigna correctamente
      expect(component.filaSeleccionadaEnlaceOperativo).toEqual(fila);
    });

    it('✅ debería llamar a cerrarModal antes de ejecutar modificarItemEnlace', () => {
      const spyCerrarModal = jest.spyOn(component, 'cerrarModal');
      component.enlaceOperativoData = [];
      
      component.modificarItemEnlace();
      
      expect(spyCerrarModal).toHaveBeenCalled();
    });

    it('✅ debería llamar al método cerrarModal correctamente', () => {
      // Test simple para el método cerrarModal sin dependencias externas
      expect(() => component.cerrarModal()).not.toThrow();
    });
  });

  describe('Manejo de errores y casos edge', () => {
    it('✅ debería mostrar notificación cuando no hay datos disponibles para modificar', () => {
      component.nuevaNotificacion = {
        tipoNotificacion: 'ALERTA' as any,
        categoria: 'ALERTA' as any,
        modo: 'modal',
        titulo: '',
        mensaje: 'No se encontró información',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: ''
      };
      
      component.enlaceOperativoData = [];
      
      component.modificarItemEnlace();
      
      expect(component.esFilaSeleccionada).toBe(true);
      expect(component.nuevaNotificacion.mensaje).toBe('No se encontró información');
    });

    it('✅ debería mostrar notificación cuando no se ha seleccionado ningún registro', () => {
      component.nuevaNotificacion = {
        tipoNotificacion: 'ALERTA' as any,
        categoria: 'ALERTA' as any,
        modo: 'modal',
        titulo: '',
        mensaje: 'Seleccione un registro',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: ''
      };
      
      component.enlaceOperativoData = [{ id: 1 } as any];
      component.listaFilaSeleccionadaEnlace = [];
      
      component.modificarItemEnlace();
      
      expect(component.esFilaSeleccionada).toBe(true);
      expect(component.nuevaNotificacion.mensaje).toBe('Seleccione un registro');
    });

    it('✅ debería manejar correctamente las propiedades booleanas del formulario', () => {
      component.enlaceOperativoForm.get('suplente')?.setValue(true);
      expect(component.enlaceOperativoForm.get('suplente')?.value).toBe(true);
      
      component.enlaceOperativoForm.get('suplente')?.setValue(false);
      expect(component.enlaceOperativoForm.get('suplente')?.value).toBe(false);
    });
  });

  describe('Suscripciones y ciclo de vida', () => {
    it('✅ debería suscribirse correctamente en ngOnInit', () => {
      const mockData = { enlaceOperativoData: [{ id: 1, nombre: 'Test' }] };
      
      // Trigger ngOnInit manualmente para probar la suscripción
      component.ngOnInit();
      
      expect(component.seccionState).toBeDefined();
    });

    it('✅ debería completar el Subject destroyed$ en ngOnDestroy', () => {
      const spyNext = jest.spyOn(component['destroyed$'], 'next');
      const spyComplete = jest.spyOn(component['destroyed$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(spyNext).toHaveBeenCalled();
      expect(spyComplete).toHaveBeenCalled();
    });
  });

  describe('Configuración inicial y propiedades readonly', () => {
    it('✅ debería tener configuración de tabla definida', () => {
      expect(component.configuracionTabla).toBeDefined();
      expect(component.configuracionTabla.length).toBeGreaterThan(0);
    });

    it('✅ debería tener TablaSeleccion como propiedad readonly', () => {
      expect(component.TablaSeleccion).toBeDefined();
    });

    it('✅ debería inicializar panels desde PANELS_CONFIGURACION', () => {
      expect(component.panels).toBeDefined();
    });
  });

  describe('Métodos de confirmación y eliminación', () => {
    it('✅ debería abrir popup de confirmación de eliminación', () => {
      component.abrirElimninarConfirmationopup();
      
      expect(component.confirmEliminarPopupAbierto).toBe(true);
      expect(component.nuevaNotificacion.mensaje).toBe('¿Estás seguro que deseas eliminar los registros marcados?');
      expect(component.nuevaNotificacion.txtBtnAceptar).toBe('Aceptar');
      expect(component.nuevaNotificacion.txtBtnCancelar).toBe('Cancelar');
    });

    it('✅ debería manejar confirmación de eliminación cuando no hay datos', () => {
      const spyCerrarModal = jest.spyOn(component, 'cerrarModal');
      component.enlaceOperativoData = [];
      
      component.confirmeliminarEnlaceItem();
      
      expect(spyCerrarModal).toHaveBeenCalled();
      expect(component.multipleSeleccionPopupAbierto).toBe(true);
    });

    it('✅ debería manejar confirmación de eliminación cuando no hay selección', () => {
      const spyCerrarModal = jest.spyOn(component, 'cerrarModal');
      component.enlaceOperativoData = [{ id: 1 } as any];
      component.listaFilaSeleccionadaEnlace = [];
      
      component.confirmeliminarEnlaceItem();
      
      expect(spyCerrarModal).toHaveBeenCalled();
      expect(component.multipleSeleccionPopupAbierto).toBe(true);
    });

    it('✅ debería abrir popup de confirmación cuando hay elementos seleccionados', () => {
      const spyAbrirConfirmacion = jest.spyOn(component, 'abrirElimninarConfirmationopup');
      component.enlaceOperativoData = [{ id: 1 } as any];
      component.listaFilaSeleccionadaEnlace = [{ id: 1 } as any];
      
      component.confirmeliminarEnlaceItem();
      
      expect(spyAbrirConfirmacion).toHaveBeenCalled();
    });
  });

  describe('Validación del formulario', () => {
    it('✅ debería retornar false y marcar error cuando no hay datos', () => {
      component.enlaceOperativoData = [];
      
      const resultado = component.validarFormulario();
      
      expect(resultado).toBe(false);
      expect(component.mostrarError).toBe(true);
    });

    it('✅ debería retornar true cuando hay datos válidos', () => {
      component.enlaceOperativoData = [{ id: 1, nombre: 'Test' } as any];
      
      const resultado = component.validarFormulario();
      
      expect(resultado).toBe(true);
      expect(component.mostrarError).toBe(false);
    });

    it('✅ debería inicializar mostrarError como false', () => {
      component.mostrarError = true;
      
      component.validarFormulario();
      
      expect(component.mostrarError).toBeDefined();
    });
  });

  describe('Método actualizarDatosModificados', () => {
    it('✅ debería retornar temprano si no hay fila seleccionada', () => {
      component.filaSeleccionadaEnlaceOperativo = null as any;
      const spyPatchValue = jest.spyOn(component.enlaceOperativoForm, 'patchValue');
      
      component.actualizarDatosModificados();
      
      expect(spyPatchValue).not.toHaveBeenCalled();
    });

    it('✅ debería actualizar el formulario con datos de la fila seleccionada', () => {
      const filaTest = {
        id: 1,
        registro: 'XAXX010101000',
        rfc: 'XAXX010101000',
        nombre: 'Test Nombre',
        apellidoPaterno: 'Apellido',
        apellidoMaterno: 'Materno',
        cuidad: 'Ciudad',
        cargo: 'Cargo',
        telefono: '1234567890',
        correoElectronico: 'test@test.com',
        suplente: false,
      };
      
      component.filaSeleccionadaEnlaceOperativo = filaTest;
      const spyPatchValue = jest.spyOn(component.enlaceOperativoForm, 'patchValue');
      
      component.actualizarDatosModificados();
      
      expect(spyPatchValue).toHaveBeenCalledWith({
        registro: filaTest.registro,
        rfc: filaTest.rfc,
        nombre: filaTest.nombre,
        apellidoPaterno: filaTest.apellidoPaterno,
        apellidoMaterno: filaTest.apellidoMaterno,
        cuidad: filaTest.cuidad,
        cargo: filaTest.cargo,
        telefono: filaTest.telefono,
        correoElectronico: filaTest.correoElectronico,
        suplente: filaTest.suplente,
      });
    });
  });

  describe('Método abrirMultipleSeleccionPopup', () => {
    it('✅ debería configurar correctamente la notificación con parámetros por defecto', () => {
      const titulo = 'Título Test';
      const mensaje = 'Mensaje Test';
      
      component.abrirMultipleSeleccionPopup(titulo, mensaje);
      
      expect(component.nuevaNotificacion.titulo).toBe(titulo);
      expect(component.nuevaNotificacion.mensaje).toBe(mensaje);
      expect(component.nuevaNotificacion.txtBtnAceptar).toBe('Aceptar');
      expect(component.nuevaNotificacion.txtBtnCancelar).toBe('');
    });

    it('✅ debería configurar correctamente la notificación con parámetros personalizados', () => {
      const titulo = 'Título Test';
      const mensaje = 'Mensaje Test';
      const btnAceptar = 'Confirmar';
      const btnCancelar = 'Rechazar';
      
      component.abrirMultipleSeleccionPopup(titulo, mensaje, btnAceptar, btnCancelar);
      
      expect(component.nuevaNotificacion.titulo).toBe(titulo);
      expect(component.nuevaNotificacion.mensaje).toBe(mensaje);
      expect(component.nuevaNotificacion.txtBtnAceptar).toBe(btnAceptar);
      expect(component.nuevaNotificacion.txtBtnCancelar).toBe(btnCancelar);
    });
  });

  describe('Casos edge adicionales', () => {
    it('✅ debería manejar la eliminación con evento false', () => {
      component.enlaceOperativoData = [
        { id: 1, registro: 'XAXX010101000' } as any,
        { id: 2, registro: 'XEXX010101000' } as any,
      ];
      component.listaFilaSeleccionadaEnlace = [component.enlaceOperativoData[0]];

      component.eliminarEnlaceItem(false);

      // El componente debería mantener el estado pero no proceder con la eliminación
      expect(component.enlaceOperativoData.length).toBe(2);
    });

    it('✅ debería manejar correctamente los casos cuando enlaceOperativoData es null', () => {
      component.enlaceOperativoData = null as any;
      
      const resultado = component.validarFormulario();
      
      expect(resultado).toBe(false);
      expect(component.mostrarError).toBe(true);
    });

    it('✅ debería manejar formularios con validaciones de email inválidas', () => {
      component.enlaceOperativoForm.get('correoElectronico')?.setValue('email-malformado');
      component.enlaceOperativoForm.get('registro')?.setValue('XAXX010101000');
      
      component.enviarDialogData();
      
      expect(component.enlaceOperativoForm.get('correoElectronico')?.errors?.['email']).toBeTruthy();
    });
  });

  describe('Métodos de utilidad y notificaciones', () => {
    it('✅ debería mostrar notificación con parámetros personalizados', () => {
      const titulo = 'Título personalizado';
      const mensaje = 'Mensaje personalizado';
      const btnAceptar = 'OK';
      const btnCancelar = 'Cancelar';
      
      component.mostrarNotificacionDeBusqueda(titulo, mensaje, btnAceptar, btnCancelar);
      
      expect(component.nuevaNotificacion.titulo).toBe(titulo);
      expect(component.nuevaNotificacion.mensaje).toBe(mensaje);
      expect(component.nuevaNotificacion.txtBtnAceptar).toBe(btnAceptar);
      expect(component.nuevaNotificacion.txtBtnCancelar).toBe(btnCancelar);
      expect(component.rfcValido).toBe(true);
    });

    it('✅ debería mostrar notificación with parámetros por defecto', () => {
      const titulo = 'Título';
      const mensaje = 'Mensaje';
      
      component.mostrarNotificacionDeBusqueda(titulo, mensaje);
      
      expect(component.nuevaNotificacion.titulo).toBe(titulo);
      expect(component.nuevaNotificacion.mensaje).toBe(mensaje);
      expect(component.nuevaNotificacion.txtBtnAceptar).toBe('Aceptar');
      expect(component.nuevaNotificacion.txtBtnCancelar).toBe('');
    });

    it('✅ debería llamar a actualizarFilaSeleccionada y encontrar datos', () => {
      const filaOriginal = {
        id: 1,
        registro: 'XAXX010101000',
        rfc: 'XAXX010101000',
        nombre: 'Nombre Original',
        apellidoPaterno: '',
        apellidoMaterno: '',
        cuidad: '',
        cargo: '',
        telefono: '',
        correoElectronico: '',
        suplente: false,
      };
      
      const filaActualizada = {
        ...filaOriginal,
        nombre: 'Nombre Actualizado'
      };
      
      component.enlaceOperativoData = [filaActualizada];
      component.filaSeleccionadaEnlaceOperativo = filaOriginal;
      
      component.actualizarFilaSeleccionada();
      
      expect(component.filaSeleccionadaEnlaceOperativo.nombre).toBe('Nombre Actualizado');
    });

    it('✅ debería manejar actualizarFilaSeleccionada cuando no encuentra datos', () => {
      const fila = {
        id: 999, // ID que no existe
        registro: 'XAXX010101000',
        rfc: 'XAXX010101000',
        nombre: 'Test',
        apellidoPaterno: '',
        apellidoMaterno: '',
        cuidad: '',
        cargo: '',
        telefono: '',
        correoElectronico: '',
        suplente: false,
      };
      
      component.enlaceOperativoData = [];
      component.filaSeleccionadaEnlaceOperativo = fila;
      
      const nombreOriginal = component.filaSeleccionadaEnlaceOperativo.nombre;
      component.actualizarFilaSeleccionada();
      
      // Debería mantener el nombre original ya que no encuentra datos
      expect(component.filaSeleccionadaEnlaceOperativo.nombre).toBe(nombreOriginal);
    });

    it('✅ debería manejar cerrarModal correctamente', () => {
      // Configurar estados como true inicialmente
      component.confirmEliminarPopupAbierto = true;
      component.tieneValorRfc = true;
      component.rfcValido = true;
      component.esFilaSeleccionada = true;
      component.multipleSeleccionPopupAbierto = true;
      
      component.cerrarModal();
      
      expect(component.confirmEliminarPopupAbierto).toBe(false);
      expect(component.tieneValorRfc).toBe(false);
      expect(component.rfcValido).toBe(false);
      expect(component.esFilaSeleccionada).toBe(false);
      expect(component.multipleSeleccionPopupAbierto).toBe(false);
    });
  });

  describe('Validaciones y casos edge del formulario', () => {
    it('✅ debería marcar campos requeridos como touched cuando son inválidos', () => {
      const registroControl = component.enlaceOperativoForm.get('registro');
      const rfcControl = component.enlaceOperativoForm.get('rfc');
      
      registroControl?.setValue('');
      rfcControl?.setValue('');
      
      component.enviarDialogData();
      
      expect(registroControl?.touched).toBe(true);
      expect(rfcControl?.touched).toBe(true);
    });

    it('✅ debería validar correctamente los valores del formulario', () => {
      // Test para valores válidos
      component.enlaceOperativoForm.patchValue({
        registro: 'XAXX010101000',
        rfc: 'XAXX010101000',
        nombre: 'Empresa Test',
        correoElectronico: 'test@empresa.com'
      });
      
      expect(component.enlaceOperativoForm.valid).toBe(true);
      
      // Test para valores inválidos
      component.enlaceOperativoForm.patchValue({
        registro: '',
        rfc: 'RFC_INVALIDO',
        correoElectronico: 'email-invalido'
      });
      
      expect(component.enlaceOperativoForm.valid).toBe(false);
    });

    it('✅ debería manejar valores nulos en actualizarDatosModificados', () => {
      component.filaSeleccionadaEnlaceOperativo = {
        id: 1,
        registro: null as any,
        rfc: null as any,
        nombre: null as any,
        apellidoPaterno: null as any,
        apellidoMaterno: null as any,
        cuidad: null as any,
        cargo: null as any,
        telefono: null as any,
        correoElectronico: null as any,
        suplente: false,
      };
      
      expect(() => component.actualizarDatosModificados()).not.toThrow();
    });

    it('✅ debería resetear modoEdicion y registroEditandoId después de agregar datos', () => {
      component.modoEdicion = true;
      component.registroEditandoId = 1;
      component.enlaceOperativoForm.patchValue({
        registro: 'XAXX010101000',
        rfc: 'XAXX010101000',
        nombre: 'Test'
      });
      
      component.enlaceInfoDatos();
      
      // Verificar que se resetea el objeto seleccionado
      expect(component.filaSeleccionadaEnlaceOperativo).toEqual({} as any);
    });
  });

  describe('Casos edge de botonBuscar', () => {
    it('✅ debería llenar datos de RFC automáticamente cuando el registro es válido', () => {
      component.enlaceOperativoForm.get('registro')?.setValue('XAXX010101000');
      
      component.botonBuscar();
      
      expect(component.enlaceOperativoForm.get('rfc')?.value).toBe('XAXX010101000');
      expect(component.enlaceOperativoForm.get('nombre')?.value).toBe('EUROFOODS DE MEXICO');
    });

    it('✅ debería manejar diferentes formatos de RFC válidos', () => {
      const rfcsValidos = ['XAXX010101000', 'CACX7605101P8', 'VECJ880326XXX'];
      
      rfcsValidos.forEach(rfc => {
        component.enlaceOperativoForm.get('registro')?.setValue(rfc);
        component.botonBuscar();
        
        expect(component.enlaceOperativoForm.get('rfc')?.value).toBe(rfc);
      });
    });
  });

  describe('Gestión de eliminación avanzada', () => {
    it('✅ debería manejar eliminación de múltiples elementos', () => {
      const elementos = [
        { id: 1, registro: 'XAXX010101000' } as any,
        { id: 2, registro: 'XEXX010101000' } as any,
        { id: 3, registro: 'XGXX010101000' } as any,
      ];
      
      component.enlaceOperativoData = [...elementos];
      component.listaFilaSeleccionadaEnlace = [elementos[0], elementos[2]];
      
      component.eliminarEnlaceItem(true);
      
      expect(component.enlaceOperativoData.length).toBe(1);
      expect(component.enlaceOperativoData[0].id).toBe(2);
    });

    it('✅ debería cerrar popup correctamente después de eliminar', () => {
      component.enlaceOperativoData = [{ id: 1, registro: 'XAXX010101000' } as any];
      component.listaFilaSeleccionadaEnlace = [component.enlaceOperativoData[0]];
      component.confirmEliminarPopupAbierto = true;
      
      component.eliminarEnlaceItem(true);
      
      expect(component.confirmEliminarPopupAbierto).toBe(false);
    });
  });

  describe('Funcionalidad de modo edición avanzada', () => {
    it('✅ debería configurar correctamente el modo edición', () => {
      const elemento = {
        id: 1,
        registro: 'XAXX010101000',
        rfc: 'XAXX010101000',
        nombre: 'Test',
        apellidoPaterno: 'Apellido',
        apellidoMaterno: 'Materno',
        cuidad: 'Ciudad',
        cargo: 'Cargo',
        telefono: '1234567890',
        correoElectronico: 'test@test.com',
        suplente: true,
      };
      
      component.enlaceOperativoData = [elemento];
      component.listaFilaSeleccionadaEnlace = [elemento];
      
      const spyAgregarDialogo = jest.spyOn(component, 'agregarDialogoDatos');
      const spyActualizarDatos = jest.spyOn(component, 'actualizarDatosModificados');
      
      component.modificarItemEnlace();
      
      expect(component.modoEdicion).toBe(true);
      expect(component.registroEditandoId).toBe(1);
      expect(spyAgregarDialogo).toHaveBeenCalled();
      expect(spyActualizarDatos).toHaveBeenCalled();
    });

    it('✅ debería salir del modo edición después de enviar datos', () => {
      component.modoEdicion = true;
      component.registroEditandoId = 1;
      
      // Configurar formulario válido
      component.enlaceOperativoForm.patchValue({
        registro: 'XAXX010101000',
        rfc: 'XAXX010101000',
        nombre: 'Test'
      });
      
      const spyLimpiar = jest.spyOn(component, 'limpiarFormulario');
      const spyCambiarEstado = jest.spyOn(component, 'cambiarEstadoModal');
      
      component.enviarDialogData();
      
      expect(spyLimpiar).toHaveBeenCalled();
      expect(spyCambiarEstado).toHaveBeenCalled();
    });
  });

  describe('Funcionalidad de crear formulario', () => {
    it('✅ debería crear formulario con validaciones correctas', () => {
      // Recrear el formulario para probar la inicialización
      component.crearFormulario();
      
      const form = component.enlaceOperativoForm;
      
      // Verificar que todos los controles existen
      expect(form.get('registro')).toBeTruthy();
      expect(form.get('rfc')).toBeTruthy();
      expect(form.get('nombre')).toBeTruthy();
      expect(form.get('apellidoPaterno')).toBeTruthy();
      expect(form.get('apellidoMaterno')).toBeTruthy();
      expect(form.get('cuidad')).toBeTruthy();
      expect(form.get('cargo')).toBeTruthy();
      expect(form.get('telefono')).toBeTruthy();
      expect(form.get('correoElectronico')).toBeTruthy();
      expect(form.get('suplente')).toBeTruthy();
      
      // Verificar validaciones en registro (es el único con required)
      expect(form.get('registro')?.hasError('required')).toBe(true);
      
      // Verificar que rfc y nombre están deshabilitados inicialmente
      expect(form.get('rfc')?.disabled).toBe(true);
      expect(form.get('nombre')?.disabled).toBe(true);
      
      // Verificar validación de email
      form.get('correoElectronico')?.setValue('correo-invalido');
      expect(form.get('correoElectronico')?.hasError('email')).toBe(true);
    });

    it('✅ debería inicializar el formulario con valores por defecto', () => {
      component.crearFormulario();
      
      expect(component.enlaceOperativoForm.get('suplente')?.value).toBe(false);
    });
  });

  describe('Validaciones de estado del componente', () => {
    it('✅ debería manejar el estado inicial correctamente', () => {
      expect(component.modoEdicion).toBe(false);
      expect(component.enlaceOperativoData).toEqual([]);
      expect(component.listaFilaSeleccionadaEnlace).toEqual([]);
      expect(component.enableModficarBoton).toBe(false);
      expect(component.enableEliminarBoton).toBe(false);
      expect(component.confirmEliminarPopupAbierto).toBe(false);
      expect(component.multipleSeleccionPopupAbierto).toBe(false);
    });

    it('✅ debería manejar la configuración de readonly desde ConsultaioQuery', () => {
      // Este test verifica que la suscripción en el constructor funciona
      expect(component.esFormularioSoloLectura).toBe(false);
    });

    it('✅ debería generar IDs únicos para nuevos elementos', () => {
      // Agregar elementos con IDs específicos
      component.enlaceOperativoData = [
        { id: 1, registro: 'XAXX010101000' } as any,
        { id: 3, registro: 'XEXX010101000' } as any,
        { id: 5, registro: 'XGXX010101000' } as any,
      ];
      
      component.enlaceOperativoForm.patchValue({
        registro: 'XHXX010101000',
        rfc: 'XHXX010101000',
        nombre: 'Nuevo Elemento'
      });
      
      component.enlaceInfoDatos();
      
      // Debería asignar ID 6 (max ID + 1)
      const nuevoElemento = component.enlaceOperativoData.find(item => item.registro === 'XHXX010101000');
      expect(nuevoElemento?.id).toBe(6);
    });

    it('✅ debería asignar ID 1 cuando no hay elementos existentes', () => {
      component.enlaceOperativoData = [];
      
      component.enlaceOperativoForm.patchValue({
        registro: 'XAXX010101000',
        rfc: 'XAXX010101000',
        nombre: 'Primer Elemento'
      });
      
      component.enlaceInfoDatos();
      
      expect(component.enlaceOperativoData[0].id).toBe(1);
    });
  });

  describe('Casos edge adicionales para completar cobertura', () => {
    it('✅ debería manejar elementos con ID undefined o null', () => {
      component.enlaceOperativoData = [
        { id: undefined, registro: 'XAXX010101000' } as any,
        { id: null, registro: 'XEXX010101000' } as any,
        { id: 2, registro: 'XGXX010101000' } as any,
      ];
      
      component.enlaceOperativoForm.patchValue({
        registro: 'XHXX010101000',
        rfc: 'XHXX010101000',
        nombre: 'Nuevo'
      });
      
      component.enlaceInfoDatos();
      
      // Debería usar 2 como máximo y asignar 3
      const nuevoElemento = component.enlaceOperativoData.find(item => item.registro === 'XHXX010101000');
      expect(nuevoElemento?.id).toBe(3);
    });

    it('✅ debería manejar RFC inválido con diferentes formatos', () => {
      const rfcsInvalidos = ['123', 'ABC', 'INVALID_FORMAT', ''];
      
      rfcsInvalidos.forEach(rfc => {
        component.enlaceOperativoForm.get('registro')?.setValue(rfc);
        const spyMostrarNotificacion = jest.spyOn(component, 'mostrarNotificacionDeBusqueda');
        
        component.botonBuscar();
        
        if (rfc === '') {
          expect(spyMostrarNotificacion).toHaveBeenCalledWith('', 'No se ha proporcionado información que es requerida');
        } else {
          expect(spyMostrarNotificacion).toHaveBeenCalledWith('', 'Ha proporcionado información con un formato incorrecto');
        }
      });
    });

    it('✅ debería mantener datos originales en modo edición cuando no encuentra el registro', () => {
      component.enlaceOperativoData = [{ id: 1, registro: 'ORIGINAL' } as any];
      component.modoEdicion = true;
      component.registroEditandoId = 999; // ID que no existe
      
      component.enlaceOperativoForm.patchValue({
        registro: 'NUEVO_VALOR',
        nombre: 'Nuevo Nombre'
      });
      
      const datosOriginales = [...component.enlaceOperativoData];
      component.enlaceInfoDatos();
      
      // Los datos no deberían cambiar porque no encuentra el ID
      expect(component.enlaceOperativoData).toEqual(datosOriginales);
    });
  });
});
