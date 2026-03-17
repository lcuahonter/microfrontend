import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { 
  Catalogo, 
  CatalogoSelectComponent, 
  CatalogosSelect,
  CategoriaMensaje,
  InputFecha,
  InputFechaComponent,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  REGEX_SOLO_NÚMERO, 
  REGEX_TODOS_CEROS,  
  TablaDinamicaComponent,  
  TipoNotificacionEnum,
  TituloComponent
} from '@libs/shared/data-access-user/src';
import { FECHA_DE_INICIO, FECHA_DE_PAGO, FECHA_DE_VIGENCIA } from '../../constants/solicitud.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputRadio, SolicitudRadioLista } from '../../models/solicitud.model';
import { Solicitud32611State, Solicitud32611Store } from '../../estados/solicitud32611.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AgregarTransportistasComponent } from '../agregar-transportistas/agregar-transportistas.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import { NOTA } from '../../constants/oea-textil-registro.enum';
import { Solicitud32611Query } from '../../estados/solicitud32611.query';
import { SolicitudService } from '../../services/solicitud.service';

/**
 * Componente principal para gestionar los datos de importador y exportador
 * en el formulario, incluyendo la integración con transportistas y validaciones
 * dinámicas.
 */
@Component({
  selector: 'app-auto-transportista',
  standalone: true,
  imports: [
    CatalogoSelectComponent,
    CommonModule,
    ReactiveFormsModule,
    InputRadioComponent,
    NotificacionesComponent,
    InputFechaComponent,
    TituloComponent,
    TablaDinamicaComponent,
    AgregarTransportistasComponent,
  ],
  providers: [BsModalService],
  
  templateUrl: './auto-transportista.component.html',
  styleUrl: './auto-transportista.component.scss',
})
export class AutoTransportistaComponent implements OnInit, OnDestroy, AfterViewInit {
  /** Formulario reactivo para el componente importador-exportador */
  autoTransportistaForm!: FormGroup;

  /** Sujeto que maneja la destrucción de suscripciones */
  private destroy$: Subject<void> = new Subject<void>();

  /** Opciones de radio para la selección de valores */
  sinoOpcion: InputRadio = {} as InputRadio;
  /**
   * Representa una opción de radio para el reconocimiento mutuo.
   * Se utiliza para manejar las opciones relacionadas con el mutuo en el formulario.
   */
  mutuo: InputRadio = {} as InputRadio;

  /**
   * Representa una opción de radio para la clasificación de la información.
   * Se utiliza para manejar las opciones relacionadas con la clasificación de la información en el formulario.
   */
  clasificacionInformacion: InputRadio = {} as InputRadio;

  /** Estado de la solicitud */
  solicitud32611State: Solicitud32611State = {} as Solicitud32611State;

  /** Fechas de inicio y pago de la solicitud */
  fechaDeFinDeVigencia: InputFecha = FECHA_DE_INICIO;
  /**
   * Fecha de pago asociada a la solicitud.
   * Se inicializa con el valor constante `FECHA_DE_PAGO` que contiene la fecha predeterminada de pago.
   */
  fechaDePago: InputFecha = FECHA_DE_PAGO;

/**
   * Fecha de pago asociada a la solicitud.
   * Se inicializa con el valor constante `FECHA_DE_VIGENCIA` que contiene la fecha predeterminada de pago.
   */
  fechaDeVigencia: InputFecha = FECHA_DE_VIGENCIA;

    /**
     * Mensaje que indica un requisito obligatorio para acceder a la nota.
     */
    REQUISITO_OBLIGATORIO_ESQUEMA_CERTIFICACION = NOTA.REQUISITO_OBLIGATORIO_ESQUEMA_CERTIFICACION;

  /**
  * Configuración para el catálogo de bancos.
  */
  public bancoCatalogo: CatalogosSelect = {
    labelNombre: 'Banco',
    required: false,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  };

  /**
   * Indica si el diálogo de notificación está habilitado.
   */
  public esHabilitarElDialogo: boolean = false;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /** Referencia a la vista del modal de transportistas */
  @ViewChild('transportistas', { static: false })
  transportistaElement!: ElementRef;

