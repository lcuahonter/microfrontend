import {
  ALERT_TEXTO,
  ERROR_FORMA_ALERT,
  ERROR_LLAVE_DUPLICADA_ALERT,
  MENSAJE_DE_EXITO_ETAPA_UNO,
  PASOS,
} from '../../constantes/220202/fitosanitario.enums';
import {
  AccionBoton,
  FilaSolicitud,
  ListaDeDatosFinal,
  ListaPasosWizard,
  TercerosrelacionadosExportadorTable,
  TercerosrelacionadosdestinoTable,
} from '../../models/220202/fitosanitario.model';
import {
  AcuseComponent,
  AlertComponent,
  BtnContinuarComponent,
  ConsultaioQuery,
  ConsultaioState,
  ConsultaioStore,
  DatosPasos,
  PasoFirmaComponent,
  SolicitanteQuery,
  Usuario,
  WizardComponent,
  formatearFechaSolicitudSinHora,
} from '@ng-mf/data-access-user';
import {
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Subject, catchError, map, switchMap, take, takeUntil } from 'rxjs';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { CommonModule } from '@angular/common';
import { GuardarSolicitud } from '../../models/220202/guardar-solicitud.model';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { RegistroSolicitudService } from '../../services/220202/registro-solicitud/registro-solicitud.service';
import { USUARIO_INFO } from '@libs/shared/data-access-user/src/core/enums/usuario-info.enum';

/**
 * @fileoverview Componente para la gestión del formulario de agricultura.
 * Este componente maneja la lógica y la presentación del formulario de agricultura,
 * incluyendo la navegación entre pasos y la gestión de los datos.
 * @module agricultura
 */

/**
 * Componente para el formulario de agricultura.
 * Este componente se encarga de gestionar el formulario de agricultura, incluyendo
 * la navegación entre los pasos del formulario y la actualización de datos.
 * @class AgriculturaComponent
 * @selector app-agricultura
 * @templateUrl ./agricultura.component.html
 */
@Component({
  selector: 'app-agricultura',
  templateUrl: './agricultura.component.html',
  standalone: true,
  imports: [
    WizardComponent,
    CommonModule,
    PasoDosComponent,
    PasoUnoComponent,
    BtnContinuarComponent,
    AlertComponent,
    PasoFirmaComponent,
  ],
})
export class AgriculturaComponent implements OnInit {
  /**
   * @description Texto que se muestra en la alerta del formulario.
   * Este texto es utilizado para proporcionar información al usuario sobre el propósito del formulario.
   * @type {string}
   */
  public readonly alertText: string = ALERT_TEXTO;

  /**
   * @description Array de objetos que definen los pasos del formulario.
   * Cada objeto contiene información sobre un paso específico,
   * incluyendo su número, título y si está completado.
   * Este array permite la gestión de las secciones o pasos dentro del formulario.
   * @type {ListaPasosWizard[]}
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @description mnsaje al terminar de llenar el paso uno correctamente y generar folio
   */
  mensajePasos: string = '';

  /**
   * @description Referencia al componente Wizard.
   * Esta referencia permite acceder a los métodos y propiedades del componente Wizard,
   * como `siguiente()` y `atras()`, para controlar la navegación entre los pasos.
   *
   * @type {WizardComponent}
   * @viewChild WizardComponent
   */
  @ViewChild(WizardComponent) componenteWizard!: WizardComponent;

  /**
   * @description Referencia al componente btn-continuar.
   * Esta referencia permite acceder a los métodos y propiedades del componente btn-continuar,
   *
   * @type {BtnContinuarComponent}
   * @viewChild BtnContinuarComponent
   */
  @ViewChild(PasoUnoComponent) pasoUnoRef!: PasoUnoComponent;

  /**
   * @description Índice actual del paso en el que se encuentra el usuario.
   * Este índice se utiliza para determinar qué paso se muestra en cada momento.
   * Los valores posibles de `indice` corresponden a los pasos definidos en el arreglo `pasos`.
   *
   * @type {number}
   * @default 1
   */
  indice: number = 1;

  /** Indica si el botón Guardar debe mostrarse o estar habilitado en el formulario. */
  public btnGuardar: boolean = true;

  /** Indica la visibilidad del botón Guardar. */
  public btnGuardarVisible: string = 'visible';

