import { AccionBoton, AcuseComponent, BtnContinuarComponent, Notificacion, SolicitanteQuery, SolicitanteState, TITULO_ACUSE, Usuario, formatearFechaSolicitud } from "@ng-mf/data-access-user";
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ERROR_FORMA_ALERT, ERROR_FORMA_FALTAN } from "../../constants/permiso-importacion-modification.enum";
import { Subject, catchError, map, of, takeUntil, timeout } from "rxjs";
import { ALERTA } from "@libs/shared/data-access-user/src/tramites/constantes/mensajes-error-formularios";
import { CommonModule } from "@angular/common";
import { DatosGrupos } from "../../models/permiso-importacion-modification.model";
import { DatosPasos } from '@ng-mf/data-access-user';
import { GuardadoService } from "../../services/guardado.service";
import { GuardarSolicitudRequest } from "../../models/guardar-solicitud-request.model";
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS_CUATRO_STEPS } from '@ng-mf/data-access-user';
import { PasoCuatroComponent } from "../paso-cuatro/paso-cuatro.component";
import { PasoDosComponent } from "../paso-dos/paso-dos.component";
import { PasoUnoComponent } from "../paso-uno/paso-uno.component";
import { Tramite130120Query } from "../../estados/permiso-importacion.query";
import { USUARIO_INFO } from "@libs/shared/data-access-user/src/core/enums/usuario-info.enum";
import { WizardComponent } from '@ng-mf/data-access-user';

import { PermisoImportacionStore } from "../../estados/permiso-importacion.store";

/**
 * Componente contenedor para el flujo de pasos del trámite.
 *
 * Este componente administra la navegación y visualización de los pasos del trámite,
 * integrando el componente de wizard y los pasos individuales.
 *
 * @componente
 * @selector app-intro-permiso
 * @template ./intro-permiso.component.html
 * @estilo ./intro-permiso.component.scss
 * @standalone
 * @importa WizardComponent, BtnContinuarComponent, PasoUnoComponent, PasoDosComponent, PasoTresComponent, PasoCuatroComponent
 *
 * @notas
 * Utiliza el componente Wizard para gestionar la navegación entre los pasos y mantiene el estado del índice actual.
 */
@Component({
  selector: 'app-intro-permiso',
  templateUrl: './intro-permiso.component.html',
  styleUrl: './intro-permiso.component.scss',
  imports: [CommonModule, WizardComponent, BtnContinuarComponent, PasoUnoComponent, PasoDosComponent, PasoCuatroComponent, AcuseComponent],
  standalone: true,
})
export class IntroPermisoComponent implements OnInit, OnDestroy {

  /**
     * Referencia al componente del primer paso.
     * Permite acceder a los métodos y propiedades del paso uno.
     */
  @ViewChild('pasoUno') pasoUnoComponent!: PasoUnoComponent;

  /**
   * Índice actual del paso activo en el wizard.
   * @type {number}
   */
  indice = 1;

  /**
 * Indica si el formulario es válido.
 */
  esValido = true;

  /**
  * Clase CSS para mostrar una alerta de error.
  */
  infoError = 'alert-danger';

  /**
    * Mensaje de alerta a mostrar en caso de error.
    */
  ALERTA = ALERTA;

  /**
   * Lista de pasos configurados para el wizard.
   * @type {ListaPasosWizard[]}
   */
  pasos: ListaPasosWizard[] = PASOS_CUATRO_STEPS;

  /**
   * Notificación para mostrar mensajes al usuario.
   */
  nuevaNotificacion: Notificacion | null = null;

  /**
   * Número de solicitud generado para el trámite.
   */
  numeroSolicitud: string = '';

  /**
   * Mensaje de alerta para el formulario.
   */
  public formularioAlertaError = ERROR_FORMA_ALERT;

  /**
   * Indica si el formulario es válido.
   */
  esFormaValido: boolean = false;

  /**
   * Indica si se debe mostrar otra pestaña.
   */
  mostrarOtraPestana: boolean = false;

  /**
   * Referencia al componente Wizard para controlar la navegación.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  /**
   * Notificador para gestionar la destrucción de suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Estado de los datos del trámite.
   */
  public realizarState!: DatosGrupos;

  /**
 * Estado del solicitante.
 */
  solicitante!: SolicitanteState;

  /**
   * Datos de configuración para los pasos del wizard.
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
    * @description Mensaje de alerta que se muestra al usuario en la página de acuse.
    */
  txtAlerta!: string;

  /**
   * @description Subtítulo que se muestra en la página de acuse.
   */
  subtitulo = TITULO_ACUSE;

  /**
   * @description Indica si el componente de acuse debe ser visible o no.
   * Inicialmente es falso y se establece en verdadero después de generar el acuse.
   */
  isAcuseVisible: boolean = false;

  /**
   * @description Información del usuario que realiza el trámite.
   */
  datosUsuario: Usuario = USUARIO_INFO;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
* Indica si el botón para cargar archivos está habilitado.
*/
  activarBotonCargaArchivos: boolean = false;