  /**
  * Instancia del modal de confirmación
  */
  confirmInstance!: Modal;

  /**
     * Notificación que se muestra al usuario.
     */
    public nuevaNotificacion!: Notificacion;

  /**
  * Referencia al modal de confirmación
  */
  @ViewChild('confirmModal', { static: false }) confirmModal!: ElementRef;


  /**
   * Constructor del componente
   * @param fb FormBuilder para crear formularios reactivos
   * @param solicitudService Servicio para manejar la lógica de solicitudes
   * @param solicitud32611Store Store para manejar el estado de la solicitud
   * @param solicitud32611Query Consulta para obtener el estado de la solicitud
   */
  constructor(
    private fb: FormBuilder,
    @Inject(BsModalService)
    private modalService: BsModalService,
    public solicitudService: SolicitudService,
    public solicitud32611Store: Solicitud32611Store,
    public solicitud32611Query: Solicitud32611Query,
    public consultaioQuery: ConsultaioQuery
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.conseguirOpcionDeRadio();
    this.obtenerDatosBanco();
  }

  /**
   * Método llamado al inicializar el componente, configura el formulario con los valores del estado de solicitud
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
  * Método del ciclo de vida que se ejecuta después de que se inicializa la vista del componente.
  * Se encarga de configurar la instancia del modal de confirmación utilizando Bootstrap Modal.
  * Este método es llamado automáticamente por Angular una vez que todas las vistas hijo
  * han sido inicializadas completamente.
  * 
  * @returns {void} No retorna ningún valor
  */
  ngAfterViewInit(): void {
    if (this.confirmModal) {
      this.confirmInstance = new Modal(this.confirmModal.nativeElement);
    }
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.autoTransportistaForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.autoTransportistaForm.enable();
    }
  }

  /**
   * Inicializa el formulario `autoTransportistaForm` con los valores del estado actual `solicitud32611State`.
   *
   * Este formulario recopila información relacionada con operaciones de importación y exportación,
   *
   * Detalles del formulario:
   * - Algunos campos como `fechaInicio` se inician deshabilitados y con validaciones (`Validators.required`).
   * - Otros campos tienen validaciones específicas como `Validators.maxLength`.
   *
   * El método también se suscribe al observable `selectSolicitud$` para actualizar el formulario cuando
   * cambie el estado global de la solicitud.
   *
   * La suscripción se gestiona con `takeUntil` para evitar fugas de memoria.
   */
  inicializarFormulario(): void {
    this.autoTransportistaForm = this.fb.group({
      autotransporteDosAnios: [this.solicitud32611State.autotransporteDosAnios],
      permisoVigenteSCT: [this.solicitud32611State.permisoVigenteSCT],
      numeroRegistroCAAT: [this.solicitud32611State.numeroRegistroCAAT],
      numeroUnidadesPropias: [this.solicitud32611State.numeroUnidadesPropias],
      numeroUnidadesArrendadas: [this.solicitud32611State.numeroUnidadesArrendadas],
      fechaInicio: [
        { value: this.solicitud32611State.fechaInicio, disabled: true },
        Validators.required,
      ],
      fechaPago: [this.solicitud32611State.fechaPago],
      fechaVigencia: [this.solicitud32611State.fechaVigencia],
      sistemasRastreo: [this.solicitud32611State.sistemasRastreo],
      seguridadPerfilTransportista: [this.solicitud32611State.seguridadPerfilTransportista],
      reconocimientoMuto: [this.solicitud32611State.reconocimientoMuto],
      socioComercialRFCListado: [this.solicitud32611State.socioComercialRFCListado],
      socioComercialNombre: [this.solicitud32611State.socioComercialNombre],
      direccionFiscal: [this.solicitud32611State.direccionFiscal],
      paginaElectronica: [this.solicitud32611State.paginaElectronica],
      paginaElectronicaURL: [this.solicitud32611State.paginaElectronicaURL],
      correoElectronicoContacto: [
        this.solicitud32611State.correoElectronicoContacto,

      ],
      correoElectronicoContactoEmail: [
        this.solicitud32611State.correoElectronicoContactoEmail,

      ],
      telefonoContacto: [
        this.solicitud32611State.telefonoContacto
      ],
      clasificacionInformacionEmpresa: [this.solicitud32611State.clasificacionInformacionEmpresa],
      llave: [this.solicitud32611State.llave, [Validators.required]],
      claveReferencia: [this.solicitud32611State.claveReferencia, [Validators.required]],
      cadenaDependencia: [this.solicitud32611State.cadenaDependencia, [Validators.required]],
      lada1: [this.solicitud32611State.lada1],
      lada2: [this.solicitud32611State.lada2],
      lada3: [this.solicitud32611State.lada3],
      telefono1: [this.solicitud32611State.telefono1],
      telefono2: [this.solicitud32611State.telefono2],
      telefono3: [this.solicitud32611State.telefono3],
      importePago: [this.solicitud32611State.importePago],
      banco: [this.solicitud32611State.banco],
      numeroOperacion: [this.solicitud32611State.numeroOperacion],
    });

    this.solicitud32611Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud32611State) => {
          this.solicitud32611State = respuesta;
          this.autoTransportistaForm.patchValue({
            autotransporteDosAnios: this.solicitud32611State.autotransporteDosAnios,
            permisoVigenteSCT: this.solicitud32611State.permisoVigenteSCT,
            numeroUnidadesPropias: this.solicitud32611State.numeroUnidadesPropias,
            numeroUnidadesArrendadas: this.solicitud32611State.numeroUnidadesArrendadas,
            fechaInicio: this.solicitud32611State.fechaInicio,
            fechaPago: this.solicitud32611State.fechaPago,
            fechaVigencia: this.solicitud32611State.fechaVigencia,
            sistemasRastreo: this.solicitud32611State.sistemasRastreo,
            seguridadPerfilTransportista: this.solicitud32611State.seguridadPerfilTransportista,
            reconocimientoMuto: this.solicitud32611State.reconocimientoMuto,
            socioComercialRFCListado: this.solicitud32611State.socioComercialRFCListado,
            socioComercialNombre: this.solicitud32611State.socioComercialNombre,
            direccionFiscal: this.solicitud32611State.direccionFiscal,
            paginaElectronica: this.solicitud32611State.paginaElectronica,
            paginaElectronicaURL: this.solicitud32611State.paginaElectronicaURL,
            correoElectronicoContacto: this.solicitud32611State.correoElectronicoContacto,
            correoElectronicoContactoEmail: this.solicitud32611State.correoElectronicoContactoEmail,
            telefonoContacto: this.solicitud32611State.telefonoContacto,
            clasificacionInformacionEmpresa: this.solicitud32611State.clasificacionInformacionEmpresa,
            llave: this.solicitud32611State.llave,
            claveReferencia: this.solicitud32611State.claveReferencia,
            cadenaDependencia: this.solicitud32611State.cadenaDependencia,
            lada1: this.solicitud32611State.lada1,
            lada2: this.solicitud32611State.lada2,
            lada3: this.solicitud32611State.lada3,
            telefono1: this.solicitud32611State.telefono1,
            telefono2: this.solicitud32611State.telefono2,
            telefono3: this.solicitud32611State.telefono3,
            banco: this.solicitud32611State.banco,
            numeroOperacion: this.solicitud32611State.numeroOperacion,
            importePago: this.solicitud32611State.importePago,
          });
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
          mensaje: datos ? datos : this.REQUISITO_OBLIGATORIO_ESQUEMA_CERTIFICACION,
          cerrar: false,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
          tamanioModal: 'modal-md',
        };
    }

  /**
   * Obtiene las opciones de radio desde el servicio de solicitud
   */
  conseguirOpcionDeRadio(): void {
    this.solicitudService
      .conseguirOpcionDeRadio()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudRadioLista) => {
          this.sinoOpcion = respuesta.requisitos;
          this.mutuo = respuesta.reconocimientoMutuo;
          this.clasificacionInformacion = respuesta.clasificacionInformacion;
        },
      });
  }

  /**
    * Obtiene los datos del catálogo de bancos desde el servicio.
    */
  obtenerDatosBanco(): void {
    this.solicitudService
      .obtenerDatosBanco()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp): void => {
        this.bancoCatalogo.catalogos = resp as Catalogo[];
      });
  }

  /**
   * Actualiza el valor de la propiedad 2042 en el store
   * @param evento Nuevo valor para la propiedad
   */
  actualizar(valor: string | number, campo: string, nota?: string): void {

    this.solicitud32611Store.actualizarEstado({ [campo]: valor });


    if (campo === 'autotransporteDosAnios' && parseInt(valor as string, 10) === 2) {
      this.enviarDialogData(nota);
      this.esHabilitarElDialogo = true;
      // this.openConfirmModal();
      this.autoTransportistaForm.get('fechaInicio')?.reset();
      this.solicitud32611Store.actualizarEstado({ fechaInicio: this.autoTransportistaForm.get('fechaInicio')?.value });
    }
    else if (campo === 'permisoVigenteSCT' && parseInt(valor as string, 10) === 2) {
      this.autoTransportistaForm.get('numeroUnidadesPropias')?.reset();
      this.autoTransportistaForm.get('numeroUnidadesPropias')?.disable();
      this.autoTransportistaForm.get('numeroUnidadesArrendadas')?.reset();
      this.autoTransportistaForm.get('numeroUnidadesArrendadas')?.disable();
      this.solicitud32611Store.actualizarEstado({
        numeroUnidadesPropias: this.autoTransportistaForm.get('numeroUnidadesPropias')?.value,
        numeroUnidadesArrendadas: this.autoTransportistaForm.get('numeroUnidadesArrendadas')?.value
      });
       this.enviarDialogData(nota);
      this.esHabilitarElDialogo = true;
      // this.openConfirmModal();
    }
    else if (campo === 'permisoVigenteSCT' && parseInt(valor as string, 10) === 1) {
      this.autoTransportistaForm.get('numeroUnidadesPropias')?.enable();
      this.autoTransportistaForm.get('numeroUnidadesArrendadas')?.enable();
    }
    else if (campo === 'sistemasRastreo' && parseInt(valor as string, 10) === 2) {
 this.enviarDialogData(nota);
      this.esHabilitarElDialogo = true;
        }
    else if (campo === 'paginaElectronica' && parseInt(valor as string, 10) === 2) {
      this.autoTransportistaForm.get('paginaElectronicaURL')?.reset();
      this.solicitud32611Store.actualizarEstado({
        paginaElectronicaURL: this.autoTransportistaForm.get('paginaElectronicaURL')?.value
      });
    }
    else if (campo === 'correoElectronicoContacto' && parseInt(valor as string, 10) === 2) {
      this.autoTransportistaForm.get('correoElectronicoContactoEmail')?.reset();
      this.solicitud32611Store.actualizarEstado({
        correoElectronicoContactoEmail: this.autoTransportistaForm.get('correoElectronicoContactoEmail')?.value
      });
    }
    else{
            this.esHabilitarElDialogo = false;
    }
  }

  setValorsStore(campo: string): void {

    const VALOR = this.autoTransportistaForm.get(campo)?.value

    this.solicitud32611Store.actualizarEstado({ [campo]: VALOR });
  }

   /**
   * Método para cerrar el modal de confirmación.
   * @returns {void}
   */
  cerrarModal(): void {
    this.esHabilitarElDialogo = false;
  }




  /**
* Abre el modal de confirmación
*/
  openConfirmModal(): void {
    if (this.confirmInstance) {

      this.confirmInstance.show();
    }
  }

  /**
   * Cierra el modal de confirmación
   */
  closeConfirmModal(): void {
    if (this.confirmInstance) {
      this.confirmInstance.hide();
    }
  }

  /**
   * Verifica si el evento de teclado corresponde a un número
   * @param event Evento de teclado
   * @returns true si es un número, false en caso contrario
   */
  // eslint-disable-next-line class-methods-use-this
  soloNumeros(event: KeyboardEvent): boolean {
    const INPUTCHAR = event.key;
    return REGEX_SOLO_NÚMERO.test(INPUTCHAR);
  }

  /**
   * Verifica si se debe mostrar la etiqueta de unidades arrendadas
   * @returns true si el campo está modificado y tiene un valor distinto de cero, false en caso contrario
   */
  debeMostrarEtiquetaArrendadas(): boolean {
    const VALOR = this.autoTransportistaForm.get('numeroUnidadesArrendadas')?.value;
    const ESTAMODIFICADO = this.autoTransportistaForm.get('numeroUnidadesArrendadas')?.dirty;
    return ESTAMODIFICADO && VALOR && !REGEX_TODOS_CEROS.test(VALOR);
  }

  /**
   * Calcula la cantidad de teléfonos válidos ingresados en el formulario
   * @returns Número de teléfonos válidos
   */

  get cantidadTelefonosValidos(): number {
    const FORM = this.autoTransportistaForm;
    let count = 0;

    for (let i = 1; i <= 3; i++) {
      const LADA = FORM.get(`lada${i}`)?.value?.trim();
      const TELEFONO = FORM.get(`telefono${i}`)?.value?.trim();

      if (LADA && TELEFONO) {
        count++;
      }
    }

    return count;
  }

  /**
   * Verifica si se debe mostrar un error en los campos de teléfono
   * @returns true si el campo de contacto es 1 y la cantidad de teléfonos válidos es menor a 2, false en caso contrario
   */

  debeMostrarErrorTelefonos(): boolean {
    return this.autoTransportistaForm.get('telefonoContacto')?.value === 1 &&
      this.cantidadTelefonosValidos < 2;
  }

  /**
 * Valida todos los formularios de terceros relacionados antes de permitir continuar.
 * Este método coordina la validación de múltiples formularios hijo y se asegura de que
 * toda la información requerida esté correctamente completada.
 */
