import { Component,ElementRef,OnDestroy, OnInit, ViewChild } from '@angular/core'; 
import { ConfiguracionColumna, Notificacion, NotificacionesComponent, Pedimento, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src'; 
import { ENLACE_OPERATIVO_CONFIGURACION, RECIBIR_NOTIFICACIONES_CONFIGURACION } from '../../constants/solicitud.enum'; 
import { EnlaceOperativo, RecibirNotificaciones, RepresentanteLegal } from '../../models/solicitud.model'; 
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { Solicitud32607State, Solicitud32607Store } from '../../estados/solicitud32607.store'; 
import { Subject, map, takeUntil } from 'rxjs'; 
import { AgregarEnlaceOperativoComponent } from '../agregar-enlace-operativo/agregar-enlace-operativo.component'; 
import { CommonModule } from '@angular/common'; 
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap'; 
import { Solicitud32607Query } from '../../estados/solicitud32607.query'; 
import { SolicitudService } from '../../services/solicitud.service';

/**
 * Componente encargado de mostrar la lista de terceros relacionados
 * que pueden recibir notificaciones. Utiliza una tabla dinámica para
 * mostrar los datos obtenidos del servicio `SolicitudService`.
 */
@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    TablaDinamicaComponent,
    AgregarEnlaceOperativoComponent,
    NotificacionesComponent,
  ],
  providers: [SolicitudService],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss',
})
/**
 * Componente encargado de mostrar la lista de terceros relacionados
 * que pueden recibir notificaciones. Utiliza una tabla dinámica para
 * mostrar los datos obtenidos del servicio `SolicitudService`.
 */
export class TercerosRelacionadosComponent implements OnInit, OnDestroy {
  /** Notificación que se mostrará al usuario */
  public nuevaNotificacion!: Notificacion;

  /** Elemento para eliminar de la tabla de pedimentos */
  elementoParaEliminar!: number;

  /** Formulario reactivo para gestionar la información de los terceros relacionados */
  tercerosRelacionadosForm!: FormGroup;

  /** Tipo de selección para la tabla (por defecto: UNDEFINED) */
  tipoSeleccionTabla = TablaSeleccion.UNDEFINED;

  /** Tipo de selección para la tabla de enlace operativo (por defecto: CHECKBOX) */
  enlaceOperativoTabla = TablaSeleccion.CHECKBOX;

  /** Lista de pedimentos */
  pedimentos: Array<Pedimento> = [];

  /** Datos seleccionados para el enlace operativo */
  seleccionEnlaceOperativoDatos: EnlaceOperativo[] = [] as EnlaceOperativo[];

  /** Configuración de las columnas de la tabla de enlace operativo */
  enlaceOperativoConfiguracionColumnas: ConfiguracionColumna<EnlaceOperativo>[] =
    ENLACE_OPERATIVO_CONFIGURACION;

  /** Lista de enlaces operativos */
  enlaceOperativosLista: EnlaceOperativo[] = [] as EnlaceOperativo[];

  /** Referencia al componente de enlace operativo para abrir el modal */
  @ViewChild('agregarEnlaceOperativo', { static: false })
  modificacionEnlaceOperativoElement!: ElementRef;

  /** Configuración de las columnas para la tabla de notificaciones */
  configuracionColumnas: ConfiguracionColumna<RecibirNotificaciones>[] =
    RECIBIR_NOTIFICACIONES_CONFIGURACION;

  /** Lista de notificaciones que el tercero puede recibir */
  orecibirNotificacionesLista: RecibirNotificaciones[] =
    [] as RecibirNotificaciones[];

  /** Subject que controla la destrucción de las suscripciones */
  private destroy$: Subject<void> = new Subject<void>();

