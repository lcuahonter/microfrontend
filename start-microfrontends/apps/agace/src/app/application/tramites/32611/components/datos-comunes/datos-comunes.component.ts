import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AlertComponent, Catalogo, CatalogoSelectComponent, CategoriaMensaje, InputCheckComponent, InputRadioComponent, Notificacion, NotificacionesComponent, TipoNotificacionEnum, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NOTA, OPCIONES_DE_BOTON_DE_RADIO } from '../../constants/oea-textil-registro.enum';
import { Solicitud32611State, Solicitud32611Store } from '../../estados/solicitud32611.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AgregarMiembroEmpresaComponent } from '../agregar-miembro-empresa/agregar-miembro-empresa.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ControlInventariosComponent } from '../control-inventarios/control-inventarios.component';
import { DomiciliosRfcSolicitanteComponent } from '../domicilios-rfc-solicitante/domicilios-rfc-solicitante.component';
import { NumeroEmpleadosBimestreComponent } from '../numero-empleados-bimestre/numero-empleados-bimestre.component';
import { Solicitud32611Query } from '../../estados/solicitud32611.query';
import { SolicitudService } from '../../services/solicitud.service';

/**
 * Componente para la gestión de datos comunes del trámite OEA textil.
 * 
 * Este componente independiente (`standalone`) se encarga de capturar y validar
 * los datos comunes requeridos para el registro OEA textil, incluyendo información
 * del sector productivo, cumplimiento fiscal, empleados y otros datos básicos.
 * 
 * @component
 * @selector app-datos-comunes
 * @standalone true
 * @implements {OnInit, OnDestroy}
 * @author Equipo de desarrollo VUCEM
 * @version 1.0.0
 * @since 2024
 * 
 * @example
 * ```html
 * <app-datos-comunes></app-datos-comunes>
 * ```
 */

@Component({
  selector: 'app-datos-comunes',
  standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      CatalogoSelectComponent,
      InputRadioComponent,
      NotificacionesComponent,
      NumeroEmpleadosBimestreComponent,
      DomiciliosRfcSolicitanteComponent,
      ControlInventariosComponent,
      TituloComponent,
      AgregarMiembroEmpresaComponent,
      InputCheckComponent,
      AlertComponent
    ],
  templateUrl: './datos-comunes.component.html',
  styleUrl: './datos-comunes.component.scss',
})
export class DatosComunesComponent implements OnInit, OnDestroy {

  /**
   * @property {ControlInventariosComponent} controlInventariosComponent
   * Referencia al componente hijo de control de inventarios para poder acceder a sus métodos.
   */
  @ViewChild('controlInventariosRef') controlInventariosComponent!: ControlInventariosComponent;
    /**
   * Referencia al componente DomiciliosRfcSolicitanteComponent para acceder a sus métodos de validación.
   */
  @ViewChild('domiciliosRfcSolicitanteRef') domiciliosRfcSolicitanteComponent!: DomiciliosRfcSolicitanteComponent;

    /**
   * Referencia al componente AgregarMiembroEmpresaComponent para acceder a sus métodos de validación.
   */
  @ViewChild('agregarMiembroEmpresaRef') agregarMiembroEmpresaComponent!: AgregarMiembroEmpresaComponent;
  /**
   * Indicates whether the entity is consolidated in ET.
   *
   * @type {boolean}
   * @default false
   */
  radioSeleccionado: boolean = false;
  /**
   * Expresión regular para validar que el campo solo contenga dígitos.
   */
  esTablaVisible:boolean = false;

  /**
   * Indica si la sección "Respuesta Obligatoria" debe ser visible.
   * Se muestra cuando pagoCuotasIMSS es seleccionado como "No" (valor '0').
   */
  mostrarRespuestaObligatoria: boolean = false;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  
  /**
   * @property {FormGroup} forma
   * Formulario reactivo que contiene los controles y validaciones para los datos de las empresas transportistas.
   */
  public forma!: FormGroup;

