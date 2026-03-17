import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  ConsultaioStore,
  PersonaTerceros,
  SolicitanteComponent,
  SolicitanteQuery,
  formatearFechaSolicitudSinHora,
} from '@ng-mf/data-access-user';
import {
  FilaSolicitud,
  ListaDeDatosFinal,
  TercerosrelacionadosExportadorTable,
  TercerosrelacionadosdestinoTable,
} from '../../models/220202/fitosanitario.model';
import {
  Observable,
  catchError,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
  firstValueFrom,
} from 'rxjs';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { DatosDeLaSolicitudComponent } from '../../components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosParaMovilizacionNacionalComponent } from '../../components/datos-para-movilizacion-nacional/datos-para-movilizacion-nacional.component';
import { GuardarSolicitud } from '../../models/220202/guardar-solicitud.model';
import { NgClass } from '@angular/common';
import { PagoDeDerechosComponent } from '../../components/pago-de-derechos/pago-de-derechos.component';
import { RegistroSolicitudService } from '../../services/220202/registro-solicitud/registro-solicitud.service';
import { SeccionLibStore } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { Subject } from 'rxjs';
import { TercerospageComponent } from '../../components/tercerospage/tercerospage.component';

/**
 * Componente para mostrar el subtítulo del asistente.
 * Este componente representa el primer paso de un formulario multipaso,
 * gestionando la navegación entre las diferentes secciones del formulario.
 * @component PasoUnoComponent
 * @selector app-paso-uno
 * @templateUrl ./paso-uno.component.html
 * @styleUrls ./paso-uno.component.scss --220202
 */

