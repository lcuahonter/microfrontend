import { AgregarEnlaceOperativoComponent } from '../agregar-enlace-operativo/agregar-enlace-operativo.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { ENLACE_OPERATIVO_CONFIGURACION} from '../../constants/solicitud.enum';
import { ElementRef } from '@angular/core';
import { EnlaceOperativo } from '../../models/solicitud.model';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import { Notificacion } from '@libs/shared/data-access-user/src';
import { NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Pedimento } from '@libs/shared/data-access-user/src';
import { RECIBIR_NOTIFICACIONES_CONFIGURACION } from '../../constants/solicitud.enum';
import { ReactiveFormsModule } from '@angular/forms';
import { RecibirNotificaciones } from '../../models/solicitud.model';
import { RepresentanteLegal } from '../../models/solicitud.model';
import { SolicitudQuery } from '../../estados/solicitud.query';
import { SolicitudState } from '../../estados/solicitud.store';
import { SolicitudStore } from '../../estados/solicitud.store';
import { SolicitudeService } from '../../services/solicitude.service';
import { Subject } from 'rxjs';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';
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
  solicitudState: SolicitudState = {} as SolicitudState;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente, inyecta el servicio `SolicitudService` y
   * realiza las cargas iniciales de datos.
   *
   * @param solicitudService Servicio que maneja las solicitudes
   * @param SolicitudStore Almacena el estado de la solicitud
   * @param SolicitudQuery Consulta el estado de la solicitud
   */
  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudeService,
    private SolicitudStore: SolicitudStore,
    private SolicitudQuery: SolicitudQuery,
    private consultaioQuery: ConsultaioQuery
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
    } else {
      this.tercerosRelacionadosForm.enable();
    } 
  }

  /**
   * Inicializa el formulario `miembroEmpresaForm` con los datos del estado actual `SolicitudState`.
   *
   * Este formulario recopila información detallada sobre un miembro de la empresa, como su nombre,
   * nacionalidad, RFC, tipo de persona y relación con la empresa.
   */
  inicializarFormulario(): void {
    this.tercerosRelacionadosForm = this.fb.group({
      idPersonaSolicitud: [this.solicitudState.idPersonaSolicitud],
      rfcTercero: [this.solicitudState.rfcTercero, [Validators.required]],
      rfc: [{ value: this.solicitudState.rfc, disabled: true }],
      nombre: [{ value: this.solicitudState.nombre, disabled: true }],
      apellidoPaterno: [
        { value: this.solicitudState.apellidoPaterno, disabled: true },
      ],
      apellidoMaterno: [
        { value: this.solicitudState.apellidoMaterno, disabled: true },
      ],
      telefono: [this.solicitudState.telefono, [Validators.required]],
      correoElectronico: [
        this.solicitudState.correoElectronico,
        [Validators.required, Validators.email],
      ],
    });

    this.SolicitudQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: SolicitudState) => {
          this.solicitudState = respuesta;
          this.tercerosRelacionadosForm.patchValue({
            idPersonaSolicitud: this.solicitudState.idPersonaSolicitud,
            rfcTercero: this.solicitudState.rfcTercero,
            rfc: this.solicitudState.rfc,
            nombre: this.solicitudState.nombre,
            apellidoPaterno: this.solicitudState.apellidoPaterno,
            apellidoMaterno: this.solicitudState.apellidoMaterno,
            telefono: this.solicitudState.telefono,
            correoElectronico: this.solicitudState.correoElectronico,
          });
          this.enlaceOperativosLista =
            this.solicitudState.enlaceOperativosLista;
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
          this.SolicitudStore.actualizarRfc(respuesta.rfc);
          this.SolicitudStore.actualizarNombre(respuesta.nombre);
          this.SolicitudStore.actualizarApellidoPaterno(
            respuesta.apellidoPaterno
          );
          this.SolicitudStore.actualizarApellidoMaterno(
            respuesta.apellidoMaterno
          );
          this.SolicitudStore.actualizarTelefono(respuesta.telefono);
          this.SolicitudStore.actualizarCorreoElectronico(
            respuesta.correoElectronico
          );
        });
    }
  }

  /** Métodos para actualizar los valores en el store */
  actualizarRfcTercero(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.SolicitudStore.actualizarRfcTercero(VALOR);
  }

  /** Métodos para actualizar los valores en el store */
  actualizarTelefono(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.SolicitudStore.actualizarTelefono(VALOR);
  }

  /** Métodos para actualizar los valores en el store */
  actualizarCorreoElectronico(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.SolicitudStore.actualizarCorreoElectronico(VALOR);
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
    this.SolicitudStore.actualizarEnlaceOperativosLista(
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