   /**
   * @property {Solicitud32611State} seccionState
   * Estado actual del formulario.
   */
  public seccionState!: Solicitud32611State;

    /**
   * Opciones de botón de radio.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;
  /**
   * Lista de sectores productivos.
   */
  sectorProductivoList!: Catalogo[];
  /**
   * Lista de sectores de solicitudService.
   */
  sectorServicio!: Catalogo[];
  /**
   * Lista de bimestres.
   */
  bimestreList!: Catalogo[];

  /**
   * Notificación que se muestra al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Mensaje que indica un requisito obligatorio para acceder a la nota.
   */
  REQUISITO_OBLIGATORIO = NOTA.REQUISITO_OBLIGATORIO_PARA_ACCEDER_NOTA;
  EMPLEADO_REQUISITO = NOTA.EMPLEADO_REQUISITO_RGCE;


  /**
   * Indica si el diálogo de notificación está habilitado.
   */
  public esHabilitarElDialogo: boolean = false;

  /**
   * @property {Subject<void>} destroyed$
   * Observable utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  public destroyed$ = new Subject<void>();

  /**
   * Indica si el formulario ha sido inicializado.
   * Se utiliza para evitar la recreación del formulario si ya está inicializado.
   */
  public esFormularioInicializado: boolean = false;

  
  /**
   * Mensaje que indica el sector productivo para mostrar en la nota.
   * @type {string}
   */
  SECTOR_PRODUCTIVO = NOTA.SECTOR_PRODUCTIVO;
   /**
   * Evento emitido cuando cambia el valor de reconocimientoMutuoCTPAT.
   * @type {EventEmitter<string>}
   */
  @Output() reconocimientoMutuoCTPATChange = new EventEmitter<string>();

  /**
   * Constructor del componente DatosComunesComponent.
   * 
   * Inicializa las dependencias necesarias y configura las suscripciones
   * para el estado de solo lectura del formulario.
   * 
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos
   * @param {ConsultaioQuery} consultaioQuery - Query para obtener el estado de consulta
   * @param {Tramite32609Store} tramite32611Store - Store para gestionar el estado del trámite
   * @param {Tramite32609Query} tramite32611Query - Query para obtener datos del trámite
   * @param {OeaTextilRegistroService} solicitudService - Servicio para operaciones del trámite OEA textil
   */