  /**
 * Indica si la sección de carga de documentos está activa.
 * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
 */
  seccionCargarDocumentos: boolean = true;

  /** Carga de progreso del archivo */
  cargaEnProgreso: boolean = true;

  /**
   * Constructor del componente.
   * @param tramiteQuery Servicio para consultar el estado del trámite.
   * @param solicitanteQuery Servicio para consultar el estado del solicitante.
   * @param guardarSolicitud Servicio para operaciones de guardado de la solicitud.
   */
  constructor(
    private tramiteQuery: Tramite130120Query,
    private solicitanteQuery: SolicitanteQuery,
    private guardarSolicitud: GuardadoService,
    public store: PermisoImportacionStore,
  ) {
  }

  /**
   * Inicializa las suscripciones a los estados necesarios al cargar el componente.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectDatos$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.realizarState = state;
        })
      )
      .subscribe();
    this.solicitanteQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.solicitante = state as SolicitanteState;
        })
      )
      .subscribe();
  }

  /**
   * Cambia el índice del paso actual y navega en el wizard según la acción del botón.
   *
   * @param e - Objeto que contiene la acción y el valor del índice.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.accion === 'cont') {
      if (e.valor <= 2) {
        const FORM_VALIDO = this.pasoUnoComponent?.validarFormulario() ?? false;
        if (!FORM_VALIDO) {
          this.esFormaValido = true;
          this.formularioAlertaError = ERROR_FORMA_FALTAN;
          this.indice = 1;
          this.datosPasos.indice = 1;
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          return;
        }
        this.guardarSolicitudCompleta(e);
        return;
      }
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.siguiente();
      return;
    }
    this.indice = e.valor;
    this.datosPasos.indice = this.indice;
    this.wizardComponent.atras();
  }

  /**
   * Guarda la solicitud completa enviando el payload construido al servicio de guardado.
   */
  guardarSolicitudCompleta(e: AccionBoton): void {
    const PAYLOAD = this.buildPayload();
    this.guardarSolicitud.postGuardadoCompleto(PAYLOAD)
      .pipe(
        timeout(30000), // Timeout de 30 segundos
        catchError((error) => {
          console.error('Error o timeout en la petición:', error);
          // Retornar un observable con el formato esperado que incluye la propiedad 'codigo'
          const MENSAJE_ERROR = error.name === 'TimeoutError' 
            ? 'La solicitud ha excedido el tiempo de espera. Por favor, intente nuevamente.'
            : 'Error al guardar la solicitud.';
          return of({ codigo: 'ERROR', error: MENSAJE_ERROR, datos: null });
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe({
        next: (resp) => {
          if (resp.codigo !== '00') {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: '',
              modo: 'action',
              titulo: '',
              mensaje: resp.error || 'Error al guardar la solicitud.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            this.resetFormToStepOne();
          }
          else if (resp?.codigo === '00' && resp?.datos) {
            const DATOS = resp.datos;
            this.numeroSolicitud = DATOS.id_solicitud.toString();
            this.mostrarOtraPestana = true;
            this.esFormaValido = false;
            this.indice = e.valor;
            this.datosPasos.indice = this.indice;
            this.wizardComponent.siguiente();
          }
        }
      });
  }

  private resetFormToStepOne(): void {
    this.esFormaValido = true;
    this.formularioAlertaError = ERROR_FORMA_ALERT;
    this.indice = 1;
    this.datosPasos.indice = 1;
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  }

  /**
   * Construcción de payload seteando los valores con el formulario
   */
  buildPayload(): GuardarSolicitudRequest {
    const DATOS_GENERALES = this.realizarState;
    const FECHA_FACTURA = formatearFechaSolicitud(DATOS_GENERALES.datosMercanica.factura_fecha);
    const FECHA_DOCUMENTO = formatearFechaSolicitud(DATOS_GENERALES.datosExporta.fecha_documento);
    return {
      //TODOcve_entidad_federativa se debe obtener del estado del solicitante ejemplo "SIN" representa SINALOA o cualquier otro estado
      cve_entidad_federativa: DATOS_GENERALES.datosFederal.descripcion_representacion_federal,
      descripcion_representacion_federal: DATOS_GENERALES.datosFederal.descripcion_representacion_federal,
      clave_clasificacion_regimen: DATOS_GENERALES.datosRealizer.classificion_regimen,
      regimen: {
        cve_regimen: DATOS_GENERALES.datosRealizer.regimen
      },
      mercancia: {
        descripcion_temporal_modificacion_mercancia: DATOS_GENERALES.datosMercanica.otro_umc,
        marca: DATOS_GENERALES.datosMercanica.marca,
        tipo_aduana: DATOS_GENERALES.datosMercanica.tipo_entrada,
        fraccion_arancelaria: DATOS_GENERALES.datosMercanica.fraccion,
        subdivision: DATOS_GENERALES.datosMercanica.nico,
        unidad_medida_tarifaria: DATOS_GENERALES.datosMercanica.umt,
        unidad_medida_comercial: DATOS_GENERALES.datosMercanica.umc,
        descripcion: DATOS_GENERALES.datosMercanica.descripcion,
        cantidad_comercial: Number(DATOS_GENERALES.datosMercanica.cantidad_umc),
        cantidad_tarifaria: Number(DATOS_GENERALES.datosMercanica.cantidad_umt),
        precio_unitario: Number(DATOS_GENERALES.datosMercanica.precio_unitario_usd),
        valor_total_factura: Number(DATOS_GENERALES.datosMercanica.valor_total_factura),
        pais_destino_clave: DATOS_GENERALES.datosMercanica.pais_exportador,
        pais_origen_clave: DATOS_GENERALES.datosMercanica.pais_origen,
        observaciones: DATOS_GENERALES.datosExportador.observaciones,
        numero_factura: (DATOS_GENERALES.datosMercanica.factura_numero).toString(),
        fecha_factura: FECHA_FACTURA,
        capacidad: Number(DATOS_GENERALES.datosMercanica.factor_conversion),
        moneda: DATOS_GENERALES.datosMercanica.moneda_comercializacion,
        valor_factura: Number(DATOS_GENERALES.datosMercanica.valor_factura),
        valor_factura_usd: Number(DATOS_GENERALES.datosMercanica.valor_factura_usd),
        valor_total_factura_dolares: Number(DATOS_GENERALES.datosMercanica.valor_total_factura_usd),
      },
      productor: {
        ide_tipo_persona_sol: DATOS_GENERALES.datosProductor.persona_tipo,
        nombre: DATOS_GENERALES.datosProductor.personales_nombre,
        apellido_paterno: DATOS_GENERALES.datosProductor.primer_apellido,
        apellido_materno: DATOS_GENERALES.datosProductor.segundo_apellido,
        razon_social: DATOS_GENERALES.datosProductor.denominacion_razon_social,
        descripcion_ubicacion: DATOS_GENERALES.datosProductor.domicilio,
      },
      exportador: {
        ide_tipo_persona_sol: DATOS_GENERALES.datosExportador.persona_tipo,
        nombre: DATOS_GENERALES.datosExportador.personales_nombre,
        apellido_paterno: DATOS_GENERALES.datosExportador.primer_apellido,
        apellido_materno: DATOS_GENERALES.datosExportador.segundo_apellido,
        razon_social: DATOS_GENERALES.datosExportador.denominacion_razon_social_exportador,
        descripcion_ubicacion: DATOS_GENERALES.datosExportador.domicilio,
      },
      datos_genericos_solicitud:
      {
        descripcion_generica_1: DATOS_GENERALES.datosExporta.numero_documento,
        fecha_generica_1: FECHA_DOCUMENTO,
        descripcion_generica_2: DATOS_GENERALES.datosExporta.descripcionExportacion,
        descripcion_generica_3: DATOS_GENERALES.datosExporta.codigo_arancelario,
        num_generico_1: Number(DATOS_GENERALES.datosExporta.cantidad_umt),
        num_generico_2: Number(DATOS_GENERALES.datosExporta.valor_usd),
        num_generico_3: Number(DATOS_GENERALES.datosExporta.precio_unitario_usd),
      },
      cve_unidad_administrativa: DATOS_GENERALES.datosFederal.representacion_federal,
      rfc: this.solicitante.rfc_original,
    }
  }

  /**
  * Maneja el evento cuando se genera un acuse.
  * Actualiza el texto de alerta y el estado de visibilidad del acuse en el componente.
  *
  * @param event - Objeto que contiene los datos del acuse generado.
  * @param event.txtAlerta - Texto del mensaje de alerta a mostrar.
  * @param event.isVisible - Indica si el acuse debe mostrarse o no.
  */
  onAcuseGenerado(event: { txtAlerta: string; isVisible: boolean }): void {
    this.txtAlerta = event.txtAlerta;
    this.isAcuseVisible = event.isVisible;
  }

  /**
 * Método para manejar el evento de carga de documentos.
 * Actualiza el estado de la sección de carga de documentos.
 *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
 * {void} No retorna ningún valor.
 */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
  * Método para manejar el evento de carga de documentos.
  * Actualiza el estado del botón de carga de archivos.
  *  carga - Indica si la carga de documentos está activa o no.
  * {void} No retorna ningún valor.
  */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
    * Maneja el evento de carga en progreso emitido por un componente hijo.
    * Actualiza el estado de cargaEnProgreso según el valor recibido.
    * @param cargando Valor booleano que indica si la carga está en progreso.
    */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onCargaEnProgresoPadre(cargando: boolean) {
    this.cargaEnProgreso = cargando;
  }

  /**
   * Método para navegar a la siguiente sección del wizard.
   * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
 * Método para navegar a la sección anterior del wizard.
 * Actualiza el índice y el estado de los pasos.
 * {void} No retorna ningún valor.
 */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * Limpia las suscripciones y el estado al destruir el componente.
   * {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.store.reset();
  }
}