  /**
   * Mensaje de error que se muestra cuando la validación de formularios falla.
   * @public
   * @readonly
   * @type {string}
   * @memberof SanidadCertificadoComponent
   */
  public readonly FORM_ERROR_ALERT = ERROR_FORMA_ALERT;

  /**
   * Mensaje de error que se muestra cuando la llave de pago ya ha sido registrada en otro tramite.
   * @public
   * @readonly
   * @type {string}
   * @memberof SanidadCertificadoComponent
   */
  public readonly FORM_LLAVE_DUPLICADA_ALERT = ERROR_LLAVE_DUPLICADA_ALERT;

  /**
   * Indica si el formulario tiene errores de validación.
   *
   * Se utiliza para mostrar/ocultar el alert de errores en el modal.
   */
  esFormaInValido: boolean = false;

  /**
   * Indica se la llave de pago ya existe en la BD.
   */
  llaveDuplicada: boolean = false;

  /**
   * Indica si ya se llenaron todos los formularios del paso 1.
   *
   * Se utiliza para mostrar/ocultar el alert azul.
   */
  esPasoUnoCompleto: boolean = false;

  /**
   * @description Objeto que contiene los datos de los pasos del formulario.
   * Este objeto se utiliza para comunicar información entre el componente Agricultura
   * y el componente Wizard, como el número total de pasos, el índice del paso actual
   * y los textos de los botones de navegación (anterior y siguiente).
   *
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Objeto que almacena los valores complementarios del formulario.
   */
  valoresComplemento: {
    rfc: string;
    tipoPersona: string;
    razon_social: string;
    nombre: string;
  } = {
    rfc: '',
    tipoPersona: '',
    razon_social: '',
    nombre: '',
  };

  /**
   * Estado de la consulta actual, contiene la información relevante del solicitante.
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;
  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * @type {Subject<void>}
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Variable para almacenar el id de la solicitud.
   * @private
   */
  public idSolicitud: string = '';

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

  datosUsuario: Usuario = USUARIO_INFO;

  private agriculturaApiService: AgriculturaApiService = inject(
    AgriculturaApiService
  );
  private registroSolicitudService: RegistroSolicitudService = inject(
    RegistroSolicitudService
  );
  public solicitanteQuery: SolicitanteQuery = inject(SolicitanteQuery);
  private consultaioStore: ConsultaioStore = inject(ConsultaioStore);

  /**
   * Constructor del componente.
   * Este constructor inicializa el componente y establece el estado inicial de la validación
   * y de las secciones del formulario utilizando el servicio `SeccionLibStore`.
   * @constructor
   * @param consultaQuery
   */
  constructor(private consultaQuery: ConsultaioQuery) {}
  ngOnInit(): void {
    this.obtenerDatosDelStore();
    this.obtieneDatosTabSolicitud();
  }