  constructor(public fb: FormBuilder, 
    private consultaioQuery: ConsultaioQuery,
    private solicitudService: SolicitudService,
    private tramite32611Store: Solicitud32611Store,
    private tramite32611Query: Solicitud32611Query,
  ) {
    this.crearForm();
    this.consultaioQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.destroyed$),
          map((seccionState) => {
           this.esFormularioSoloLectura = seccionState.readonly;
           if (this.forma && this.esFormularioInicializado) {
           this.actualizarEstadoCampos();
         }
          })
        )
        .subscribe();
  }

  /**
   * @method ngOnInit
   * Hook de ciclo de vida para inicializar el componente.
   */
  ngOnInit(): void {
    this.obtenerlistadescargable();
    this.enPatchStoredFormData();
  }

   /**
     * @method crearForm
     * Crea el formulario reactivo con sus controles y validaciones.
     */
    crearForm(): void {
      if (this.esFormularioInicializado && this.forma) {
    return;
  }
      this.forma = this.fb.group({
          sectorProductivo: [this.seccionState?.sectorProductivo],
          sectorServicio: [this.seccionState?.sectorServicio],
          cumplimientoFiscalAduanero: [this.seccionState?.cumplimientoFiscalAduanero, Validators.required],
          autorizaOpinionSAT: [this.seccionState?.autorizaOpinionSAT, Validators.required],
          cuentaConEmpleadosPropios: [this.seccionState?.cuentaConEmpleadosPropios, Validators.required],
          bimestreUltimo: [this.seccionState?.bimestreUltimo, Validators.required],
          numeroDeEmpleadas: [{value:this.seccionState?.numeroDeEmpleadas, disabled:true}],
          retencionISRTrabajadores: [this.seccionState?.retencionISRTrabajadores, Validators.required],
          pagoCuotasIMSS: [this.seccionState?.pagoCuotasIMSS, Validators.required],
          cuentaConSubcontratacionEspecializada: [this.seccionState?.cuentaConSubcontratacionEspecializada, Validators.required],
          registroPadronLFT: [this.seccionState?.registroPadronLFT, Validators.required],
          listadoSATArt69: [this.seccionState?.listadoSATArt69, Validators.required],
          listadoSATArt69B: [this.seccionState?.listadoSATArt69B, Validators.required],
          listadoSATArt69BBis: [this.seccionState?.listadoSATArt69BBis, Validators.required],
          certificadosSellosVigentes: [this.seccionState?.certificadosSellosVigentes, Validators.required],
          infringioSupuestos17HBis: [this.seccionState?.infringioSupuestos17HBis, Validators.required],
          mediosContactoActualizadosBuzon: [this.seccionState?.mediosContactoActualizadosBuzon, Validators.required],
          suspensionPadronImportadoresExportadores: [this.seccionState?.suspensionPadronImportadoresExportadores, Validators.required],
          archivoNacionales: [this.seccionState?.archivoNacionales || null],
          proveedores: [this.seccionState?.proveedores || null],
          querellaSATUltimos3Anios: [this.seccionState?.querellaSATUltimos3Anios, Validators.required],
          ingresoInfoContableSAT: [this.seccionState?.ingresoInfoContableSAT, Validators.required],
          manifests: [false, Validators.required],
          bajoProtesta: [false, Validators.required],
      }, { validators: alMenosUnSectorValidator });

      this.esFormularioInicializado = true;

    }

/**
 * @method actualizarFormularioConDatosDelEstado
 * @description Actualiza los valores del formulario con los datos del estado del trámite sin recrear controles.
 * 
 * @private
 * @memberof DatosComunesComponent
 * @returns {void}
 * 
 * @remarks
 * - Solo actualiza si el formulario y estado están inicializados
 * - Excluye controles locales (manifests, bajoProtesta) y archivos
 * - Utiliza patchValue() para preservar validadores
 * 
 * @see {@link enPatchStoredFormData}
 */
private actualizarFormularioConDatosDelEstado(): void {
  if (this.forma && this.seccionState && this.esFormularioInicializado) {
    this.enCambioDeValor(this.seccionState.cuentaConEmpleadosPropios);
    this.toggleTablaPorValor(this.seccionState.cuentaConSubcontratacionEspecializada);
    const STATEVALOR = {
      sectorProductivo: this.seccionState.sectorProductivo,
      sectorServicio: this.seccionState.sectorServicio,
      cumplimientoFiscalAduanero: this.seccionState.cumplimientoFiscalAduanero,
      autorizaOpinionSAT: this.seccionState.autorizaOpinionSAT,
      cuentaConEmpleadosPropios: this.seccionState.cuentaConEmpleadosPropios,
      bimestreUltimo: this.seccionState.bimestreUltimo,
      numeroDeEmpleadas: this.seccionState.numeroDeEmpleadas,
      retencionISRTrabajadores: this.seccionState.retencionISRTrabajadores,
      pagoCuotasIMSS: this.seccionState.pagoCuotasIMSS,
      cuentaConSubcontratacionEspecializada: this.seccionState.cuentaConSubcontratacionEspecializada,
      registroPadronLFT: this.seccionState.registroPadronLFT,
      listadoSATArt69: this.seccionState.listadoSATArt69,
      listadoSATArt69B: this.seccionState.listadoSATArt69B,
      listadoSATArt69BBis: this.seccionState.listadoSATArt69BBis,
      certificadosSellosVigentes: this.seccionState.certificadosSellosVigentes,
      infringioSupuestos17HBis: this.seccionState.infringioSupuestos17HBis,
      mediosContactoActualizadosBuzon: this.seccionState.mediosContactoActualizadosBuzon,
      suspensionPadronImportadoresExportadores: this.seccionState.suspensionPadronImportadoresExportadores,
      querellaSATUltimos3Anios: this.seccionState.querellaSATUltimos3Anios,
      ingresoInfoContableSAT: this.seccionState.ingresoInfoContableSAT
    };

     
    this.forma.patchValue(STATEVALOR);
  }
}

      /**
     * Método genérico para manejar campos mutuamente excluyentes.
     * @param campoSeleccionado - El nombre del campo que se está seleccionando
     * @param campoAResetear - El nombre del campo que se debe resetear
     * @param valor - El valor seleccionado
     */
    manejarCamposMutuamenteExcluyentes(
      campoSeleccionado: string, 
      campoAResetear: string, 
      evento: Event
    ): void {
      const VALOR = (evento.target as HTMLSelectElement)?.value;
      if (VALOR) {
        // Resetear el campo opuesto
        this.forma.patchValue({
          [campoAResetear]: null
        });
        this.forma.get(campoAResetear)?.markAsPristine();
        // Guardar el valor seleccionado en el store
        this.setValoresStore(this.forma, campoSeleccionado);
        
        // Limpiar el valor del campo opuesto en el store
        this.tramite32611Store.actualizarEstado({ [campoAResetear]: null });
      }
    }  

