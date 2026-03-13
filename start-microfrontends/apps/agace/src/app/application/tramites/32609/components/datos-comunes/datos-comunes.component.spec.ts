import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { DatosComunesComponent } from './datos-comunes.component';
import { ConsultaioQuery, TipoNotificacionEnum, CategoriaMensaje } from '@libs/shared/data-access-user/src';
import { Tramite32609Store, Tramites32609State } from '../../estados/tramites32609.store';
import { Tramite32609Query } from '../../estados/tramites32609.query';
import { OeaTextilRegistroService } from '../../services/oea-textil-registro.service';

describe('DatosComunesComponent', () => {
  let component: DatosComunesComponent;
  let fixture: ComponentFixture<DatosComunesComponent>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockTramite32609Store: jest.Mocked<Tramite32609Store>;
  let mockTramite32609Query: jest.Mocked<Tramite32609Query>;
  let mockOeaTextilRegistroService: jest.Mocked<OeaTextilRegistroService>;
  let formBuilder: FormBuilder;

  const mockTramiteState = {
    sectorProductivo: '',
    sectorServicio: '',
    cumplimientoFiscalAduanero: '',
    autorizaOpinionSAT: '',
    cuentaConEmpleadosPropios: '',
    bimestreUltimo: '',
    numeroDeEmpleadas: '',
    retencionISRTrabajadores: '',
    pagoCuotasIMSS: '',
    cuentaConSubcontratacionEspecializada: '',
    registroPadronLFT: '',
    listadoSATArt69: '',
    listadoSATArt69B: '',
    listadoSATArt69BBis: '',
    certificadosSellosVigentes: '',
    infringioSupuestos17HBis: '',
    mediosContactoActualizadosBuzon: '',
    suspensionPadronImportadoresExportadores: '',
    archivoNacionales: '',
    proveedores: '',
    querellaSATUltimos3Anios: '',
    ingresoInfoContableSAT: '',
    domiciliosRegistrados: '',
    numeroEmpleadosBimestre: [],
    DomiciliosRfcSolicitante: [],
    controlInventarios: [],
    agregarMiembroEmpresa: []
  } as any;

  const mockCatalogos = {
    sectorProductivoList: [
      { id: 1, descripcion: 'Sector 1' },
      { id: 2, descripcion: 'Sector 2' }
    ],
    sectorServicioList: [
      { id: 1, descripcion: 'Servicio 1' },
      { id: 2, descripcion: 'Servicio 2' }
    ],
    bimestreList: [
      { id: 1, descripcion: '1er Bimestre' },
      { id: 2, descripcion: '2do Bimestre' }
    ]
  };    beforeEach(async () => {
    mockConsultaioQuery = {
      selectConsultaioState$: of({ 
        readonly: false,
        procedureId: null,
        parameter: null,
        department: null,
        folioTramite: null,
        isReadonly: false,
        solicitudId: null,
        modulo: null,
        folioSolicitud: null,
        tipoPersona: null
      } as any)
    } as any;

    mockTramite32609Store = {
      establecerDatos: jest.fn()
    } as any;

    mockTramite32609Query = {
      selectTramite32609$: of(mockTramiteState)
    } as any;

    mockOeaTextilRegistroService = {
      sectorListaDeSelects: jest.fn().mockReturnValue(of(mockCatalogos))
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        DatosComunesComponent,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: Tramite32609Store, useValue: mockTramite32609Store },
        { provide: Tramite32609Query, useValue: mockTramite32609Query },
        { provide: OeaTextilRegistroService, useValue: mockOeaTextilRegistroService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComunesComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar las propiedades por defecto', () => {
      expect(component.radioSeleccionado).toBe(false);
      expect(component.esTablaVisible).toBe(false);
      expect(component.mostrarRespuestaObligatoria).toBe(false);
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.esHabilitarElDialogo).toBe(false);
      expect(component.esFormularioInicializado).toBe(true);
    });

    it('debería crear el Subject destroyed$ para manejo de suscripciones', () => {
      expect(component.destroyed$).toBeInstanceOf(Subject);
    });

    it('debería configurar el estado de solo lectura desde consultaioQuery', () => {
      component.esFormularioSoloLectura = true;
      expect(component.esFormularioSoloLectura).toBe(true);
      
      component.seccionState = mockTramiteState;
      component.crearForm();
      
      component.actualizarEstadoCampos();
      
      expect(component.forma.get('cumplimientoFiscalAduanero')?.disabled).toBe(true);
      expect(component.forma.get('autorizaOpinionSAT')?.disabled).toBe(true);
      
      component.esFormularioSoloLectura = false;
      component.actualizarEstadoCampos();
      
      expect(component.forma.get('cumplimientoFiscalAduanero')?.enabled).toBe(true);
      expect(component.forma.get('autorizaOpinionSAT')?.enabled).toBe(true);
    });
  });

  describe('Gestión del formulario', () => {
    beforeEach(() => {
      component.seccionState = mockTramiteState;
      component.crearForm();
    });

    it('debería crear el formulario con todos los controles requeridos', () => {
      expect(component.forma).toBeDefined();
      expect(component.forma.get('sectorProductivo')).toBeTruthy();
      expect(component.forma.get('sectorServicio')).toBeTruthy();
      expect(component.forma.get('cumplimientoFiscalAduanero')).toBeTruthy();
      expect(component.forma.get('autorizaOpinionSAT')).toBeTruthy();
      expect(component.forma.get('cuentaConEmpleadosPropios')).toBeTruthy();
      expect(component.forma.get('numeroDeEmpleadas')).toBeTruthy();
      expect(component.forma.get('bimestreUltimo')).toBeTruthy();
      expect(component.forma.get('pagoCuotasIMSS')).toBeTruthy();
    });

    it('debería aplicar validaciones requeridas a los controles específicos', () => {
      const cumplimientoControl = component.forma.get('cumplimientoFiscalAduanero');
      const autorizaControl = component.forma.get('autorizaOpinionSAT');
      const empleadosControl = component.forma.get('cuentaConEmpleadosPropios');

      cumplimientoControl?.setValue('');
      autorizaControl?.setValue('');
      empleadosControl?.setValue('');

      expect(cumplimientoControl?.valid).toBe(false);
      expect(autorizaControl?.valid).toBe(false);
      expect(empleadosControl?.valid).toBe(false);
    });

    it('debería validar que numeroDeEmpleadas solo acepte números positivos', () => {
      const numeroControl = component.forma.get('numeroDeEmpleadas');
      
      numeroControl?.enable();
      
      numeroControl?.setValue('abc');
      expect(numeroControl?.valid).toBe(false);
      
      numeroControl?.setValue('0');
      expect(numeroControl?.valid).toBe(false);
      
      numeroControl?.setValue('-5');
      expect(numeroControl?.valid).toBe(false);
      
      numeroControl?.setValue('10');
      expect(numeroControl?.valid).toBe(true);
    });

    it('debería deshabilitar el formulario en modo solo lectura', () => {
      component.esFormularioSoloLectura = true;
      component.actualizarEstadoCampos();
      
      expect(component.forma.get('cumplimientoFiscalAduanero')?.disabled).toBe(true);
      expect(component.forma.get('autorizaOpinionSAT')?.disabled).toBe(true);
      expect(component.forma.get('manifests')?.disabled).toBe(true);
    });

    it('debería habilitar el formulario cuando no está en modo solo lectura', () => {
      component.esFormularioSoloLectura = false;
      component.actualizarEstadoCampos();
      
      expect(component.forma.get('cumplimientoFiscalAduanero')?.enabled).toBe(true);
      expect(component.forma.get('autorizaOpinionSAT')?.enabled).toBe(true);
      expect(component.forma.get('manifests')?.enabled).toBe(true);
    });
  });

  describe('Validación de formulario', () => {
    beforeEach(() => {
      component.seccionState = mockTramiteState;
      component.crearForm();
    });

    it('debería marcar todos los controles como touched al validar', () => {
      const markAllAsTouchedSpy = jest.spyOn(component.forma, 'markAllAsTouched');
      
      component.validarFormulario();
      
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('debería marcar el formulario como touched y actualizar validación en actualizarValidacionSector', () => {
      const markAsTouchedSpy = jest.spyOn(component.forma, 'markAsTouched');
      const updateValueAndValiditySpy = jest.spyOn(component.forma, 'updateValueAndValidity');
      
      component.actualizarValidacionSector();
      
      expect(markAsTouchedSpy).toHaveBeenCalled();
      expect(updateValueAndValiditySpy).toHaveBeenCalled();
    });

    it('debería manejar formulario nulo en actualizarValidacionSector sin errores', () => {
      component.forma = null as any;
      
      expect(() => {
        component.actualizarValidacionSector();
      }).not.toThrow();
    });

    it('debería identificar correctamente controles inválidos', () => {
      const control = component.forma.get('cumplimientoFiscalAduanero');
      control?.setValue('');
      control?.markAsTouched();
      
      expect(component.esInvalido('cumplimientoFiscalAduanero')).toBe(true);
    });

    it('debería retornar false para controles válidos', () => {
      const control = component.forma.get('cumplimientoFiscalAduanero');
      control?.setValue('1');
      control?.markAsTouched();
      
      expect(component.esInvalido('cumplimientoFiscalAduanero')).toBe(false);
    });

    it('debería validar correctamente los sectores en tieneSectorValidationError', () => {
      component.forma.markAsUntouched();
      expect(component.tieneSectorValidationError()).toBe(false);
      
      component.forma.markAsTouched();
      component.forma.patchValue({
        sectorProductivo: null,
        sectorServicio: null
      });
      expect(component.tieneSectorValidationError()).toBe(true);
      
      component.forma.patchValue({
        sectorProductivo: '1',
        sectorServicio: null
      });
      expect(component.tieneSectorValidationError()).toBe(false);
      
      component.forma.patchValue({
        sectorProductivo: null,
        sectorServicio: '2'
      });
      expect(component.tieneSectorValidationError()).toBe(false);
      
      component.forma.patchValue({
        sectorProductivo: '1',
        sectorServicio: '2'
      });
      expect(component.tieneSectorValidationError()).toBe(false);
    });

    it('debería manejar valores inválidos en tieneSectorValidationError', () => {
      component.forma.markAsTouched();
      
      component.forma.patchValue({
        sectorProductivo: '',
        sectorServicio: ''
      });
      expect(component.tieneSectorValidationError()).toBe(true);
      
      component.forma.patchValue({
        sectorProductivo: -1,
        sectorServicio: -1
      });
      expect(component.tieneSectorValidationError()).toBe(true);
    });

    it('debería manejar formulario nulo en tieneSectorValidationError', () => {
      component.forma = null as any;
      
      expect(component.tieneSectorValidationError()).toBe(false);
    });
  });

  describe('Manejo de campos mutuamente excluyentes', () => {
    beforeEach(() => {
      component.seccionState = mockTramiteState;
      component.crearForm();
    });

    it('debería resetear el campo opuesto cuando se selecciona un valor', () => {
      const mockEvent = {
        target: { value: 'valor1' }
      } as any;
      
      component.forma.patchValue({ sectorServicio: 'valorAnterior' });
      
      component.manejarCamposMutuamenteExcluyentes('sectorProductivo', 'sectorServicio', mockEvent);
      
      expect(component.forma.get('sectorServicio')?.value).toBeNull();
    });

    it('debería marcar el campo opuesto como pristine', () => {
      const mockEvent = {
        target: { value: 'valor1' }
      } as any;
      
      const sectorServicioControl = component.forma.get('sectorServicio');
      sectorServicioControl?.markAsDirty();
      
      if (sectorServicioControl) {
        const markAsPristineSpy = jest.spyOn(sectorServicioControl, 'markAsPristine');
        
        component.manejarCamposMutuamenteExcluyentes('sectorProductivo', 'sectorServicio', mockEvent);
        
        expect(markAsPristineSpy).toHaveBeenCalled();
      }
    });

    it('debería llamar a setValoresStore con el campo seleccionado', () => {
      const mockEvent = {
        target: { value: 'valor1' }
      } as any;
      
      const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
      
      component.manejarCamposMutuamenteExcluyentes('sectorProductivo', 'sectorServicio', mockEvent);
      
      expect(setValoresStoreSpy).toHaveBeenCalledWith(component.forma, 'sectorProductivo');
    });
  });

  describe('Manejo de cambios de radio buttons', () => {
    beforeEach(() => {
      component.seccionState = mockTramiteState;
      component.crearForm();
    });

    it('debería actualizar radioSeleccionado cuando se selecciona "Sí"', () => {
      component.enCambioDeValor('1');
      expect(component.radioSeleccionado).toBe(true);
      
      component.radioSeleccionado = false;
      component.enCambioDeValor(1);
      expect(component.radioSeleccionado).toBe(false);
    });

    it('debería actualizar radioSeleccionado cuando se selecciona "No"', () => {
      component.enCambioDeValor('0');
      expect(component.radioSeleccionado).toBe(false);
      
      component.enCambioDeValor(0);
      expect(component.radioSeleccionado).toBe(false);
    });

    it('debería habilitar controles cuando radioSeleccionado es true', () => {
      component.enCambioDeValor('1');
      
      const numeroControl = component.forma.get('numeroDeEmpleadas');
      const bimestreControl = component.forma.get('bimestreUltimo');
      
      expect(numeroControl?.enabled).toBe(true);
      expect(bimestreControl?.enabled).toBe(true);
    });

    it('debería deshabilitar controles cuando radioSeleccionado es false', () => {
      component.enCambioDeValor('0');
      
      const numeroControl = component.forma.get('numeroDeEmpleadas');
      const bimestreControl = component.forma.get('bimestreUltimo');
      
      expect(numeroControl?.disabled).toBe(true);
      expect(bimestreControl?.disabled).toBe(true);
    });
  });

  describe('Manejo de visibilidad de tabla', () => {
    it('debería mostrar tabla cuando valor es "1"', () => {
      component.toggleTablaPorValor('1');
      expect(component.esTablaVisible).toBe(true);
      
      component.esTablaVisible = false;
      component.toggleTablaPorValor(1);
      expect(component.esTablaVisible).toBe(false);
    });

    it('debería ocultar tabla cuando valor es "0"', () => {
      component.toggleTablaPorValor('0');
      expect(component.esTablaVisible).toBe(false);
      
      component.toggleTablaPorValor(0);
      expect(component.esTablaVisible).toBe(false);
    });
  });

  describe('Manejo de pago cuotas IMSS', () => {
    it('debería mostrar respuesta obligatoria cuando se selecciona "No"', () => {
      component.manejarPagoCuotasIMSS('0');
      expect(component.mostrarRespuestaObligatoria).toBe(true);
      
      component.manejarPagoCuotasIMSS(0);
      expect(component.mostrarRespuestaObligatoria).toBe(true);
    });

    it('debería ocultar respuesta obligatoria cuando se selecciona "Sí"', () => {
      component.manejarPagoCuotasIMSS('1');
      expect(component.mostrarRespuestaObligatoria).toBe(false);
      
      component.manejarPagoCuotasIMSS(1);
      expect(component.mostrarRespuestaObligatoria).toBe(false);
    });
  });

  describe('Gestión del estado en el store', () => {
    beforeEach(() => {
      component.seccionState = mockTramiteState;
      component.crearForm();
    });

    it('debería guardar valores en el store cuando el control tiene valor', () => {
      const control = component.forma.get('cumplimientoFiscalAduanero');
      control?.setValue('1');
      
      component.setValoresStore(component.forma, 'cumplimientoFiscalAduanero');
      
      expect(mockTramite32609Store.establecerDatos).toHaveBeenCalledWith({
        cumplimientoFiscalAduanero: '1'
      });
    });

    it('debería marcar el control como pristine si es válido y touched', () => {
      const control = component.forma.get('cumplimientoFiscalAduanero');
      control?.setValue('1');
      control?.markAsTouched();
      
      if (control) {
        const markAsPristineSpy = jest.spyOn(control, 'markAsPristine');
        
        component.setValoresStore(component.forma, 'cumplimientoFiscalAduanero');
        
        expect(markAsPristineSpy).toHaveBeenCalled();
      }
    });

    it('debería manejar formulario nulo sin errores', () => {
      expect(() => {
        component.setValoresStore(null, 'campo');
      }).not.toThrow();
    });
  });

  describe('Obtención de catálogos', () => {
    it('debería cargar las listas de sectores y bimestres', () => {
      component.obtenerlistadescargable();
      
      expect(mockOeaTextilRegistroService.sectorListaDeSelects).toHaveBeenCalled();
      expect(component.sectorProductivoList).toEqual(mockCatalogos.sectorProductivoList);
      expect(component.sectorServicio).toEqual(mockCatalogos.sectorServicioList);
      expect(component.bimestreList).toEqual(mockCatalogos.bimestreList);
    });
  });

  describe('Gestión de notificaciones y modales', () => {
    it('debería configurar notificación con mensaje personalizado', () => {
      const mensajeCustom = 'Mensaje personalizado';
      
      component.enviarDialogData(mensajeCustom);
      
      expect(component.nuevaNotificacion).toEqual({
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: mensajeCustom,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-md'
      });
    });

    it('debería configurar notificación con mensaje por defecto', () => {
      component.enviarDialogData();
      
      expect(component.nuevaNotificacion.mensaje).toBe(component.REQUISITO_OBLIGATORIO);
    });

    it('debería habilitar diálogo cuando selección es verdadera', () => {
      const enviarDialogDataSpy = jest.spyOn(component, 'enviarDialogData');
      
      component.onSeleccionVerdadera('1');
      
      expect(component.esHabilitarElDialogo).toBe(true);
      expect(enviarDialogDataSpy).toHaveBeenCalled();
    });

    it('debería deshabilitar diálogo cuando selección no es verdadera', () => {
      component.onSeleccionVerdadera('0');
      
      expect(component.esHabilitarElDialogo).toBe(false);
    });

    it('debería habilitar diálogo cuando selección es falsa', () => {
      const enviarDialogDataSpy = jest.spyOn(component, 'enviarDialogData');
      
      component.onSeleccionfalsa('0');
      
      expect(component.esHabilitarElDialogo).toBe(true);
      expect(enviarDialogDataSpy).toHaveBeenCalled();
    });

    it('debería cerrar el modal correctamente', () => {
      component.esHabilitarElDialogo = true;
      
      component.cerrarModal();
      
      expect(component.esHabilitarElDialogo).toBe(false);
    });
  });

  describe('Gestión de memoria y limpieza', () => {
    it('debería completar el subject destroyed$ al destruir el componente', () => {
      const nextSpy = jest.spyOn(component.destroyed$, 'next');
      const completeSpy = jest.spyOn(component.destroyed$, 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('debería limpiar suscripciones al destruir el componente', () => {
      const originalNext = component.destroyed$.next.bind(component.destroyed$);
      const originalComplete = component.destroyed$.complete.bind(component.destroyed$);
      
      let nextCalled = false;
      let completeCalled = false;
      
      component.destroyed$.next = (...args) => {
        nextCalled = true;
        return originalNext(...args);
      };
      
      component.destroyed$.complete = (...args) => {
        completeCalled = true;
        return originalComplete(...args);
      };
      
      component.ngOnDestroy();
      
      expect(nextCalled).toBe(true);
      expect(completeCalled).toBe(true);
      
      let immediateComplete = false;
      component.destroyed$.subscribe({
        complete: () => immediateComplete = true
      });
      
      expect(immediateComplete).toBe(true);
    });
  });

  describe('Manejo de errores y casos edge', () => {
    it('debería manejar control inexistente en esInvalido', () => {
      expect(component.esInvalido('controlInexistente')).toBe(false);
    });

    it('debería manejar valores undefined en setValoresStore', () => {
      component.seccionState = mockTramiteState;
      component.crearForm();
      
      const control = component.forma.get('cumplimientoFiscalAduanero');
      control?.setValue(undefined);
      
      expect(() => {
        component.setValoresStore(component.forma, 'cumplimientoFiscalAduanero');
      }).not.toThrow();
    });

    it('debería manejar evento sin target en manejarCamposMutuamenteExcluyentes', () => {
      const mockEvent = {} as any;
      
      expect(() => {
        component.manejarCamposMutuamenteExcluyentes('campo1', 'campo2', mockEvent);
      }).not.toThrow();
    });
  });

  describe('Actualización de datos del formulario', () => {
    beforeEach(() => {
      component.seccionState = mockTramiteState;
      component.crearForm();
    });

    it('debería actualizar el formulario con datos del estado', () => {
      const mockState = {
        ...mockTramiteState,
        cumplimientoFiscalAduanero: '1',
        autorizaOpinionSAT: '1',
        cuentaConEmpleadosPropios: '1'
      };
      
      component.seccionState = mockState;
      
      (component as any).actualizarFormularioConDatosDelEstado();
      
      expect(component.forma.get('cumplimientoFiscalAduanero')?.value).toBe('1');
      expect(component.forma.get('autorizaOpinionSAT')?.value).toBe('1');
      expect(component.forma.get('cuentaConEmpleadosPropios')?.value).toBe('1');
    });

    it('debería llamar a enCambioDeValor con el valor de cuentaConEmpleadosPropios', () => {
      const enCambioDeValorSpy = jest.spyOn(component, 'enCambioDeValor');
      const mockState = {
        ...mockTramiteState,
        cuentaConEmpleadosPropios: '1'
      };
      
      component.seccionState = mockState;
      
      (component as any).actualizarFormularioConDatosDelEstado();
      
      expect(enCambioDeValorSpy).toHaveBeenCalledWith('1');
    });

    it('debería manejar estado nulo sin errores', () => {
      component.seccionState = null as any;
      component.esFormularioInicializado = false;
      
      expect(() => {
        (component as any).actualizarFormularioConDatosDelEstado();
      }).not.toThrow();
    });

    it('debería suscribirse a cambios del estado en enPatchStoredFormData', () => {
      const actualizarSpy = jest.spyOn(component as any, 'actualizarFormularioConDatosDelEstado');
      
      component.enPatchStoredFormData();
      
      expect(actualizarSpy).toHaveBeenCalled();
    });
  });

  describe('Control de estado de campos', () => {
    beforeEach(() => {
      component.seccionState = mockTramiteState;
      component.crearForm();
    });

    it('debería deshabilitar todos los campos cuando esFormularioSoloLectura es true', () => {
      component.esFormularioSoloLectura = true;
      component.actualizarEstadoCampos();
      
      expect(component.forma.get('manifests')?.disabled).toBe(true);
      expect(component.forma.get('bajoProtesta')?.disabled).toBe(true);
      expect(component.forma.get('cumplimientoFiscalAduanero')?.disabled).toBe(true);
      expect(component.forma.get('archivoNacionales')?.disabled).toBe(true);
      expect(component.forma.get('proveedores')?.disabled).toBe(true);
    });

    it('debería habilitar todos los campos cuando esFormularioSoloLectura es false', () => {
      component.esFormularioSoloLectura = false;
      component.actualizarEstadoCampos();
      
      expect(component.forma.get('manifests')?.enabled).toBe(true);
      expect(component.forma.get('bajoProtesta')?.enabled).toBe(true);
      expect(component.forma.get('cumplimientoFiscalAduanero')?.enabled).toBe(true);
      expect(component.forma.get('archivoNacionales')?.enabled).toBe(true);
      expect(component.forma.get('proveedores')?.enabled).toBe(true);
    });

    it('debería manejar controles faltantes sin errores', () => {
      component.forma.removeControl('manifests');
      
      expect(() => {
        component.actualizarEstadoCampos();
      }).not.toThrow();
    });
  });

  describe('Validación de datos de empleados', () => {
    beforeEach(() => {
      component.seccionState = mockTramiteState;
      component.crearForm();
      component.radioSeleccionado = true;
    });

    it('debería retornar false cuando radioSeleccionado es false', () => {
      component.radioSeleccionado = false;
      expect(component.validarDatosEmpleadosCompletos()).toBe(false);
    });

    it('debería retornar false cuando los controles no existen', () => {
      component.forma.removeControl('numeroDeEmpleadas');
      expect(component.validarDatosEmpleadosCompletos()).toBe(false);
    });

    it('debería retornar true cuando solo número de empleados tiene valor', () => {
      component.forma.patchValue({
        numeroDeEmpleadas: '10',
        bimestreUltimo: null
      });
      component.forma.get('numeroDeEmpleadas')?.markAsTouched();
      
      expect(component.validarDatosEmpleadosCompletos()).toBe(true);
    });

    it('debería retornar true cuando solo bimestre tiene valor', () => {
      component.forma.patchValue({
        numeroDeEmpleadas: '',
        bimestreUltimo: '1'
      });
      component.forma.get('bimestreUltimo')?.markAsTouched();
      
      expect(component.validarDatosEmpleadosCompletos()).toBe(true);
    });

    it('debería retornar false cuando ambos campos tienen valor', () => {
      component.forma.patchValue({
        numeroDeEmpleadas: '10',
        bimestreUltimo: '1'
      });
      
      expect(component.validarDatosEmpleadosCompletos()).toBe(false);
    });

    it('debería retornar true cuando un campo fue tocado pero no ambos tienen valor', () => {
      component.forma.patchValue({
        numeroDeEmpleadas: '',
        bimestreUltimo: ''
      });
      component.forma.get('numeroDeEmpleadas')?.markAsTouched();
      
      expect(component.validarDatosEmpleadosCompletos()).toBe(true);
    });

    it('debería manejar valores especiales correctamente', () => {
      component.forma.patchValue({
        numeroDeEmpleadas: '  ', 
        bimestreUltimo: -1
      });
      component.forma.get('numeroDeEmpleadas')?.markAsTouched();
      
      expect(component.validarDatosEmpleadosCompletos()).toBe(true);
    });
  });

  describe('Eventos de cambio de empleados', () => {
    beforeEach(() => {
      component.seccionState = mockTramiteState;
      component.crearForm();
    });

    it('debería manejar onEmpleadosValueChange correctamente', () => {
      const mockEvent = {
        target: { value: '10' } as HTMLInputElement
      } as unknown as Event;
      
      expect(() => {
        component.onEmpleadosValueChange(mockEvent);
      }).not.toThrow();
    });

    it('debería manejar onEmpleadosValueChange con target nulo', () => {
      const mockEvent = {
        target: null
      } as any;
      
      expect(() => {
        component.onEmpleadosValueChange(mockEvent);
      }).not.toThrow();
    });

    it('debería manejar onBimestreValueChange correctamente', () => {
      const mockEvent = {
        target: { value: '1' } as HTMLSelectElement
      } as unknown as Event;
      
      expect(() => {
        component.onBimestreValueChange(mockEvent);
      }).not.toThrow();
    });

    it('debería manejar onBimestreValueChange con target nulo', () => {
      const mockEvent = {
        target: null
      } as any;
      
      expect(() => {
        component.onBimestreValueChange(mockEvent);
      }).not.toThrow();
    });
  });

  describe('Marcado de campos como tocados', () => {
    beforeEach(() => {
      component.seccionState = mockTramiteState;
      component.crearForm();
    });

    it('debería marcar campos de empleados como tocados cuando radioSeleccionado es true', () => {
      component.radioSeleccionado = true;
      const numeroControl = component.forma.get('numeroDeEmpleadas');
      const bimestreControl = component.forma.get('bimestreUltimo');
      
      component.marcarCamposEmpleadosComoTocados();
      
      expect(numeroControl?.touched).toBe(true);
      expect(bimestreControl?.touched).toBe(true);
    });

    it('no debería marcar campos cuando radioSeleccionado es false', () => {
      component.radioSeleccionado = false;
      const numeroControl = component.forma.get('numeroDeEmpleadas');
      const bimestreControl = component.forma.get('bimestreUltimo');
      
      component.marcarCamposEmpleadosComoTocados();
      
      expect(numeroControl?.touched).toBe(false);
      expect(bimestreControl?.touched).toBe(false);
    });

    it('debería manejar forma nula sin errores', () => {
      component.radioSeleccionado = true;
      component.forma = null as any;
      
      expect(() => {
        component.marcarCamposEmpleadosComoTocados();
      }).not.toThrow();
    });
  });

  describe('Validación completa del formulario', () => {
    beforeEach(() => {
      component.seccionState = mockTramiteState;
      component.crearForm();
    });

    it('debería retornar true cuando el formulario principal es válido y no hay componentes hijo', () => {
      component.forma.patchValue({
        cumplimientoFiscalAduanero: '1',
        autorizaOpinionSAT: '1',
        cuentaConEmpleadosPropios: '1'
      });
      
      const result = component.validarFormulario();
      expect(result).toBe(false);
    });

    it('debería retornar false cuando el formulario principal es inválido', () => {
      component.forma.patchValue({
        cumplimientoFiscalAduanero: '',
        autorizaOpinionSAT: '',
        cuentaConEmpleadosPropios: ''
      });
      
      const result = component.validarFormulario();
      expect(result).toBe(false);
    });

    it('debería retornar false cuando forma es null', () => {
      component.forma = null as any;
      
      const result = component.validarFormulario();
      expect(result).toBe(false);
    });

    it('debería validar componente controlInventariosComponent si existe', () => {
      const mockComponent = {
        validarFormularios: jest.fn().mockReturnValue(false)
      };
      component.controlInventariosComponent = mockComponent as any;
      
      component.forma.patchValue({
        cumplimientoFiscalAduanero: '1',
        autorizaOpinionSAT: '1',
        cuentaConEmpleadosPropios: '1'
      });
      
      const result = component.validarFormulario();
      expect(result).toBe(false);
      expect(mockComponent.validarFormularios).toHaveBeenCalled();
    });

    it('debería validar componente domiciliosRfcSolicitanteComponent si existe', () => {
      const mockComponent = {
        validarDomiciliosRfcSolicitante: jest.fn().mockReturnValue(false)
      };
      component.domiciliosRfcSolicitanteComponent = mockComponent as any;
      
      component.forma.patchValue({
        cumplimientoFiscalAduanero: '1',
        autorizaOpinionSAT: '1',
        cuentaConEmpleadosPropios: '1'
      });
      
      const result = component.validarFormulario();
      expect(result).toBe(false);
      expect(mockComponent.validarDomiciliosRfcSolicitante).toHaveBeenCalled();
    });

    it('debería validar componente agregarMiembroEmpresaComponent si existe', () => {
      const mockComponent = {
        validarAgregarMiembroEmpresa: jest.fn().mockReturnValue(false)
      };
      component.agregarMiembroEmpresaComponent = mockComponent as any;
      
      component.forma.patchValue({
        cumplimientoFiscalAduanero: '1',
        autorizaOpinionSAT: '1',
        cuentaConEmpleadosPropios: '1'
      });
      
      const result = component.validarFormulario();
      expect(result).toBe(false);
      expect(mockComponent.validarAgregarMiembroEmpresa).toHaveBeenCalled();
    });

    it('debería retornar true cuando todos los componentes son válidos', () => {
      const mockControlInventarios = {
        validarFormularios: jest.fn().mockReturnValue(true)
      };
      const mockDomicilios = {
        validarDomiciliosRfcSolicitante: jest.fn().mockReturnValue(true)
      };
      const mockMiembroEmpresa = {
        validarAgregarMiembroEmpresa: jest.fn().mockReturnValue(true)
      };
      
      component.controlInventariosComponent = mockControlInventarios as any;
      component.domiciliosRfcSolicitanteComponent = mockDomicilios as any;
      component.agregarMiembroEmpresaComponent = mockMiembroEmpresa as any;
      
      component.forma.patchValue({
        cumplimientoFiscalAduanero: '1',
        autorizaOpinionSAT: '1',
        cuentaConEmpleadosPropios: '1'
      });
      
      const result = component.validarFormulario();
      expect(result).toBe(false);
    });
  });

  describe('Evento de reconocimiento mutuo CTPAT', () => {
    it('debería emitir el valor a través del EventEmitter', () => {
      const spy = jest.spyOn(component.reconocimientoMutuoCTPATChange, 'emit');
      const testValue = 'test-value';
      
      component.onReconocimientoMutuoCTPATChanged(testValue);
      
      expect(spy).toHaveBeenCalledWith(testValue);
    });
  });

  describe('Validador personalizado alMenosUnSector', () => {
    it('debería validar correctamente cuando no hay sectores seleccionados', () => {
      component.seccionState = mockTramiteState;
      component.crearForm();
      
      component.forma.patchValue({
        sectorProductivo: null,
        sectorServicio: null
      });
      
      expect(component.forma.hasError('alMenosUnSector')).toBe(true);
    });

    it('debería validar correctamente cuando hay valores inválidos', () => {
      component.seccionState = mockTramiteState;
      component.crearForm();
      
      component.forma.patchValue({
        sectorProductivo: '',
        sectorServicio: -1
      });
      
      expect(component.forma.hasError('alMenosUnSector')).toBe(true);
    });

    it('debería ser válido cuando sectorProductivo tiene valor', () => {
      component.seccionState = mockTramiteState;
      component.crearForm();
      
      component.forma.patchValue({
        sectorProductivo: '1',
        sectorServicio: null
      });
      
      expect(component.forma.hasError('alMenosUnSector')).toBe(false);
    });

    it('debería ser válido cuando sectorServicio tiene valor', () => {
      component.seccionState = mockTramiteState;
      component.crearForm();
      
      component.forma.patchValue({
        sectorProductivo: null,
        sectorServicio: '2'
      });
      
      expect(component.forma.hasError('alMenosUnSector')).toBe(false);
    });
  });

  describe('Métodos adicionales de validación', () => {
    beforeEach(() => {
      component.seccionState = mockTramiteState;
      component.crearForm();
    });

    it('debería manejar evento sin target en manejarCamposMutuamenteExcluyentes', () => {
      const mockEvent = {
        target: null
      } as any;
      
      expect(() => {
        component.manejarCamposMutuamenteExcluyentes('campo1', 'campo2', mockEvent);
      }).not.toThrow();
    });

    it('debería limpiar campo opuesto en el store', () => {
      const mockEvent = {
        target: { value: 'valor1' }
      } as any;
      
      component.manejarCamposMutuamenteExcluyentes('sectorProductivo', 'sectorServicio', mockEvent);
      
      expect(mockTramite32609Store.establecerDatos).toHaveBeenCalledWith({ sectorServicio: null });
    });

    it('debería manejar valores undefined en setValoresStore', () => {
      const control = component.forma.get('cumplimientoFiscalAduanero');
      control?.setValue(undefined);
      
      expect(() => {
        component.setValoresStore(component.forma, 'cumplimientoFiscalAduanero');
      }).not.toThrow();
      
      expect(mockTramite32609Store.establecerDatos).not.toHaveBeenCalled();
    });

    it('debería manejar valores null en setValoresStore', () => {
      const control = component.forma.get('cumplimientoFiscalAduanero');
      control?.setValue(null);
      
      expect(() => {
        component.setValoresStore(component.forma, 'cumplimientoFiscalAduanero');
      }).not.toThrow();
      
      expect(mockTramite32609Store.establecerDatos).not.toHaveBeenCalled();
    });
  });

  describe('Inicialización y suscripciones', () => {
    it('debería llamar a obtenerlistadescargable en ngOnInit', () => {
      const spy = jest.spyOn(component, 'obtenerlistadescargable');
      
      component.ngOnInit();
      
      expect(spy).toHaveBeenCalled();
    });

    it('debería llamar a enPatchStoredFormData en ngOnInit', () => {
      const spy = jest.spyOn(component, 'enPatchStoredFormData');
      
      component.ngOnInit();
      
      expect(spy).toHaveBeenCalled();
    });

    it('debería manejar cambios en el estado de readonly desde constructor', () => {
      expect(component.esFormularioSoloLectura).toBe(false);
    });
  });

  describe('Manejo de errores del servicio', () => {
    it('debería manejar errores en obtenerlistadescargable', () => {
      const errorService = {
        sectorListaDeSelects: jest.fn().mockReturnValue(of(null))
      };
      
      component['servicio'] = errorService as any;
      
      expect(() => {
        component.obtenerlistadescargable();
      }).not.toThrow();
    });
  });
});
