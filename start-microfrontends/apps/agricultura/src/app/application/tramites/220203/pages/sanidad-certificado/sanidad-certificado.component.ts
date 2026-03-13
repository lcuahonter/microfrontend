import {
  AccionBoton,
  Acuicultura,
  DestinatarioForm,
  FilaSolicitud,
} from '../../models/220203/importacion-de-acuicultura.module';
import {
  AlertComponent,
  BtnContinuarComponent,
  ConsultaioQuery,
  ConsultaioState,
  ConsultaioStore,
  DatosPasos,
  ListaPasosWizard,
  PasoFirmaComponent,
  SolicitanteQuery,
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
import {
  ERROR_FORMA_ALERT,
  MENSAJE_DE_EXITO_ETAPA_UNO,
  PASOSACUICULTURA,
  PRIVACY_NOTICE_CONTENT,
} from '../../constantes/220203/importacion-de-acuicultura.enum';
import { Subject, catchError, map, switchMap, take, takeUntil } from 'rxjs';
import { ERROR_LLAVE_DUPLICADA_ALERT } from '../../../220202/constantes/220202/fitosanitario.enums';
import { GuardarSolicitud } from '../../models/220203/guardar-solicitud.model';
import { ImportacionDeAcuiculturaService } from '../../services/220203/importacion-de-acuicultura.service';
import { NgIf } from '@angular/common';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { RegistroSolicitudService } from '../../services/220203/registro-solicitud/registro-solicitud.service';
import { TercerosrelacionadosdestinoTable } from '../../../../shared/models/tercerosrelacionados.model';
import { USUARIO_INFO } from '@libs/shared/data-access-user/src/core/enums/usuario-info.enum';

/**
 * @fileoverview
 * Componente principal para la gestión del certificado de sanidad en el trámite de importación de acuicultura (220203).
 * Controla el flujo de pasos del wizard, la navegación entre secciones y la validación de formularios.
 * Cobertura de documentación completa: cada clase, método, propiedad y ViewChild está documentado en español.
 * @module SanidadCertificadoComponent
 */

/**
 * Componente principal para la gestión del certificado de sanidad en el trámite de importación de acuicultura.
 * Permite navegar entre los pasos del wizard, controla la validación de formularios y gestiona el estado del trámite.
 * Coordina la navegación entre diferentes secciones del proceso de importación.
 *
 * @class SanidadCertificadoComponent
 * @memberof SanidadCertificadoComponent
 */
@Component({
  selector: 'app-sanidad-certificado',
  templateUrl: './sanidad-certificado.component.html',
  standalone: true,
  imports: [
    AlertComponent,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    BtnContinuarComponent,
    PasoFirmaComponent,
    NgIf,
  ],
})
export class SanidadCertificadoComponent implements OnInit {
  /**
   * Indicador de validez del formulario para mostrar mensajes de error.
   * @public
   * @type {boolean}
   * @default false
   * @memberof SanidadCertificadoComponent
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
   * @description mnsaje al terminar de llenar el paso uno correctamente y generar folio
   */
  mensajePasos: string = '';

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
   * Contenido del aviso de privacidad utilizado en el componente.
   * @public
   * @readonly
   * @type {string}
   * @memberof SanidadCertificadoComponent
   */
  readonly PRIVACY_NOTICE_CONTENT: string = PRIVACY_NOTICE_CONTENT;

  /**
   * Lista de pasos del wizard obtenida de las constantes del trámite de acuicultura.
   * @public
   * @readonly
   * @type {ListaPasosWizard[]}
   * @memberof SanidadCertificadoComponent
   */
  readonly PASOS: ListaPasosWizard[] = PASOSACUICULTURA;

  /**
   * Índice actual del paso seleccionado en el wizard.
   * @public
   * @type {number}
   * @default 1
   * @memberof SanidadCertificadoComponent
   */
  indice: number = 1;

  /**
   * Objeto con la configuración de los textos y número de pasos del wizard.
   * @public
   * @type {DatosPasos}
   * @memberof SanidadCertificadoComponent
   */
  datosPasos: DatosPasos = {
    nroPasos: this.PASOS.length,
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
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * @type {Subject<void>}
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Estado de la consulta actual, contiene la información relevante del solicitante.
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;

  /**
   * Variable para almacenar el id de la solicitud.
   * @private
   */
  public idSolicitud: string = '';

  /**
   * Consulta datos del solicitante dentro de akita
   */
  public solicitanteQuery: SolicitanteQuery = inject(SolicitanteQuery);
  private consultaioStore: ConsultaioStore = inject(ConsultaioStore);
  public importacionDeAcuiculturaService: ImportacionDeAcuiculturaService =
    inject(ImportacionDeAcuiculturaService);
  public registroSolicitudService: RegistroSolicitudService = inject(
    RegistroSolicitudService
  );
  /** Indica si el botón Guardar debe mostrarse o estar habilitado en el formulario. */
  public btnGuardar: boolean = true;
  /** Indica la visibilidad del botón Guardar. */
  public btnGuardarVisible: string = 'visible';
  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;
  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();
  /**
   * Indica si el botón para cargar archivos está hñabilitado.
   */
  activarBotonCargaArchivos: boolean = false;
  /** Carga de progreso del archivo */
  cargaEnProgreso: boolean = true;

  /**
   * Referencia al componente Wizard para controlar la navegación entre pasos.
   * @public
   * @type {WizardComponent}
   * @memberof SanidadCertificadoComponent
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente del primer paso para validación de formularios.
   * @public
   * @type {PasoUnoComponent}
   * @memberof SanidadCertificadoComponent
   */
  @ViewChild(PasoUnoComponent) pasoUnoRef!: PasoUnoComponent;

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
      const VALIDA_PESTANAS = await this.pasoUnoRef?.validarFormulariosDos();
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
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
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

  /**
   * Método para navegar a la sección anterior del wizard.
   * Actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
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
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;

    if (this.indice === 3) {
      this.btnGuardar = false;
    }
    else {
      this.btnGuardar = true;
    }
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

  protected readonly datosUsuario = USUARIO_INFO;

  /**
   * Metodo que hace guardado parcial del formulario
   */
  guardarDatosFormulario(): void {
    this.importacionDeAcuiculturaService
      .getAllDatosForma()
      .pipe(
        takeUntil(this.destroyNotifier$),
        take(1),
        map((datos) => this.crearPayload(datos)),
        switchMap((payload) => {
          return this.registroSolicitudService
            .guardarParcialSolicitud(220203, payload)
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

  private crearPayload(datos: Acuicultura): GuardarSolicitud {
    return {
      id_solicitud:
        this.consultaState?.id_solicitud !== null &&
        this.consultaState?.id_solicitud !== '' &&
        !isNaN(Number(this.consultaState?.id_solicitud))
          ? Number(this.consultaState?.id_solicitud)
          : null,
      datos_solicitud: {
        cve_aduana: datos.realizarGroup.aduanaIngreso!,
        oficina_inspeccion_sanidad_agropecuaria:
          datos.realizarGroup.oficinaInspeccion,
        punto_inspeccion: datos.realizarGroup.puntoInspeccion,
        numero_autorizacion: datos.realizarGroup.numeroGuia!,
        clave_regimen: datos.realizarGroup.regimen,
        numero_carro_ferrocarril: '', // no se encuentra en el formulario
        mercancia: (datos.mercanciaGroup ?? []).map((t: FilaSolicitud) => ({
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
          descripción_especie: t.especie ?? '',
          lista_detalle_mercancia: (t.lista_detalle_mercancia ?? []).map(
            (x) => ({
              id_vida_silvestre: String(x.nombreCientifico),
            })
          ),
        })),
      },

      transporte: {
        ide_medio_transporte: datos.formularioMovilizacion.medioDeTransporte,
        identificacion_transporte:
          datos.formularioMovilizacion.identificacionTransporte,
        id_punto_verificacion: Number(
          datos.formularioMovilizacion.puntoVerificacion
        ),
        razon_social: datos.formularioMovilizacion.nombreEmpresaTransportista,
      },

      terceros: {
        terceros_exportador: (datos.datosForma ?? []).map(
          (t: DestinatarioForm) => ({
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
        // hay que ver que TercerosrelacionadosdestinoTable se quede asi o lo agreuemos al tramite
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
        exento_pago: datos.pagoDeDerechos.exentoPago?.toLowerCase() === 'si',
        ide_motivo_exento_pago: datos.pagoDeDerechos.justificacion,
        cve_referencia_bancaria: datos.pagoDeDerechos.claveReferencia,
        cadena_pago_dependencia: datos.pagoDeDerechos.cadenaDependencia,
        cve_banco: datos.pagoDeDerechos.banco,
        llave_pago: datos.pagoDeDerechos.llavePago,
        fec_pago:
          formatearFechaSolicitudSinHora(datos.pagoDeDerechos.fechaPago) ?? '',
        imp_pago: Number(datos.pagoDeDerechos.importePago),
      },
      // una vez que funcipone el login hay que revisar que toda la parte siguiente funcione
      solicitante: {
        rfc: this.valoresComplemento.rfc ?? '',
        rol_capturista: 'Solicitante', // suponemos se saca de la sesion pero aun no funciona login
        nombre:
          this.valoresComplemento.tipoPersona?.toLowerCase() === 'm'
            ? this.valoresComplemento.razon_social ?? ''
            : this.valoresComplemento.nombre ?? '',
        es_persona_moral:
          this.valoresComplemento.tipoPersona?.toLowerCase() === 'm',
        certificado_serial_number: 0, // no sabemos de donde se obtiene
      },

      representacion_federal: {
        cve_entidad_federativa: 'DGO', // aun no estan los datos login
        cve_unidad_administrativa: '1016', // aun no hay datos login
      },
    };
  }
}