  /** Estado de la solicitud actual */
  solicitud32607State: Solicitud32607State = {} as Solicitud32607State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * 
   * Inyecta los servicios necesarios para manejar formularios, acceder y modificar el estado 
   * de la solicitud, así como realizar consultas auxiliares.
   * 
   * @param fb - Servicio para crear y gestionar formularios reactivos.
   * @param solicitudService - Servicio encargado de las operaciones relacionadas con la solicitud.
   * @param solicitud32607Store - Store para actualizar el estado de la solicitud 32607.
   * @param solicitud32607Query - Consulta del estado de la solicitud 32607.
   * @param consultaioQuery - Consulta de catálogos u otros datos auxiliares.
   */
  constructor(
    private fb: FormBuilder,
    public solicitudService: SolicitudService,
    public solicitud32607Store: Solicitud32607Store,
    public solicitud32607Query: Solicitud32607Query,
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
    this.conseguirEnlaceOperativoDatos();
    this.conseguirRecibirNotificaciones();
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Configura el formulario reactivo con los valores actuales de la solicitud.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
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
      this.tercerosRelacionadosForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.tercerosRelacionadosForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario `miembroEmpresaForm` con los datos del estado actual `solicitud32607State`.
   *
   * Este formulario recopila información detallada sobre un miembro de la empresa, como su nombre,
   * nacionalidad, RFC, tipo de persona y relación con la empresa.
   */
  inicializarFormulario(): void {
    this.tercerosRelacionadosForm = this.fb.group({
      idPersonaSolicitud: [this.solicitud32607State.idPersonaSolicitud],
      rfcTercero: [this.solicitud32607State.rfcTercero, [Validators.required]],
      rfc: [{ value: this.solicitud32607State.rfc, disabled: true }],
      nombre: [{ value: this.solicitud32607State.nombre, disabled: true }],
      apellidoPaterno: [
        { value: this.solicitud32607State.apellidoPaterno, disabled: true },
      ],
      apellidoMaterno: [
        { value: this.solicitud32607State.apellidoMaterno, disabled: true },
      ],
      telefono: [this.solicitud32607State.telefono, [Validators.required]],
      correoElectronico: [
        this.solicitud32607State.correoElectronico,
        [Validators.required, Validators.email],
      ],
    });

    this.solicitud32607Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud32607State) => {
          this.solicitud32607State = respuesta;
          this.tercerosRelacionadosForm.patchValue({
            idPersonaSolicitud: this.solicitud32607State.idPersonaSolicitud,
            rfcTercero: this.solicitud32607State.rfcTercero,
            rfc: this.solicitud32607State.rfc,
            nombre: this.solicitud32607State.nombre,
            apellidoPaterno: this.solicitud32607State.apellidoPaterno,
            apellidoMaterno: this.solicitud32607State.apellidoMaterno,
            telefono: this.solicitud32607State.telefono,
            correoElectronico: this.solicitud32607State.correoElectronico,
          });
          this.enlaceOperativosLista =
            this.solicitud32607State.enlaceOperativosLista;
        })
      )
      .subscribe();
  }

  /**
   * Método que obtiene la lista de notificaciones que puede recibir el tercero.
   */
  conseguirRecibirNotificaciones(): void {
    this.solicitudService
      .conseguirRecibirNotificaciones()
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: RecibirNotificaciones[]) => {
        this.orecibirNotificacionesLista = respuesta;
      });
  }

  /**
   * Método que obtiene los datos de enlace operativo para ser mostrados en la tabla.
   */
  conseguirEnlaceOperativoDatos(): void {
    this.solicitudService
      .conseguirEnlaceOperativoDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: EnlaceOperativo[]) => {
        this.enlaceOperativosLista = respuesta;
      });
  }

  /**
   * Método que busca los datos de un tercero por su RFC.
   */
  buscarTerceroNacionalIDC(): void {
    if (this.tercerosRelacionadosForm.get('rfcTercero')?.value) {
      this.solicitudService
        .conseguirRepresentanteLegalDatos()
        .pipe(takeUntil(this.destroy$))
        .subscribe((respuesta: RepresentanteLegal) => {
          this.solicitud32607Store.actualizarRfc(respuesta.rfc);
          this.solicitud32607Store.actualizarNombre(respuesta.nombre);
          this.solicitud32607Store.actualizarApellidoPaterno(
            respuesta.apellidoPaterno
          );
          this.solicitud32607Store.actualizarApellidoMaterno(
            respuesta.apellidoMaterno
          );
          this.solicitud32607Store.actualizarTelefono(respuesta.telefono);
          this.solicitud32607Store.actualizarCorreoElectronico(
            respuesta.correoElectronico
          );
        });
    }
  }

  /** Métodos para actualizar los valores en el store */
  actualizarRfcTercero(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32607Store.actualizarRfcTercero(VALOR);
  }

  /** Métodos para actualizar los valores en el store */
  actualizarTelefono(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32607Store.actualizarTelefono(VALOR);
  }

  /** Métodos para actualizar los valores en el store */
  actualizarCorreoElectronico(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud32607Store.actualizarCorreoElectronico(VALOR);
  }

  /**
   * Abre el modal para guardar datos del enlace operativo.
   */
  guardarDatosEnlaceOperativo(): void {
    if (this.modificacionEnlaceOperativoElement) {
      const MODAL_INSTANCE = new Modal(
        this.modificacionEnlaceOperativoElement.nativeElement
      );
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Guarda la modificación del enlace operativo en el modal.
   */
  guardarModificacionEnlaceOperativo(): void {
    if (this.modificacionEnlaceOperativoElement) {
      const MODAL_INSTANCE = new Modal(
        this.modificacionEnlaceOperativoElement.nativeElement
      );
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Selecciona un enlace operativo para su modificación.
   */
  seleccionEnlaceOperativo(evento: EnlaceOperativo[]): void {
    this.seleccionEnlaceOperativoDatos = evento;
  }

  /**
   * Cierra la notificación mostrada al usuario.
   */
  cerrarDialogoEnlaceOperativo(): void {
    if (this.seleccionEnlaceOperativoDatos.length > 0) {
      this.enlaceOperativosLista = this.enlaceOperativosLista.filter(
        (element) => element.rfc !== this.seleccionEnlaceOperativoDatos[0].rfc
      );
    }
  }

  /**
   * Método que agrega un enlace operativo y un pedimento vacío a la lista de enlace operativos.
   * Abre un modal de notificación si no se cumple la condición de registro.
   *
   * @param evento El objeto de tipo EnlaceOperativo que se va a agregar a la lista
   */
  agregarEnlaceOperativo(evento: EnlaceOperativo): void {
    const PEDIMENTO = {
      patente: 0,
      pedimento: 0,
      aduana: 0,
      idTipoPedimento: 0,
      descTipoPedimento: 'Por evaluar',
      numero: '',
      comprobanteValor: '',
      pedimentoValidado: false,
    };
    this.abrirModal(
      'Se debe registrar por lo menos un enlace operativo que no sea suplente.'
    );
    this.pedimentos.push(PEDIMENTO);
    this.enlaceOperativosLista = [...this.enlaceOperativosLista, evento];
    this.solicitud32607Store.actualizarEnlaceOperativosLista(
      this.enlaceOperativosLista
    );
  }

  /**
   * Método que abre un modal para mostrar una notificación con el mensaje proporcionado.
   *
   * @param mensaje El mensaje que se mostrará en la notificación
   * @param i Índice opcional para indicar qué elemento se eliminará (por defecto 0)
   */
  abrirModal(mensaje: string, i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.elementoParaEliminar = i;
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Se encarga de emitir y completar el subject para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