/**
 * Maneja cambio de radio button y actualiza visibilidad de campos.
 * @param valor - Valor seleccionado ('0' o '1')
 */
  enCambioDeValor(valor: string | number): void {
    this.radioSeleccionado = valor === '1' ? true : false;
    
    // Enable/disable numeroDeEmpleadas and bimestreUltimo based on radio selection
    const NUMERO_EMPLEADOS_CONTROL = this.forma.get('numeroDeEmpleadas');
    const BIMESTRE_CONTROL = this.forma.get('bimestreUltimo');
    
    if (this.radioSeleccionado && this.esFormularioSoloLectura === false) {
      // Enable fields when "Sí" is selected
      NUMERO_EMPLEADOS_CONTROL?.enable();
      BIMESTRE_CONTROL?.enable();
    } else {
      // Disable fields when "No" is selected
      NUMERO_EMPLEADOS_CONTROL?.disable();
      BIMESTRE_CONTROL?.disable();
    }
  }

    /**
   * @method enPatchStoredFormData
   * Actualiza el formulario con los datos almacenados en el estado.
   */
  public enPatchStoredFormData(): void {
    this.tramite32611Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: Solicitud32611State) => {
        this.seccionState = datos;
        this.actualizarFormularioConDatosDelEstado();
      });
  }

  /**
   * Método para manejar el cambio de visibilidad de la tabla.
   * @param valor - Valor seleccionado ('1' para mostrar, '0' para ocultar)
   */
  toggleTablaPorValor(valor: string | number): void {
    this.esTablaVisible = valor === '1' ? true : false;
  } 

  /**
   * Maneja el cambio de selección para pagoCuotasIMSS y controla la visibilidad de "Respuesta Obligatoria".
   * @param valor - Valor seleccionado ('0' para No, '1' para Sí)
   */
  manejarPagoCuotasIMSS(valor: string | number): void {
    // Mostrar "Respuesta Obligatoria" solo cuando se selecciona "No" (valor '0')
    this.mostrarRespuestaObligatoria = valor === '0' || valor === 0; 
  }
  
  /**
   * @method actualizarValidacionSector
   * Actualiza la validación del sector marcando el formulario como tocado para que se muestren los errores.
   * 
   * @returns {void}
   */
  public actualizarValidacionSector(): void {
    if (this.forma) {
      // Marcar el formulario como tocado para que se muestren los errores de validación
      this.forma.markAsTouched();
      // Actualizar la validación
      this.forma.updateValueAndValidity();
    }
  }

  /**
   * @method tieneSectorValidationError
   * Verifica si el formulario tiene el error de validación de sector.
   * 
   * @returns {boolean} - `true` si hay error de validación de sector, de lo contrario `false`.
   */
  public tieneSectorValidationError(): boolean {
    return this.forma?.hasError('alMenosUnSector') && this.forma?.touched || false;
  }

  /**
   * @method esInvalido
   * Verifica si un control del formulario es inválido.
   * @param {string} nombreControl - Nombre del control a verificar.
   * @returns {boolean} - `true` si el control es inválido, de lo contrario `false`.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.forma.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
   * @param form - El formulario reactivo.
   * @param campo - El nombre del campo en el formulario.
   */
  setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.tramite32611Store.actualizarEstado({ [campo]: CONTROL.value });
      
      if (CONTROL.valid && CONTROL.touched) {
        CONTROL.markAsPristine();
      }
    }
  }

  /**
   * @method obtenerlistadescargable
   * Obtiene las listas necesarias para llenar los selectores del formulario.
   */
  obtenerlistadescargable(): void {
    this.solicitudService.sectorListaDeSelects()
      .pipe(takeUntil(this.destroyed$),
  map((data) => {
    this.sectorProductivoList = data.sectorProductivoList;
    this.sectorServicio = data.sectorServicioList;
    this.bimestreList = data.bimestreList;
  })
)
.subscribe();
  }

  /**
   * Envía los datos del formulario y muestra el modal de confirmación.
   * Si el formulario es inválido, marca todos los campos como tocados.
   */
  enviarDialogData(datos?:string): void {
    this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: datos ? datos : this.REQUISITO_OBLIGATORIO,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-md',
      };
  }


  /**
   * Método que se ejecuta cuando se selecciona una opción del botón de radio.
   * Habilita o deshabilita el diálogo de confirmación según la opción seleccionada.
   * @param {string, number} evento - El evento del cambio de valor del botón de radio.
   */