validarFormulario(): boolean {
  let isValid = true;

  if (this.autoTransportistaForm.invalid) {
    this.autoTransportistaForm.markAllAsTouched();
    isValid = false;
  }

  const FECHA_INICIO = this.autoTransportistaForm.get('fechaInicio')?.value;
  const TIENE_DOS_ANIOS = this.autoTransportistaForm.get('autotransporteDosAnios')?.value === 1;
  if (TIENE_DOS_ANIOS && (!FECHA_INICIO || FECHA_INICIO === '')) {
    this.autoTransportistaForm.get('fechaInicio')?.markAsTouched();
    isValid = false;
  }

  const TIENE_RASTREO = this.autoTransportistaForm.get('sistemasRastreo')?.value;
  if (TIENE_RASTREO === 2) {
    this.autoTransportistaForm.get('sistemasRastreo')?.markAsTouched();
    isValid = false;
  }

  const TIENE_PERFIL = this.autoTransportistaForm.get('seguridadPerfilTransportista')?.value;
  if (TIENE_PERFIL === 2) {
    this.autoTransportistaForm.get('seguridadPerfilTransportista')?.markAsTouched();
    isValid = false;
  }

  const PAGINA = this.autoTransportistaForm.get('paginaElectronica')?.value;
  const PAGINA_URL = this.autoTransportistaForm.get('paginaElectronicaURL')?.value;
  if (PAGINA === 1 && (!PAGINA_URL || PAGINA_URL.trim() === '')) {
    this.autoTransportistaForm.get('paginaElectronicaURL')?.markAsTouched();
    isValid = false;
  }

  const CORREO = this.autoTransportistaForm.get('correoElectronicoContacto')?.value;
  const CORREO_INPUT = this.autoTransportistaForm.get('correoElectronicoContactoEmail')?.value;
  if (CORREO === 1 && (!CORREO_INPUT || CORREO_INPUT.trim() === '')) {
    this.autoTransportistaForm.get('correoElectronicoContactoEmail')?.markAsTouched();
    isValid = false;
  }

  const TELEFONO_CONTACTO = this.autoTransportistaForm.get('telefonoContacto')?.value;
  if (TELEFONO_CONTACTO === 1 && this.cantidadTelefonosValidos < 2) {
    this.autoTransportistaForm.get('telefonoContacto')?.markAsTouched();
    ['lada1', 'telefono1', 'lada2', 'telefono2', 'lada3', 'telefono3'].forEach(campo => {
      this.autoTransportistaForm.get(campo)?.markAsTouched();
    });
    isValid = false;
  }

  return isValid;
}

  /**
   * Método llamado al destruir el componente, limpia las suscripciones
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
