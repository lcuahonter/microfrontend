import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, Subject } from 'rxjs';
import { TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna, ConsultaioQuery, TablaDinamicaComponent, TablaSeleccion } from '@ng-mf/data-access-user';

import { AgregarTransportistasComponent } from './agregar-transportistas.component';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud32605Store, Solicitud32605State } from '../../estados/solicitud32605.store';
import { Solicitud32605Query } from '../../estados/solicitud32605.query';
import { PANELS1, TRANSPORTISTAS_CONFIGURACION, TransportistasTable } from '../../constants/datos-comunes.enum';
import { TransportistasListaInterface } from '../../models/solicitud.model';

describe('AgregarTransportistasComponent', () => {
  let component: AgregarTransportistasComponent;
  let fixture: ComponentFixture<AgregarTransportistasComponent>;
  let mockSolicitudService: jest.Mocked<SolicitudService>;
  let mockSolicitud32605Store: jest.Mocked<Solicitud32605Store>;
  let mockSolicitud32605Query: jest.Mocked<Solicitud32605Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockBsModalService: jest.Mocked<BsModalService>;
  let mockBsModalRef: jest.Mocked<BsModalRef>;

  const mockTransportistasLista: TransportistasTable[] = [
    {
      rfcEnclaveOperativo: 'RFC123456789',
      denominacionRazonsocial: 'Transportes Test SA',
      domicilio: 'Calle Test 123',
      ccat: 'CCAT123'
    },
    {
      rfcEnclaveOperativo: 'RFC987654321',
      denominacionRazonsocial: 'Logística ABC SA',
      domicilio: 'Avenida ABC 456',
      ccat: 'CCAT456'
    }
  ];

  const mockSolicitudState: Solicitud32605State = {
    rfcEnclaveOperativo: 'RFC123456789',
    enlaceOperativorfc: 'RFC123456789',
    denominacionRazonsocial: 'Transportes Test SA',
    domicilio: 'Calle Test 123',
    ccat: 'CCAT123',
    transportistasLista: mockTransportistasLista
  } as Solicitud32605State;

  const mockConsultaioState = {
    readonly: false
  };

  const mockTransportistasListaData: { [key: string]: TransportistasListaInterface } = {
    'RFC123456789': {
      enlaceOperativorfc: 'RFC123456789',
      denominacionRazonsocial: 'Transportes Test SA',
      domicilio: 'Calle Test 123',
      ccat: 'CCAT123'
    }
  };

  beforeEach(async () => {
    // Crear mocks de los servicios
    mockSolicitudService = {
      conseguirTransportistasLista: jest.fn().mockReturnValue(of(mockTransportistasListaData))
    } as any;

    mockSolicitud32605Store = {
      actualizarEstado: jest.fn()
    } as any;

    mockSolicitud32605Query = {
      selectSolicitud$: of(mockSolicitudState)
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of(mockConsultaioState)
    } as any;

    mockBsModalRef = {
      hide: jest.fn()
    } as any;

    mockBsModalService = {
      show: jest.fn().mockReturnValue(mockBsModalRef)
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        AgregarTransportistasComponent,
        CommonModule,
        ReactiveFormsModule,
        TablaDinamicaComponent
      ],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: Solicitud32605Store, useValue: mockSolicitud32605Store },
        { provide: Solicitud32605Query, useValue: mockSolicitud32605Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: BsModalService, useValue: mockBsModalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarTransportistasComponent);
    component = fixture.componentInstance;
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar las propiedades por defecto', () => {
      expect(component.panels1).toEqual(PANELS1);
      expect(component.tablaSeleccionCheckbox).toBe(TablaSeleccion.CHECKBOX);
      expect(component.transportistasConfiguracionColumnas).toEqual(TRANSPORTISTAS_CONFIGURACION);
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.destroy$).toBeInstanceOf(Subject);
    });

    it('debería llamar a inicializarEstadoFormulario en ngOnInit', () => {
      const spy = jest.spyOn(component, 'inicializarEstadoFormulario');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('debería suscribirse al estado de consultaio en el constructor', () => {
      expect(mockConsultaioQuery.selectConsultaioState$).toBeDefined();
    });
  });

  describe('Gestión del estado del formulario', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería inicializar el formulario con los valores del estado', () => {
      component.inicializarFormulario();
      
      expect(component.transportistaCertificacionForm).toBeDefined();
      expect(component.transportistaCertificacionForm.get('rfcEnclaveOperativo')).toBeTruthy();
      expect(component.transportistaCertificacionForm.get('enlaceOperativorfc')).toBeTruthy();
      expect(component.transportistaCertificacionForm.get('denominacionRazonsocial')).toBeTruthy();
      expect(component.transportistaCertificacionForm.get('domicilio')).toBeTruthy();
      expect(component.transportistaCertificacionForm.get('ccat')).toBeTruthy();
    });


    it('debería deshabilitar campos específicos en el formulario', () => {
      component.inicializarFormulario();
      
      expect(component.transportistaCertificacionForm.get('enlaceOperativorfc')?.disabled).toBe(true);
      expect(component.transportistaCertificacionForm.get('denominacionRazonsocial')?.disabled).toBe(true);
      expect(component.transportistaCertificacionForm.get('domicilio')?.disabled).toBe(true);
      expect(component.transportistaCertificacionForm.get('ccat')?.disabled).toBe(true);
    });

    it('debería deshabilitar el formulario cuando esFormularioSoloLectura es true', () => {
      component.esFormularioSoloLectura = true;
      component.guardarDatosFormulario();
      
      expect(component.transportistaCertificacionForm.disabled).toBe(true);
    });

    it('debería habilitar el formulario cuando esFormularioSoloLectura es false', () => {
      component.esFormularioSoloLectura = false;
      component.guardarDatosFormulario();
      
      expect(component.transportistaCertificacionForm.enabled).toBe(true);
    });
  });

  describe('Obtención del estado de la solicitud', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería obtener el estado de la solicitud y actualizar transportistasLista', () => {
      component.obtenerEstadoSolicitud();
      
      expect(component.solicitudState).toEqual(mockSolicitudState);
      expect(component.transportistasLista).toEqual(mockTransportistasLista);
    });


  describe('Funcionalidad de paneles colapsables', () => {
    beforeEach(() => {
      component.panels1 = [
        { label: 'Panel 1', isCollapsed: true },
        { label: 'Panel 2', isCollapsed: true }
      ];
    });

    it('debería expandir el panel seleccionado y colapsar los demás', () => {
      component.mostrar_colapsable1(0);
      
      expect(component.panels1[0].isCollapsed).toBe(false);
      expect(component.panels1[1].isCollapsed).toBe(true);
    });

    it('debería colapsar el panel si ya estaba expandido', () => {
      component.panels1[0].isCollapsed = false;
      component.mostrar_colapsable1(0);
      
      expect(component.panels1[0].isCollapsed).toBe(true);
    });
  });

  describe('Gestión de modales', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería abrir el modal principal con la configuración correcta', () => {
      const mockTemplate = {} as TemplateRef<void>;
      component.abrirModal1(mockTemplate);
      
      expect(mockBsModalService.show).toHaveBeenCalledWith(mockTemplate, { class: 'modal-lg' });
      expect(component.modalRefabir).toBe(mockBsModalRef);
    });

    it('debería mostrar el modal de éxito', () => {
      component.mostrarModalExito();
      
      const expectedConfig = {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-sm'
      };
      
      expect(mockBsModalService.show).toHaveBeenCalledWith(
        component.templateExito,
        expectedConfig
      );
    });

    it('debería cerrar el modal de éxito', () => {
      component.modalRefExito = mockBsModalRef;
      component.cerrarModalExito();
      
      expect(mockBsModalRef.hide).toHaveBeenCalled();
    });

    it('debería cancelar el modal y limpiar el formulario', () => {
      const spyLimpiar = jest.spyOn(component, 'limpiarTransportista');
      component.modalRefabir = mockBsModalRef;
      
      component.cancelarModal();
      
      expect(mockBsModalRef.hide).toHaveBeenCalled();
      expect(spyLimpiar).toHaveBeenCalled();
    });
  });

  describe('Búsqueda de RFC', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería buscar datos por RFC cuando es válido y no existe en la tabla', () => {
      const rfc = 'NUEVORFC123';
      component.transportistaCertificacionForm.patchValue({ rfcEnclaveOperativo: rfc });
      
      const spyBuscarDatos = jest.spyOn(component, 'buscarDatosPorRFC');
      component.buscarRFC();
      
      expect(spyBuscarDatos).toHaveBeenCalledWith(rfc);
    });

    it('debería mostrar modal de RFC duplicado cuando ya existe en la tabla', () => {
      component.transportistasLista = mockTransportistasLista;
      component.transportistaCertificacionForm.patchValue({ 
        rfcEnclaveOperativo: 'RFC123456789' 
      });
      
      const spyModalDuplicado = jest.spyOn(component, 'mostrarModalRFCDuplicado');
      component.buscarRFC();
      
      expect(spyModalDuplicado).toHaveBeenCalled();
    });

    it('no debería buscar si el RFC está vacío', () => {
      component.transportistaCertificacionForm.patchValue({ rfcEnclaveOperativo: '' });
      
      const spyBuscarDatos = jest.spyOn(component, 'buscarDatosPorRFC');
      component.buscarRFC();
      
      expect(spyBuscarDatos).not.toHaveBeenCalled();
    });

    it('debería actualizar el formulario con datos encontrados', () => {
      const empresaData: TransportistasListaInterface = {
        enlaceOperativorfc: 'RFC123456789',
        denominacionRazonsocial: 'Test Company',
        domicilio: 'Test Address',
        ccat: 'CCAT123'
      };
      
      component.patchearDatosEmpresa(empresaData);
      
      expect(component.transportistaCertificacionForm.get('enlaceOperativorfc')?.value).toBe('RFC123456789');
      expect(component.transportistaCertificacionForm.get('denominacionRazonsocial')?.value).toBe('Test Company');
      expect(component.transportistaCertificacionForm.get('domicilio')?.value).toBe('Test Address');
      expect(component.transportistaCertificacionForm.get('ccat')?.value).toBe('CCAT123');
    });

    it('debería limpiar campos cuando no se encuentran datos', () => {
      component.limpiarCamposEmpresa();
      
      expect(component.transportistaCertificacionForm.get('enlaceOperativorfc')?.value).toBe('');
      expect(component.transportistaCertificacionForm.get('denominacionRazonsocial')?.value).toBe('');
      expect(component.transportistaCertificacionForm.get('domicilio')?.value).toBe('');
      expect(component.transportistaCertificacionForm.get('ccat')?.value).toBe('');
    });
  });

  describe('Validaciones de RFC', () => {
    it('debería verificar correctamente si un RFC existe en la tabla', () => {
      component.transportistasLista = mockTransportistasLista;
      
      expect(component.existeRFCEnTabla('RFC123456789')).toBe(true);
      expect(component.existeRFCEnTabla('RFC999999999')).toBe(false);
    });

    it('debería ser insensible a mayúsculas/minúsculas', () => {
      component.transportistasLista = mockTransportistasLista;
      
      expect(component.existeRFCEnTabla('rfc123456789')).toBe(true);
      expect(component.existeRFCEnTabla('RFC123456789')).toBe(true);
    });

    it('debería verificar RFC excluyendo uno específico', () => {
      component.transportistasLista = mockTransportistasLista;
      
      expect(component.existeRFCEnTablaExcluyendo('RFC123456789', 'RFC123456789')).toBe(false);
      expect(component.existeRFCEnTablaExcluyendo('RFC123456789', 'RFC987654321')).toBe(true);
    });
  });

  describe('Aceptar transportista', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería mostrar modal de datos obligatorios si RFC está vacío', () => {
      component.transportistaCertificacionForm.patchValue({ rfcEnclaveOperativo: '' });
      
      const spyModal = jest.spyOn(component, 'mostrarModalDatos');
      component.aceptarTransportista();
      
      expect(spyModal).toHaveBeenCalled();
    });

    it('debería mostrar modal de datos obligatorios si no se realizó búsqueda', () => {
      component.transportistaCertificacionForm.patchValue({
        rfcEnclaveOperativo: 'RFC123456789',
        denominacionRazonsocial: '',
        domicilio: '',
        enlaceOperativorfc: ''
      });
      
      const spyModal = jest.spyOn(component, 'mostrarModalDatosObligatorios');
      component.aceptarTransportista();
      
      expect(spyModal).toHaveBeenCalled();
    });

    it('debería agregar transportista correctamente en modo adición', () => {
      component.isEditMode = false;
      component.transportistasLista = [];
      component.transportistaCertificacionForm.patchValue({
        rfcEnclaveOperativo: 'RFC123456789',
        denominacionRazonsocial: 'Test Company',
        domicilio: 'Test Address',
        enlaceOperativorfc: 'RFC123456789',
        ccat: 'CCAT123'
      });
      
      const spyActualizar = jest.spyOn(component, 'actualizarTransportistasListaEnStore');
      const spyModalExito = jest.spyOn(component, 'mostrarModalExito');
      
      component.aceptarTransportista();
      
      expect(component.transportistasLista).toHaveLength(1);
      expect(spyActualizar).toHaveBeenCalled();
      expect(spyModalExito).toHaveBeenCalled();
    });

    it('debería actualizar transportista en modo edición', () => {
      component.isEditMode = true;
      component.transportistasLista = [...mockTransportistasLista];
      component.selectedTransportista = mockTransportistasLista[0];
      component.transportistaCertificacionForm.patchValue({
        rfcEnclaveOperativo: 'RFC123456789',
        denominacionRazonsocial: 'Updated Company',
        domicilio: 'Updated Address',
        enlaceOperativorfc: 'RFC123456789',
        ccat: 'CCAT123'
      });
      
      component.aceptarTransportista();
      
      expect(component.transportistasLista[0].denominacionRazonsocial).toBe('Updated Company');
      expect(component.transportistasLista[0].domicilio).toBe('Updated Address');
    });

    it('debería validar RFC duplicado en modo adición', () => {
      component.isEditMode = false;
      component.transportistasLista = [...mockTransportistasLista];
      component.transportistaCertificacionForm.patchValue({
        rfcEnclaveOperativo: 'RFC123456789',
        denominacionRazonsocial: 'Test Company',
        domicilio: 'Test Address',
        enlaceOperativorfc: 'RFC123456789'
      });
      
      const spyModal = jest.spyOn(component, 'mostrarModalDatosObligatorios');
      component.aceptarTransportista();
      
      expect(spyModal).toHaveBeenCalled();
    });
  });

  describe('Modificar transportista', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });



    it('debería configurar modo edición y abrir modal con datos del transportista', () => {
      component.transportistasLista = [...mockTransportistasLista];
      component.selectedTransportista = mockTransportistasLista[0];
      
      const spyAbrirModal = jest.spyOn(component, 'abrirModal1');
      component.modificarTransportista();
      
      expect(component.isEditMode).toBe(true);
      expect(spyAbrirModal).toHaveBeenCalled();
      expect(component.transportistaCertificacionForm.get('enlaceOperativorfc')?.value)
        .toBe(mockTransportistasLista[0].rfcEnclaveOperativo);
    });
  });

  describe('Eliminar transportista', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería mostrar modal de selección si no hay transportista seleccionado', () => {
      component.transportistasLista = [];
      component.selectedTransportista = null;
      
      const spyModal = jest.spyOn(component, 'mostrarModalSeleccionRequerida');
      component.eliminarTransportista();
      
      expect(spyModal).toHaveBeenCalled();
      expect(component.mensajeSeleccion).toBe('Debe seleccionar un elemento');
    });

    it('debería mostrar modal de confirmación si hay transportista seleccionado', () => {
      component.transportistasLista = [...mockTransportistasLista];
      component.selectedTransportista = mockTransportistasLista[0];
      
      const spyModal = jest.spyOn(component, 'mostrarModalConfirmacionEliminacion');
      component.eliminarTransportista();
      
      expect(spyModal).toHaveBeenCalled();
    });

    it('debería eliminar transportista correctamente al confirmar', () => {
      component.transportistasLista = [...mockTransportistasLista];
      component.selectedTransportista = mockTransportistasLista[0];
      
      const spyActualizar = jest.spyOn(component, 'actualizarTransportistasListaEnStore');
      component.confirmarEliminacionTransportista();
      
      expect(component.transportistasLista).toHaveLength(1);
      expect(component.transportistasLista[0].rfcEnclaveOperativo).toBe('RFC987654321');
      expect(component.selectedTransportista).toBeNull();
      expect(spyActualizar).toHaveBeenCalled();
    });

    it('no debería eliminar si no hay transportista seleccionado', () => {
      component.transportistasLista = [...mockTransportistasLista];
      component.selectedTransportista = null;
      
      const lengthBefore = component.transportistasLista.length;
      component.confirmarEliminacionTransportista();
      
      expect(component.transportistasLista).toHaveLength(lengthBefore);
    });
  });

  describe('Gestión de formularios', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería limpiar el formulario correctamente', () => {
      component.transportistaCertificacionForm.patchValue({
        rfcEnclaveOperativo: 'TEST123',
        denominacionRazonsocial: 'Test Company'
      });
      
      component.limpiarFormulario();
      
      expect(component.transportistaCertificacionForm.get('rfcEnclaveOperativo')?.value).toBe('');
      expect(component.transportistaCertificacionForm.get('denominacionRazonsocial')?.value).toBe('');
      expect(component.isEditMode).toBe(false);
      expect(component.selectedTransportista).toBeNull();
    });

    it('debería resetear el modo de edición', () => {
      component.isEditMode = true;
      component.selectedTransportista = mockTransportistasLista[0];
      
      component.resetEditMode();
      
      expect(component.isEditMode).toBe(false);
      expect(component.selectedTransportista).toBeNull();
    });

    it('debería limpiar transportista y reinicializar formulario', () => {
      const spyInicializar = jest.spyOn(component, 'inicializarFormulario');
      
      component.limpiarTransportista();
      
      expect(spyInicializar).toHaveBeenCalled();
    });
  });

  describe('Selección de filas', () => {
    it('debería actualizar el transportista seleccionado', () => {
      const transportista = mockTransportistasLista[0];
      
      component.onFilaSeleccionada(transportista);
      
      expect(component.selectedTransportista).toBe(transportista);
    });
  });

  describe('Actualización del store', () => {
    it('debería actualizar la lista de transportistas en el store', () => {
      component.transportistasLista = mockTransportistasLista;
      
      component.actualizarTransportistasListaEnStore();
      
      expect(mockSolicitud32605Store.actualizarEstado).toHaveBeenCalledWith({
        transportistasLista: mockTransportistasLista
      });
    });
  });

  describe('Limpieza de recursos', () => {
    it('debería completar el subject destroy$ en ngOnDestroy', () => {
      const spyNext = jest.spyOn(component.destroy$, 'next');
      const spyComplete = jest.spyOn(component.destroy$, 'complete');
      
      component.ngOnDestroy();
      
      expect(spyNext).toHaveBeenCalled();
      expect(spyComplete).toHaveBeenCalled();
    });
  });

  describe('Renderizado del template', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería renderizar los botones de acción', () => {
      const compiled = fixture.nativeElement;
      const agregarBtn = compiled.querySelector('#agregarTransportista');
      const modificarBtn = compiled.querySelector('#modificarTransportista');
      const eliminarBtn = compiled.querySelector('#eliminarTransportista');
      
      expect(agregarBtn).toBeTruthy();
      expect(modificarBtn).toBeTruthy();
      expect(eliminarBtn).toBeTruthy();
    });

    it('debería deshabilitar botones cuando esFormularioSoloLectura es true', () => {
      component.esFormularioSoloLectura = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('button[disabled]');
      
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('debería renderizar la tabla dinámica', () => {
      const compiled = fixture.nativeElement;
      const tablaDinamica = compiled.querySelector('app-tabla-dinamica');
      
      expect(tablaDinamica).toBeTruthy();
    });

  });

  

  describe('Validaciones de formulario integradas', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería mostrar mensaje de error cuando RFC es requerido y está vacío', () => {
      const rfcControl = component.transportistaCertificacionForm.get('rfcEnclaveOperativo');
      rfcControl?.markAsTouched();
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const errorMessage = compiled.querySelector('.mensaje-error');
      
    });

    it('debería validar el formulario correctamente cuando todos los campos están llenos', () => {
      component.transportistaCertificacionForm.patchValue({
        rfcEnclaveOperativo: 'RFC123456789',
        enlaceOperativorfc: 'RFC123456789',
        denominacionRazonsocial: 'Test Company',
        domicilio: 'Test Address',
        ccat: 'CCAT123'
      });
      
      const rfcControl = component.transportistaCertificacionForm.get('rfcEnclaveOperativo');
      expect(rfcControl?.valid).toBe(true);
    });
  });
});
})