/**
 * @title PasoUnoComponent
 * @description
 * Componente que representa el primer paso de un formulario multipaso.
 * Gestiona la navegación entre diferentes pestañas/pasos del formulario,
 * cada uno representado por un componente específico.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrls: ['./paso-uno.component.scss'],
  standalone: true,
  imports: [
    SolicitanteComponent,
    DatosDeLaSolicitudComponent,
    DatosParaMovilizacionNacionalComponent,
    TercerospageComponent,
    PagoDeDerechosComponent,
    NgClass,
  ],
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * @description Referencia al componente DatosDeLaSolicitudComponent.
   * Esta referencia permite acceder a los métodos y propiedades del componente DatosDeLaSolicitudComponent,
   * @type {DatosDeLaSolicitudComponent}
   * @viewChild DatosDeLaSolicitudComponent
   */
  @ViewChild(DatosDeLaSolicitudComponent)
  datosSolicitudRef!: DatosDeLaSolicitudComponent;

  /**
   * @description Referencia al componente DatosParaMovilizacionNacionalComponent.
   * Esta referencia permite acceder a los métodos y propiedades del componente DatosParaMovilizacionNacionalComponent,
   * @type {DatosParaMovilizacionNacionalComponent}
   * @viewChild DatosParaMovilizacionNacionalComponent
   */
  @ViewChild(DatosParaMovilizacionNacionalComponent)
  datosParaMovilizacionRef!: DatosParaMovilizacionNacionalComponent;

  /**
   * @description Referencia al componente TercerospageComponent.
   * Esta referencia permite acceder a los métodos y propiedades del componente TercerospageComponent,
   * @type {TercerospageComponent}
   * @viewChild TercerospageComponent
   */
  @ViewChild(TercerospageComponent)
  tercerosPageComponentRef!: TercerospageComponent;

  /**
   * @description Referencia al componente PagoDeDerechosComponent.
   * Esta referencia permite acceder a los métodos y propiedades del componente PagoDeDerechosComponent,
   * @type {PagoDeDerechosComponent}
   * @viewChild PagoDeDerechosComponent
   */
  @ViewChild(PagoDeDerechosComponent)
  pagoDeDerechosComponentRef!: PagoDeDerechosComponent;

  /**
   * Referencia al componente hijo SolicitanteComponent para manejar los datos del solicitante.
   * @public
   * @type {SolicitanteComponent}
   * @memberof PasoUnoComponent
   */
  @ViewChild(SolicitanteComponent)
  solicitanteComponentRef!: SolicitanteComponent;

  /**
   * @description Índice de la pestaña/paso actual.
   * Este valor indica el paso actual en el proceso de formulario.
   * @type {number}
   * @default 1
   */
  indice: number = 1;

  /**
   * @method seleccionaTab
   * @description Selecciona una pestaña específica estableciendo el índice correspondiente.
   * @param {number} i - El índice de la pestaña a seleccionar.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Indica si existen datos de respuesta para mostrar en el formulario.
   * @type {boolean}
   */
  public esDatosRespuesta: boolean = false;

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
   * Indica si el formulario está en modo solo lectura.
   * @type {boolean}
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Lista de personas relacionadas con el trámite.
   * @type {PersonaTerceros[]}
   */
  public personas: PersonaTerceros[] = [];

  /**
   * @description
   * Array de objetos que representan las diferentes secciones del formulario.
   * Cada objeto contiene el índice, título y el nombre del componente correspondiente.
   * Este arreglo es utilizado para navegar entre los diferentes pasos del formulario.
   *
   * @type {Array<{ index: number, title: string, component: string }>}
   */
  seccionesDeLaSolicitud = [
    { index: 1, title: 'Solicitante', component: 'solicitante' },
    {
      index: 2,
      title: 'Datos de la solicitud',
      component: 'datos-de-la-solicitud',
    },
    {
      index: 3,
      title: 'Datos para movilización nacional',
      component: 'datos-para-movilizacion-nacional',
    },
    {
      index: 4,
      title: 'Terceros relacionados',
      component: 'terceros-relacionados',
    },
    { index: 5, title: 'Pago de derechos', component: 'pago-de-derechos' },
  ];

  /**
   * Rfc de la pantalla solicitante
   */
  rfcOriginal: string = '';
  /**
   * Tipo de persona de la pantalla solicitante
   */
  tipoPersonaSolicitante: string = '';
  /**
   * Razon social de la pantalla solicitante
   */
  razonSocialSolicitante: string = '';
  /**
   * Nombre de la pantalla solicitante
   */
  nombreSolicitante: string = '';
  /**
   * Indica si se debe mostrar el formulario o no.
   */
  ocultarForm: boolean = false;

  /**
   * Constructor del componente.
   * Este constructor inicializa el componente y establece el estado inicial de la validación
   * y de las secciones del formulario utilizando el servicio `SeccionLibStore`.
   * @constructor
   * @param {SeccionLibStore} seccionStore - Servicio para gestionar el estado de las secciones del formulario.
   * @param agriculturaApiService
   * @param consultaQuery
   * @param consultaioStore
   * @param registroSolicitudService
   * @param solicitanteQuery
   */
  constructor(
    private readonly seccionStore: SeccionLibStore,
    private agriculturaApiService: AgriculturaApiService,
    private consultaQuery: ConsultaioQuery,
    private consultaioStore: ConsultaioStore,
    private registroSolicitudService: RegistroSolicitudService,
    public solicitanteQuery: SolicitanteQuery
  ) {
    // Establece el estado de la forma como no válida al inicio.
    this.seccionStore.establecerFormaValida([false]);
    // Establece la primera sección como activa.
    this.seccionStore.establecerSeccion([true]);
  }

  ngOnInit(): void {
    this.obtieneDatosTabSolicitud();
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;
          if (this.consultaState.update) {
            this.guardarDatosFormulario();
          } else {
            this.esDatosRespuesta = true;
          }
          if (this.consultaState.readonly) {
            this.ocultarForm = true;
          }
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
        this.rfcOriginal = seccionState.rfc_original;
        this.tipoPersonaSolicitante = seccionState.tipo_persona;
        this.razonSocialSolicitante = seccionState.razon_social
          ? seccionState.razon_social
          : '';
        this.nombreSolicitante = seccionState.nombre;
      });
  }

  guardarDatosFormulario(): void {
    this.agriculturaApiService
      .getDatosDeLaSolicitudData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.agriculturaApiService.actualizarEstadoFormulario(
            resp as ListaDeDatosFinal
          );
          this.esDatosRespuesta = true;
        }
      });
  }

  /**
   * @description
   * Método que se ejecuta al seleccionar una pestaña/paso del formulario.
   * Actualiza el índice de la pestaña/paso actual, permitiendo la navegación
   * entre las diferentes secciones del formulario multipaso.
   *
   * @method seleccionaPestana
   * @param {number} i - Índice de la pestaña/paso seleccionada.
   * @returns {void}
   */
  seleccionaPestana(i: number): void {
    this.indice = i;
  }

  /**
   * @description Valida todos los formularios del paso uno
   * @method validarFormularios
   * @returns { valido: boolean; mensaje?: string } true si todos los formularios son válidos, false en caso contrario
   */
  public async validarFormularios(): Promise<{ valido: boolean; mensaje?: string }> {
    const TABS_VALIDADAS = [
      { index: 2, ref: this.datosSolicitudRef },
      { index: 3, ref: this.datosParaMovilizacionRef },
      { index: 4, ref: this.tercerosPageComponentRef },
      { index: 5, ref: this.pagoDeDerechosComponentRef },
    ];

    let esValido = true;

    for (const TAB of TABS_VALIDADAS) {
      const VALIDA_PESTAÑAS = TAB.ref.validarFormulario();
      if (TAB.ref && !VALIDA_PESTAÑAS.valido) {
        this.indice = TAB.index; // mover a la pestaña con error
        esValido = false;
        return { valido: esValido, mensaje: VALIDA_PESTAÑAS.mensaje! };
      }
    }
    if (esValido) {
      const CODIGO = await firstValueFrom(this.guardarSolicitud());
      if (CODIGO === '00') {
        return { valido: true, mensaje: this.consultaState.id_solicitud };
      } else if (CODIGO === 'PC01') {
        return { valido: false, mensaje: CODIGO}
      }
    }
    return { valido: false };
  }

  /**
   * Guarda la solicitud.
   * @method guardarSolicitud
   */
  guardarSolicitud(): Observable<string> {
    return this.agriculturaApiService.getAllDatosForma().pipe(
      take(1), // solo la primera emisión
      map((datos) => this.crearPayload(datos)), // crear payload
      switchMap((payload) =>
        this.registroSolicitudService
          .guardarSolicitud(220202, payload)
          .pipe(take(1))
      ),
      tap((data) => {
        if (data.codigo === '00') {
          this.consultaioStore.update((state) => ({
            ...state,
            id_solicitud: data.datos?.id_solicitud?.toString() ?? '',
          }));
        }
      }),
      map((data) => data.codigo),
      catchError((err) => {
        console.error('Error guardando solicitud:', err);
        return 'error';
      })
    );
  }

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
        exento_pago: datos.pago.exentoPago?.toLowerCase() === 'si',
        ide_motivo_exento_pago: datos.pago.justificacion,
        cve_referencia_bancaria: datos.pago.claveReferencia,
        cadena_pago_dependencia: datos.pago.cadenaDependencia,
        cve_banco: datos.pago.banco,
        llave_pago: datos.pago.llavePago,
        fec_pago: formatearFechaSolicitudSinHora(datos.pago.fechaPago) ?? '',
        imp_pago: Number(datos.pago.importePago),
      },
      // una vez que funcipone el login hay que revisar que toda la parte siguiente funcione
      solicitante: {
        rfc: this.rfcOriginal ?? '',
        rol_capturista: 'Solicitante', // suponemos se saca de la sesion pero aun no funciona login
        nombre:
          this.tipoPersonaSolicitante?.toLowerCase() === 'm'
            ? this.razonSocialSolicitante ?? ''
            : this.nombreSolicitante ?? '',
        es_persona_moral: this.tipoPersonaSolicitante?.toLowerCase() === 'm',
        certificado_serial_number: 0, // no sabemos de donde se obtiene
      },

      representacion_federal: {
        cve_entidad_federativa: 'DGO', // aun no estan los datos login
        cve_unidad_administrativa: '1016', // aun no hay datos login
      },
    };
  }

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
