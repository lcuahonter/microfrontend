import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ENVIRONMENT, JSONResponse, Notificacion, NotificacionesComponent } from '@ng-mf/data-access-user';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { Tramite110217State, Tramite110217Store } from '../../../../estados/tramites/tramite110217.store';
import { CertificadosOrigenService } from '../../services/certificado-origen.service.ts';
import { CommonModule } from '@angular/common';
import { HistoricoColumnas } from '../../models/certificado-origen.model';
import { HistoricoProductoresComponent } from '../../../../shared/components/historico-productores/historico-productores.component';
import { Mercancia } from '../../../../shared/models/modificacion.enum.js';
import { Tramite110217Query } from '../../../../estados/queries/tramite110217.query';

@Component({
  selector: 'app-hist-productores',
  standalone: true,
  imports: [
    CommonModule,
    HistoricoProductoresComponent,
    NotificacionesComponent
  ],
  templateUrl: './hist-productores.component.html',
  styleUrl: './hist-productores.component.scss',
})

export class HistProductoresComponent implements OnInit, OnDestroy {
  /** Referencia al componente 'HistoricoProductoresComponent' en la plantilla.
   * Permite gestionar sus métodos y propiedades.
   */
  @ViewChild('HistoricoProductoresComponent', { static: false }) historicoProductoresComponent!: HistoricoProductoresComponent;

  /**
   * Estado actual del trámite.
   */
  public tramiteState!: { [key: string]: unknown };

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  destroyNotifier$: Subject<void> = new Subject();

   /**
   * @public
   * @property
   * @type { [key: string]: unknown}
   * @comando
   * Este objeto debe ser inicializado antes de su uso para evitar errores.
   */
  public agregarDatosProductor!: { [key: string]: unknown };

  /**
   * Lista de productores disponibles para el exportador.
   */
  public productoresExportador: HistoricoColumnas[] = [];

  /**
   * @property {boolean} ocultarFax
   * Indica si el campo de fax debe estar oculto o visible en la interfaz de usuario.
    * @default true
  */
  public ocultarFax: boolean = true;

  /**
   * @property esTipoDeSeleccionado
   * @type {boolean}
   * @description Indica si el tipo seleccionado es válido o está activo.
   */
  public esTipoDeSeleccionado: boolean = true;

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Solicitud actual del trámite.
   */
  public solicitudState!: Tramite110217State;

  /** RFC del usuario actualmente autenticado utilizado para consultas y servicios. */
  private loginRFC = ENVIRONMENT.RFC;

  /** Observable que expone la lista de mercancia al store. */
  public mercanciaProductores!: Mercancia[]; 

  /** Observable que expone la lista de productores exportador agregados al store. */
  public agregarProductoresExportador$!: Observable<HistoricoColumnas[]>;

  /**
   * @public
   * @property {Notificacion} nuevaNotificacion
   * @description Representa una nueva notificación que se utilizará en el componente.
   * @command Este campo debe ser inicializado antes de su uso.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @property nuevaNotificacionStatus
   * @type {boolean}
   * @description Indica si el tipo seleccionado es válido o está activo.
   */
  public nuevaNotificacionStatus: boolean = false;