onSeleccionVerdadera(evento:string | number, nota?:string): void {
    if (evento && (evento === '1' || evento === 1)) {
      this.enviarDialogData(nota);
      this.esHabilitarElDialogo = true;
    } else {
      this.esHabilitarElDialogo = false;
    }
  
  }

  /**
   * Método que se ejecuta cuando se selecciona una opción del botón de radio.
   * Habilita o deshabilita el diálogo de confirmación según la opción seleccionada.
   * @param {string, number} evento - El evento del cambio de valor del botón de radio.
   * @param {string} nota - Nota opcional para enviar al diálogo.
   */
  onSeleccionfalsa(evento:string | number, nota?:string): void {
    if (evento && (evento === '0' || evento === 0)) {
      this.enviarDialogData(nota);
      this.esHabilitarElDialogo = true;
    } else {
      this.esHabilitarElDialogo = false;
    }
  
  }

   /**
   * Método para cerrar el modal de confirmación.
   * @returns {void}
   */
  cerrarModal(): void {
    this.esHabilitarElDialogo = false;
  }

  /**
   * Habilita o deshabilita dinámicamente los campos 'motivoRenunciaDeDerechos' y 'mercacniaSolicitudControlar'
   * según el estado de solo lectura del formulario.
   *
   * @returns void
   * @description Si el formulario está en modo solo lectura, deshabilita ambos campos; de lo contrario, los habilita.
   */
  actualizarEstadoCampos(): void {
    if (!this.forma) {
      return;
    }

    const CAMPOS = [
  "cumplimientoFiscalAduanero",
  "autorizaOpinionSAT",
  "cuentaConEmpleadosPropios",
  "retencionISRTrabajadores",
  "numeroDeEmpleadas",
  "pagoCuotasIMSS",
  "cuentaConSubcontratacionEspecializada",
  "registroPadronLFT",
  "listadoSATArt69",
  "listadoSATArt69B",
  "listadoSATArt69BBis",
  "certificadosSellosVigentes",
  "infringioSupuestos17HBis",
  "mediosContactoActualizadosBuzon",
  "suspensionPadronImportadoresExportadores",
  "archivoNacionales",
  "proveedores",
  "querellaSATUltimos3Anios",
  "ingresoInfoContableSAT",
  "manifests",
  "bajoProtesta"
];
    CAMPOS.forEach(campo => {
      const CONTROL = this.forma.get(campo);
      if (CONTROL) {
        if (this.esFormularioSoloLectura) {
          CONTROL.disable();
        } else {
          CONTROL.enable();
        }
      }
    });
  }

  /**
  * @method validarFormulario
  * Valida todos los controles del formulario.
  * 
  * Marca todos los controles como tocados y actualiza su estado de validación
  * para mostrar los errores correspondientes en la interfaz de usuario.
  * También valida los formularios de los componentes hijo.
  * 
  * @returns {void}
  */