  /**
   * @description Maneja la acción del botón y determina la navegación (siguiente o anterior).
   * Este método se llama cuando el usuario hace clic en uno de los botones de navegación
   * del formulario.
   *
   * Recibe un objeto `AccionBoton` que contiene la acción a realizar (`cont` o `atras`)
   * y el valor del índice del paso al que se debe navegar.
   *
   * @param {AccionBoton} e - Objeto que contiene la acción y el valor a manejar.
   *   El `valor` representa el índice del paso al que ir. La `accion` determina si avanzar
   *   (valor `cont`) o retroceder (valor `atras`).
   *
   * @returns {void}
   */
  async getValorIndice(e: AccionBoton): Promise<void> {
    // Si estamos en el paso 1, validar antes de continuar
    if (this.indice === 1) {
      const VALIDA_PESTANAS = await this.pasoUnoRef?.validarFormularios();
      if (!VALIDA_PESTANAS.valido) {
        // Detener la navegación si no es válido
        this.datosPasos.indice = this.indice;
        this.esFormaInValido = true;
        if (VALIDA_PESTANAS.mensaje === 'PC01') {
          this.llaveDuplicada = true;
        }
        return;
      }
    }


    this.esFormaInValido = false;
    this.esPasoUnoCompleto = true;
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (this.indice === 3) {
        this.btnGuardar = false;
      }
      else {
        this.btnGuardar = true;
      }
      if (e.accion === 'cont') {
        this.componenteWizard.siguiente();
      } else {
        this.componenteWizard.atras();
      }
    }
  }

  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.idSolicitud = seccionState.id_solicitud;
          const NUEVO = MENSAJE_DE_EXITO_ETAPA_UNO.replace(
            '_folio_',
            this.consultaState.id_solicitud ?? '0'
          );
          this.mensajePasos = NUEVO;
        })
      )
      .subscribe();
  }

  /**
   * Guarda los datos del formulario.
   */
  guardarDatosFormulario(): void {
    this.agriculturaApiService
      .getAllDatosForma()
      .pipe(
        takeUntil(this.destroyNotifier$),
        take(1), // solo la primera emisión
        map((datos) => this.crearPayload(datos)), // crear payload
        switchMap((payload) => {
          return this.registroSolicitudService
            .guardarParcialSolicitud(220202, payload)
            .pipe(take(1));
        }),
        map((data) => {
          this.consultaioStore.setIdSolicitud(
            String(data?.datos?.id_solicitud)
          );
          this.esPasoUnoCompleto = true;
        }),
        catchError((err) => {
          return 'error';
        })
      )
      .subscribe();
  }

  /**
   * Crea el payload para el guardado de los datos.
   * @param {ListaDeDatosFinal} datos - Datos de la lista de datos final.
   * @returns {GuardarSolicitud}
   */
  private crearPayload(datos: ListaDeDatosFinal): GuardarSolicitud {
    return {
      id_solicitud:
        this.consultaState?.id_solicitud !== null &&
        this.consultaState?.id_solicitud !== '' &&
        !isNaN(Number(this.consultaState?.id_solicitud))
          ? Number(this.consultaState?.id_solicitud)
          : null,
      datos_solicitud: {
        cve_aduana: datos.datos.aduanaDeIngreso!,
        oficina_inspeccion_sanidad_agropecuaria:
          datos.datos.oficinaDeInspeccion,
        punto_inspeccion: datos.datos.puntoDeInspeccion,
        numero_autorizacion: datos.datos.numeroDeGuia!,
        clave_regimen: datos.datos.regimen,
        numero_carro_ferrocarril: datos.datos.numeroDeCarro!,
        mercancia: (datos.tablaDatos ?? []).map((t: FilaSolicitud) => ({
          tipo_requisito: Number(t.tipoRequisito) ?? 0,
          requisito: t.requisito ?? '',
          numero_certificado: t.numeroCertificadoInternacional ?? '',
          cve_fraccion: t.fraccionArancelaria ?? '',
          id_fraccion_gubernamental: t.idDescripcionFraccion,
          clave_nico: t.nico ?? '',
          descripcion_mercancia: t.descripcion ?? '',
          cantidad_umt: Number(t.cantidadUMT) ?? 0,
          clave_unidad_medida: t.umt ?? '',
          cantidad_umc: Number(t.cantidadUMC) ?? 0,
          clave_unidad_comercial: t.umc ?? '',
          id_uso_mercancia_tipo_tramite: Number(t.uso) ?? 0,
          id_tipo_producto_tipo_tramite: Number(t.tipoDeProducto) ?? 0,
          numero_lote: t.numeroDeLote ?? 0,
          clave_paises_origen: t.paisDeOrigen ?? '',
          clave_paises_procedencia: t.paisDeProcedencia ?? '',
          idNombreCientifico: '',
          lista_detalle_mercancia: (t.detalleVidaSilvestre ?? []).map((x) => ({
            id_vida_silvestre: String(x.idVidaSilvestre),
          })),
        })),
      },

      transporte: {
        ide_medio_transporte: datos.movilizacion.transporte,
        identificacion_transporte: datos.movilizacion.identificacion,
        id_punto_verificacion: Number(datos.movilizacion.puntoVerificacion),
        razon_social: datos.movilizacion.empresaTransportista,
      },

      terceros: {
        terceros_exportador: (datos.datosForma ?? []).map(
          (t: TercerosrelacionadosExportadorTable) => ({
            tipo_persona_sol: 'TIPERS.EXP',
            persona_moral: t.tipoMercancia?.toLowerCase() === 'no',
            nombre: t.nombre,
            apellido_paterno: t.primerApellido,
            apellido_materno: t.segundoApellido ?? '',
            razon_social: t.razonSocial,
            pais: t.pais,
            descripcion_ubicacion: t.domicilio ?? '',
            lada: t.lada ?? '',
            telefonos: t.telefono ?? '',
            correo: t.correo ?? '',
          })
        ),

        terceros_destinatario: (datos.tercerosRelacionados ?? []).map(
          (t: TercerosrelacionadosdestinoTable) => ({
            tipo_persona_sol: 'TIPERS.DES',
            persona_moral: t.tipoMercancia?.toLowerCase() === 'no',
            num_establ_tif: '',
            nom_establ_tif: '',
            nombre: t.nombre,
            apellido_paterno: t.primerApellido,
            apellido_materno: t.segundoApellido ?? '',
            razon_social: t.razonSocial,
            pais: t.pais,
            codigo_postal: t.codigoPostal,
            cve_entidad: t.estado,
            cve_deleg_mun: t.municipio ?? '',
            cve_colonia: t.colonia ?? '',
            calle: t.calle,
            num_exterior: t.numeroExterior,
            num_interior: t.numeroInterior ?? '',
            lada: t.lada ?? '',
            telefonos: t.telefono ?? '',
            correo: t.correo ?? '',
          })
        ),
      },

      pago: {
        exento_pago: AgriculturaComponent.verificaBoolean(
          datos?.pago?.exentoPago
        ),
        ide_motivo_exento_pago: datos.pago.justificacion,
        cve_referencia_bancaria: datos.pago.claveReferencia,
        cadena_pago_dependencia: datos.pago.cadenaDependencia,
        cve_banco: datos.pago.banco,
        llave_pago: datos.pago.llavePago,
        fec_pago: formatearFechaSolicitudSinHora( datos.pago.fechaPago) ?? '',
        imp_pago: Number(datos.pago.importePago),
      },
      // una vez que funcipone el login hay que revisar que toda la parte siguiente funcione
      solicitante: {
        rfc: this.valoresComplemento.rfc,
        rol_capturista: 'Solicitante', // suponemos se saca de la sesion pero aun no funciona login
        nombre:
          this.valoresComplemento.tipoPersona.toLowerCase() === 'm'
            ? this.valoresComplemento.razon_social ?? ''
            : this.valoresComplemento.nombre ?? '',
        es_persona_moral:
          this.valoresComplemento.tipoPersona.toLowerCase() === 'm',
        certificado_serial_number: 0, // no sabemos de donde se obtiene
      },

      representacion_federal: {
        cve_entidad_federativa: 'DGO', // aun no estan los datos login
        cve_unidad_administrativa: '1016', // aun no hay datos login
      },
    };
  }

  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
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
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos.
   *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
   * {void} No retorna ningún valor.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
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
   * Método para navegar a la sección anterior del wizard.
   * Actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  anterior(): void {
    this.componenteWizard.atras();
    this.indice = this.componenteWizard.indiceActual + 1;
    this.datosPasos.indice = this.componenteWizard.indiceActual + 1;
    if (this.indice === 3) {
      this.btnGuardar = false;
    }
    else {
      this.btnGuardar = true;
    }
  }

  /**
   * Método para navegar a la siguiente sección del wizard.
   * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.componenteWizard.siguiente();
    this.indice = this.componenteWizard.indiceActual + 1;
    this.datosPasos.indice = this.componenteWizard.indiceActual + 1;

    if (this.indice === 3) {
      this.btnGuardar = false;
    }
    else {
      this.btnGuardar = true;
    }
  }
  /**
   * Verifica si el valor viene como string y si es 'si' lo convierte en booleano
   * @param valor valor a verificar
   */
  static verificaBoolean(valor: string | boolean): boolean {
    if (typeof valor === 'string') {
      return valor.toLowerCase() === 'si';
    }
    return valor;
  }

  /**
   * Obtiene los datos de la pestaña Solicitante, en esta caso el RFC ORIGINAL
   */
  obtieneDatosTabSolicitud(): void {
    this.solicitanteQuery.selectSeccionState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.valoresComplemento.rfc = seccionState.rfc_original;
        this.valoresComplemento.tipoPersona = seccionState.tipo_persona;
        this.valoresComplemento.razon_social = seccionState.razon_social ?? '';
        this.valoresComplemento.nombre = seccionState.nombre;
      });
  }
}
