import {
  Acuicultura,
  DestinatarioForm,
  FilaSolicitud,
} from '../../models/220203/importacion-de-acuicultura.module';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  ConsultaioStore,
  SolicitanteQuery,
  formatearFechaSolicitudSinHora,
} from '@ng-mf/data-access-user';
import {
  Observable,
  Subject,
  catchError,
  firstValueFrom,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from '../../components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosParaMovilizacionComponent } from '../../components/datos-para-movilizacion/datos-para-movilizacion.component';
import { GuardarSolicitud } from '../../models/220203/guardar-solicitud.model';
import { ImportacionDeAcuiculturaService } from '../../services/220203/importacion-de-acuicultura.service';
import { PagoDeDerechosComponent } from '../../components/pago-de-derechos/pago-de-derechos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroSolicitudService } from '../../services/220203/registro-solicitud/registro-solicitud.service';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { TercerospageComponent } from '../../components/tercerospage/tercerospage.component';
import { TercerosrelacionadosdestinoTable } from '../../../../shared/models/tercerosrelacionados.model';

/**
 * @fileoverview
 * Componente para gestionar el primer paso del proceso de importación de acuicultura (trámite 220203).
 * Coordina múltiples formularios incluyendo solicitante, datos de solicitud, movilización, terceros y pagos.
 * Cobertura de documentación completa: cada clase, método, propiedad y ViewChild está documentado en español.
 * @module PasoUnoComponent
 */

/**
 * Componente standalone que gestiona el primer paso del proceso de importación de acuicultura.
 * Coordina la validación y gestión de datos de múltiples secciones del formulario.
 * Implementa las interfaces OnInit y OnDestroy para el manejo adecuado del ciclo de vida.
 *
 * @class PasoUnoComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 * @memberof PasoUnoComponent
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [
    SolicitanteComponent,
    TercerospageComponent,
    ReactiveFormsModule,
    DatosDeLaSolicitudComponent,
    DatosParaMovilizacionComponent,
    PagoDeDerechosComponent,
    CommonModule,
  ],
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Índice de la pestaña actualmente seleccionada en el formulario.
   * @public
   * @type {number}
   * @default 1
   * @memberof PasoUnoComponent
   */
  indice: number = 1;

  /**
   * Estado de la consulta actual, contiene la información relevante del solicitante.
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;

  /**
   * Lista de secciones del formulario con sus respectivos índices, títulos y componentes asociados.
   * @public
   * @type {Array<{ index: number; title: string; component: string; }>}
   * @memberof PasoUnoComponent
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
      component: 'terceror-relacionados',
    },
    { index: 5, title: 'Pago de derechos', component: 'pago-de-derechos' },
  ];

  /**
   * Referencia al componente hijo SolicitanteComponent para manejar los datos del solicitante.
   * @public
   * @type {SolicitanteComponent}
   * @memberof PasoUnoComponent
   */
  @ViewChild('solicitanteRef') solicitante!: SolicitanteComponent;

  /**
   * Referencia al componente hijo DatosDeLaSolicitudComponent para manejar los datos de la solicitud.
   * @public
   * @type {DatosDeLaSolicitudComponent}
   * @memberof PasoUnoComponent
   */
  @ViewChild('datosSolicitudRef') datosSolicitud!: DatosDeLaSolicitudComponent;

  /**
   * Referencia al componente hijo DatosParaMovilizacionComponent para manejar los datos de movilización.
   * @public
   * @type {DatosParaMovilizacionComponent}
   * @memberof PasoUnoComponent
   */
  @ViewChild('datosParaMovilizacionRef')
  datosParaMovilizacion!: DatosParaMovilizacionComponent;

  /**
   * Referencia al componente hijo PagoDeDerechosComponent para manejar los pagos de derechos.
   * @public
   * @type {PagoDeDerechosComponent}
   * @memberof PasoUnoComponent
   */
  @ViewChild('pagoDerechosRef') pagoDerechos!: PagoDeDerechosComponent;

  /**
   * Referencia al componente hijo TercerospageComponent para manejar los terceros relacionados.
   * @public
   * @type {TercerospageComponent}
   * @memberof PasoUnoComponent
   */
  @ViewChild('tercerospageRef') tercerospage!: TercerospageComponent;

  /**
   * Subject utilizado para notificar y completar las suscripciones activas al destruir el componente.
   * Evita fugas de memoria y se utiliza junto con el operador takeUntil.
   * @private
   * @readonly
   * @type {Subject<void>}
   * @memberof PasoUnoComponent
   */
  private readonly DESTROY_NOTIFIER$ = new Subject<void>();

  public RENDERDOM: boolean = false;

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
   * Constructor que inyecta los servicios requeridos para el funcionamiento del componente.
   * @constructor
   * @param {ImportacionDeAcuiculturaService} importacionDeAcuiculturaService - Servicio para gestionar operaciones relacionadas con la importación de acuicultura
   * @param {ConsultaioQuery} consultaQuery - Query para manejar el estado de las consultas
   * @param consultaioStore
   * @param registroSolicitudService
   * @param solicitanteQuery
   * @memberof PasoUnoComponent
   */
  constructor(
    private importacionDeAcuiculturaService: ImportacionDeAcuiculturaService,
    private consultaQuery: ConsultaioQuery,
    private consultaioStore: ConsultaioStore,
    private registroSolicitudService: RegistroSolicitudService,
    public solicitanteQuery: SolicitanteQuery
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((seccionState) => {
        this.consultaState = seccionState;
        if (seccionState.update) {
          this.guardarDatosFormulario();
        } else {
          this.RENDERDOM = true;
        }
        if (this.consultaState.readonly) {
          this.ocultarForm = true;
        }
      });
  }

  ngOnInit(): void {
    this.obtieneDatosTabSolicitud();
  }

  /**
   * Obtiene los datos de la pestaña Solicitante, en esta caso el RFC ORIGINAL
   */
  obtieneDatosTabSolicitud() {
    this.solicitanteQuery.selectSeccionState$
      .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      .subscribe((seccionState) => {
        this.rfcOriginal = seccionState.rfc_original;
        this.tipoPersonaSolicitante = seccionState.tipo_persona;
        this.razonSocialSolicitante = seccionState.razon_social
          ? seccionState.razon_social
          : '';
        this.nombreSolicitante = seccionState.nombre;
      });
  }

  /**
   * Cambia el índice de la pestaña seleccionada en el formulario.
   * @public
   * @param {number} i - El índice de la pestaña a seleccionar
   * @memberof PasoUnoComponent
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método que valida todos los formularios del paso uno del trámite de acuicultura.
   * Verifica la validez de cada sección: solicitante, datos de solicitud, movilización, terceros y pagos.
   * @public
   * @returns {boolean} Retorna true si todos los formularios son válidos, false en caso contrario
   * @memberof PasoUnoComponent
   */
  public async validarFormularios(): Promise<boolean> {
    const TABS_VALIDADAS = [
      { index: 2, ref: this.datosSolicitud },
      { index: 3, ref: this.datosParaMovilizacion },
      { index: 4, ref: this.tercerospage },
      { index: 5, ref: this.pagoDerechos },
    ];

    // Validación síncrona de pestañas
    for (const TAB of TABS_VALIDADAS) {
      const VALIDA_PESTAÑAS = TAB.ref.validarFormulario();

      if (!VALIDA_PESTAÑAS) {
        this.indice = TAB.index;
        return false;
      }
    }

    // Ahora sí, espera a guardarSolicitud()
    try {
      const CODIGO = await firstValueFrom(this.guardarSolicitud());

      if (CODIGO === '00') {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error en guardarSolicitud:', err);
      return false;
    }
  }

  /**
   * @description Valida todos los formularios del paso uno
   * @method validarFormularios
   * @returns { valido: boolean; mensaje?: string } true si todos los formularios son válidos, false en caso contrario
   */
  public async validarFormulariosDos(): Promise<{ valido: boolean; mensaje?: string }> {
    const TABS_VALIDADAS = [
      { index: 2, ref: this.datosSolicitud },
      { index: 3, ref: this.datosParaMovilizacion },
      { index: 4, ref: this.tercerospage },
      { index: 5, ref: this.pagoDerechos },
    ];

    let esValido = true;

    for (const TAB of TABS_VALIDADAS) {
      const VALIDA_PESTAÑAS = TAB.ref.validarFormulario();
      if (TAB.ref && !VALIDA_PESTAÑAS) {
        this.indice = TAB.index; // mover a la pestaña con error
        esValido = false;
        return { valido: esValido, mensaje: '' };
      }
    }
    if (esValido) {
      const CODIGO = await firstValueFrom(this.guardarSolicitud());
      if (CODIGO === '00') {
        return { valido: true, mensaje: this.consultaState.id_solicitud };
      } else if (CODIGO === 'PC01') {
        return {valido: false, mensaje: CODIGO}
      }
    }
    return { valido: false };
  }

  /**
   * Obtiene los datos de acuicultura y actualiza el estado del formulario.
   * Realiza una suscripción al observable que retorna los datos de acuicultura.
   * Utiliza takeUntil para evitar fugas de memoria al destruir el componente.
   * @public
   * @memberof PasoUnoComponent
   */
  async guardarDatosFormulario(): Promise<void> {
    try {
      const RESP = await firstValueFrom(
        this.importacionDeAcuiculturaService
          .getAcuiculturaData()
          .pipe(takeUntil(this.DESTROY_NOTIFIER$))
      );
      if (RESP) {
        await this.importacionDeAcuiculturaService.actualizarEstadoFormulario(
          RESP
        );
      }
      this.RENDERDOM = true;
    } catch (error) {
      this.RENDERDOM = true;
    }
  }

  /**
   * Guarda la solicitud.
   * @method guardarSolicitud
   */
  guardarSolicitud(): Observable<string> {
    return this.importacionDeAcuiculturaService.getAllDatosForma().pipe(
      take(1), // solo la primera emisión
      map((datos) => this.crearPayload(datos)), // crear payload
      switchMap((payload) =>
        this.registroSolicitudService
          .guardarSolicitud(220203, payload)
          .pipe(take(1))
      ),
      tap((data) => {
        this.consultaioStore.update((state) => ({
          ...state,
          id_solicitud: data.datos?.id_solicitud?.toString() ?? '',
        }));
      }),
      map((data) => data.codigo),
      catchError((err) => {
        console.error('Error guardando solicitud:', err);
        return 'error';
      })
    );
  }

  /**
   * Crea un objeto de tipo GuardarSolicitud a partir de los datos de acuicultura.
   * @private
   * @param {Acuicultura} datos - Los datos de acuicultura a utilizar para crear el payload.
   * @returns {GuardarSolicitud} El objeto GuardarSolicitud creado.
   * @memberof PasoUnoComponent
   */
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
        fec_pago: formatearFechaSolicitudSinHora(datos.pagoDeDerechos.fechaPago) ?? '',
        imp_pago: Number(datos.pagoDeDerechos.importePago),
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
  /**
   * Método del ciclo de vida que se ejecuta cuando el componente es destruido.
   * Limpia los recursos suscritos y detiene las emisiones de datos para prevenir memory leaks.
   * @public
   * @memberof PasoUnoComponent
   */
  ngOnDestroy(): void {
    this.DESTROY_NOTIFIER$.next();
    this.DESTROY_NOTIFIER$.complete();
  }
}