  /**
   * Constructor del componente.
   * 
   * @param {FormBuilder} fb - Constructor para crear formularios reactivos.
   * @param {Tramite110217Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite110217Query} tramiteQuery - Query para obtener el estado del trámite.
  */
  constructor(
    public store: Tramite110217Store,
    public tramiteQuery: Tramite110217Query,
    private certificadoDeService: CertificadosOrigenService,
    private consultaQuery: ConsultaioQuery
  ) {
    //
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga los datos iniciales, configura los formularios y suscribe al estado del trámite.
   */
  ngOnInit(): void {
    this.agregarProductoresExportador$ = this.tramiteQuery.selectAgregarProductoresExportador$;
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.productoresExportador = seccionState.productoresExportador || [];
          this.mercanciaProductores = seccionState.mercanciaTabla;
        })
      )
      .subscribe();

    this.tramiteQuery.formulario$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();

    this.tramiteQuery.datosProductorFormulario$.pipe(
      takeUntil(this.destroyNotifier$), map((seccionState) => {
        this.agregarDatosProductor = seccionState;
      })
    ).subscribe();

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();

    if (this.productoresExportador.length === 0) {
      this.cargarProductorPorExportador();
    }
  }

  /**
   * Establece valores en el estado del store para un formulario histórico.
   * 
   * @param event - Objeto que contiene los datos necesarios para actualizar el store.
   * @param event.formGroupName - Nombre del grupo de formulario (no utilizado en este método).
   * @param event.campo - Nombre del campo que se actualizará en el store.
   * @param event.valor - Valor que se asignará al campo en el store.
   * @param event.storeStateName - Nombre del estado del store (no utilizado en este método).
   * 
   * @returns void
   */
  setValoresStore(event: { formGroupName: string, campo: string, valor: string | number | boolean | object | undefined, storeStateName: string }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormHistorico({ [CAMPO]: VALOR });
  }

  /**
   * Establece valores en el store para agregar datos del formulario del productor.
   * 
   * @param event - Objeto que contiene los datos necesarios para actualizar el store.
   * @param event.formGroupName - Nombre del grupo de formulario (no utilizado en este método).
   * @param event.campo - Nombre del campo que se actualizará en el store.
   * @param event.valor - Valor que se asignará al campo en el store.
   * @param event.storeStateName - Nombre del estado del store (no utilizado en este método).
   * 
   * @returns void
   * 
   * @command Actualiza el estado del store con los valores proporcionados.
   */
  setValoresStoreAgregarForm(event: { formGroupName: string, campo: string, valor: string | number | boolean | null, storeStateName: string }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setAgregarFormDatosProductor({ [CAMPO]: VALOR });
  }

  /**
   * Carga la lista de productores disponibles para el exportador desde el servicio.
   */
  cargarProductorPorExportador(): void {
    this.certificadoDeService.obtenerProductorPorExportador(this.loginRFC)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          const DATOS = (response as { datos: unknown[] }).datos;
          const RESULT: HistoricoColumnas[] = DATOS.map((item, index) => {
            const PRODUCTOR = item as {
              nombreCompleto?: string;
              rfc?: string;
              direccionCompleta?: string;
              correoElectronico?: string;
              telefono?: string;
              fax?: string;
            };
            return {
              id: index + 1,
              nombreProductor: PRODUCTOR.nombreCompleto ?? '',
              numeroRegistroFiscal: PRODUCTOR.rfc ?? '',
              direccion: PRODUCTOR.direccionCompleta ?? '',
              correoElectronico: PRODUCTOR.correoElectronico ?? '',
              telefono: PRODUCTOR.telefono ?? '',
              fax: PRODUCTOR.fax ?? '',
            };
          });

          this.store.setProductoresExportador(RESULT);
        },
        error: () => {
          //
        },
    });
  }

  /**
 * Actualiza la lista de productores exportador en el store si el evento contiene datos.
 * @param event Arreglo de objetos HistoricoColumnas con los datos de los productores.
 */
  emitProductoresExportador(event: HistoricoColumnas[]) {
    if (event.length > 0) {
      this.store.setProductoresExportador(event);
    }
  }

  /**
 * Actualiza la lista de productores exportador después de eliminar elementos seleccionados.
 * @param event Arreglo actualizado de productores exportador después de la eliminación.
 */
  eliminarEventoExportador(event: HistoricoColumnas[]): void {
    this.store.updateAgregarProductoresExportador(event);
  }

  /** Actualiza el estado de validez del formulario según el valor recibido. */
  public formaValida(event: boolean): void {
    this.store.setFormValidity('histProductores', event);
  }

  /**
 * Actualiza la lista de mercancías en el store con los datos recibidos del evento.
 * @param event Arreglo de objetos de tipo Mercancia a asignar.
 */
  setMercanciaDatos(event: Mercancia[]): void {
    this.store.setmercanciaTabla(event);
  }

  /**
 * Agrega un productor exportador al estado del store a partir del evento recibido.
 * Si el evento contiene los datos completos del productor, los utiliza; de lo contrario, asigna valores por defecto.
 * Si ya existen productores agregados, carga la mercancía relacionada.
 * @param event Objeto con los datos del productor exportador o con el número de registro fiscal.
 */
  public emitAgregarExportador(event: { [key: string]: unknown } | HistoricoColumnas): void {
    let DATOS: HistoricoColumnas | null = null;
    if (event && typeof event === 'object' && 'nombreProductor' in event) {
      DATOS = {
          id: (event as HistoricoColumnas).id ?? 0,
          nombreProductor: (event as HistoricoColumnas).nombreProductor ?? '',
          numeroRegistroFiscal: String((event as HistoricoColumnas).numeroRegistroFiscal ?? ''),
          direccion: String((event as HistoricoColumnas).direccion ?? ''),
          correoElectronico: String((event as HistoricoColumnas).correoElectronico ?? ''),
          telefono: String((event as HistoricoColumnas).telefono ?? ''),
          fax: String((event as HistoricoColumnas).fax ?? '')
      };
      this.store.setAgregarProductoresExportador([DATOS]);
    } else if (event && typeof event === 'object' && 'numeroRegistroFiscal' in event) {
      const PAYLOAD = {
          rfc_solicitante: String(event['numeroRegistroFiscal'] ?? ''),
      };
      this.certificadoDeService
      .agregarProductores(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response: JSONResponse) => {
          if (response.codigo === '00') {
            const DATOS = (response as { datos: unknown[] })?.datos;
            const RESULT: HistoricoColumnas[] = DATOS?.map((item, index) => {
              const PRODUCTOR = item as {
                nombreCompleto?: string;
                rfc?: string;
                direccionCompleta?: string;
                correoElectronico?: string;
                telefono?: string;
                fax?: string;
              };
              return {
                id: index + 1,
                nombreProductor: PRODUCTOR.nombreCompleto ?? '',
                numeroRegistroFiscal: PRODUCTOR.rfc ?? '',
                direccion: PRODUCTOR.direccionCompleta ?? '',
                correoElectronico: PRODUCTOR.correoElectronico ?? '',
                telefono: PRODUCTOR.telefono ?? '',
                fax: PRODUCTOR.fax ?? '',
                nuevo: true
              };
            });
            this.store.setAgregarProductoresExportador(RESULT);
          } else if (response.codigo === '3') {
            this.abrirModal(response.error || 'No se encontraron datos para el RFC proporcionado.');
          }
        },
        error: () => {
          //
        }
      })
    }
  }

  /**
   * @description
   * Abre un modal de notificación con una configuración predeterminada de alerta.
   * @see Notificacion
   * @see NotificacionesComponent
   */
  public abrirModal(message: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: message || '',
      cerrar: false,
      tiempoDeEspera: 0,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.nuevaNotificacionStatus = true;
  }

  /**
   * Valida el formulario del componente.
   * @returns {boolean} `true` si el formulario es válido, de lo contrario `false`.
   */
  public validarFormulario(): void {
    this.historicoProductoresComponent.validarFormulario();
  }

/**
   * Método que se ejecuta al destruir el componente.
   * 
   * Libera los recursos y cancela las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