validarFormulario(): boolean {
  let isValid = true;

  if (this.forma) {
    this.forma.markAllAsTouched();
    this.forma.updateValueAndValidity();

    if (this.forma.invalid) {
      isValid = false;
    }
  } else {
    isValid = false;
  }

  if (this.controlInventariosComponent) {
    const CONTROL_INVENTARIOS_VALID = this.controlInventariosComponent.validarFormularios();
    if (!CONTROL_INVENTARIOS_VALID) {
      isValid = false;
    }
  }

  if (this.domiciliosRfcSolicitanteComponent) {
    const DOMICILIOS_VALID = this.domiciliosRfcSolicitanteComponent.validarDomiciliosRfcSolicitante();
    if (!DOMICILIOS_VALID) {
      isValid = false;
    }
  }

  if (this.agregarMiembroEmpresaComponent) {
    const MIEMBRO_EMPRESA_VALID = this.agregarMiembroEmpresaComponent.validarAgregarMiembroEmpresa();
    if (!MIEMBRO_EMPRESA_VALID) {
      isValid = false;
    }
  }

  return isValid;
}



    /**
   * Maneja el cambio en el reconocimiento mutuo CTPAT y emite el valor seleccionado.
   *
   * @param {string} value - El valor seleccionado para reconocimiento mutuo CTPAT.
   */
  onReconocimientoMutuoCTPATChanged(value: string): void {
    this.reconocimientoMutuoCTPATChange.emit(value);
  }
 
 
  /**
   * @method ngOnDestroy
   * Hook de ciclo de vida que se ejecuta al destruir el componente.
   * Libera recursos y suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}

/**
 * Validador personalizado que verifica que al menos uno de los campos sectorProductivo o sectorServicio tenga un valor seleccionado.
 * 
 * @param {AbstractControl} control - El control del formulario que contiene los campos a validar
 * @returns {ValidationErrors | null} - Retorna un objeto de error si la validación falla, null si es válida
 */
function alMenosUnSectorValidator(control: AbstractControl): ValidationErrors | null {
  const SECTOR_PRODUCTIVO = control.get('sectorProductivo')?.value;
  const SECTOR_SERVICIO = control.get('sectorServicio')?.value;
  
  // Si al menos uno de los dos campos tiene un valor válido (no null, undefined, o string vacío)
  const TIENE_SECTOR_PRODUCTIVO = SECTOR_PRODUCTIVO && SECTOR_PRODUCTIVO !== '' && SECTOR_PRODUCTIVO !== -1;
  const TIENE_SECTOR_SERVICIO = SECTOR_SERVICIO && SECTOR_SERVICIO !== '' && SECTOR_SERVICIO !== -1;
  
  if (!TIENE_SECTOR_PRODUCTIVO && !TIENE_SECTOR_SERVICIO) {
    return { alMenosUnSector: true };
  }
  
  return null;
}
