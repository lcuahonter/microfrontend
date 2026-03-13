import { AlertComponent, BtnContinuarComponent, CategoriaMensaje, DatosPasos, ERROR_FORMA_ALERT, ListaPasosWizard, Notificacion, NotificacionesComponent, WizardComponent } from '@ng-mf/data-access-user';
import {
  CodigoRespuesta,
  MSG_REGISTRO_EXITOSO,
} from '../../../231001/enum/enum-tramite';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ES_PRIMERA_VEZ,
  PAGO_DE_DERECHOS,
  PASOS,
  REQUIERE_EMPRESA_RECICLAJE,
  TRAMITE_ID,
} from '../../constantes/aviso-retorno.enum';
import { Observable, Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatoSolicitudQuery } from '../../estados/queries/dato-solicitud.query';
import { DatoSolicitudStore } from '../../estados/tramites/dato-solicitud.store';
import { EstadoDatoSolicitud } from '../../models/datos-solicitud.model';
import { GuardarServiceT231002 } from '../../services/guardar.service';
import { GuardarSolicitud231002Request } from '../../models/guardar-solicitud-request';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ResultadoSolicitud } from '../../../231001/models/ResultadoSolicitud';

/**
 * Interfaz que define la estructura de un objeto para manejar acciones de botones en el componente.
 */
export interface AccionBoton {
  accion: string;
  valor: number;
}

/** Representa la forma cruda que puede venir desde el backend */
interface ErrorModeloRaw {
  campo?: string;
  errores?: string | string[] | null | undefined;
}

/** Forma normalizada que usa el componente */
interface ErrorModelo {
  campo: string;
  errores: string[];
}

/**
 * Constante que representa el índice del primer paso en el proceso de wizard.
 */
const PASO_UNO = 1;
/**
 * Componente que gestiona el proceso de aviso de retorno mediante un sistema de pasos (wizard).
 * Controla la navegación entre diferentes pasos del proceso y maneja la lógica relacionada con:
 * - Consulta de estados
 * - Carga inicial de datos
 * - Navegación entre pasos
 * - Gestión de suscripciones
 */
@Component({
  selector: 'app-solicitud-page',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    BtnContinuarComponent,
    AlertComponent,
    NotificacionesComponent
  ],
  templateUrl: './solicitud-page.component.html',
})
export class SolicitudPageComponent implements OnInit, OnDestroy {
  /**
   * Folio temporal asignado a la solicitud.
   */
  public folioTemporal: number = 0;

  /**
   * Estado actual de la solicitud.
   */
  private destroyed$ = new Subject<void>();

  constructor(
    private t231002Query: DatoSolicitudQuery,
    private t231002Store: DatoSolicitudStore,
    private guardarService: GuardarServiceT231002
  ) { }

  /**
   * Método de inicialización del componente.
   * Se suscribe al estado de la solicitud para mantener el estado local actualizado.
   */
  ngOnInit(): void {
    this.t231002Store.reset();
    this.obtenerEstadoSolicitud();
  }

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Notificación que se puede utilizar para mostrar mensajes emergentes (toastr).
   * Null cuando no hay notificación nueva.
   */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   * Notificación tipo banner que se muestra tras operaciones exitosas.
   */
  public alertaNotificacion!: Notificacion;

  /**
   * Indica si el formulario actual es válido.
   */
  esFormaValido: boolean = true;
  /**
   * Lista de pasos configurados para el wizard.
   * @type {ListaPasosWizard[]}
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Referencia al componente wizard para controlar la navegación entre pasos.
   * @type {WizardComponent}
   */
  @ViewChild('wizard', { static: false }) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente del primer paso para validar formularios.
   */
  @ViewChild(PasoUnoComponent) pasoUno!: PasoUnoComponent;

  /**
   * Estado local de la solicitud obtenido desde el query/store.
   */
  public estadoSolicitud!: EstadoDatoSolicitud;
  /**
   * Clase CSS para estilizar alertas informativas.
   * @type {string}
   */
  public infoAlert = 'alert-info';

  /**
   * Textos estáticos relacionados con el pago de derechos.
   * @type {typeof PAGO_DE_DERECHOS}
   */
  TEXTOS = PAGO_DE_DERECHOS;

  /**
   * Índice del paso actual en el wizard.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Datos de configuración para el componente de pasos.
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Obtiene el estado actual de la solicitud desde el query y lo asigna al estado local.
   */
  obtenerEstadoSolicitud(): void {
    this.t231002Query.estadoFormulario$
      ?.pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.estadoSolicitud = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Maneja la navegación entre pasos del wizard.
   * @param e Objeto con información de la acción del botón
   */
  getValorIndice(e: AccionBoton): void {
    if (this.indice === PASO_UNO) {
      const FORM_VALIDO = this.pasoUno?.validarTodosLosFormularios();
      this.esFormaValido = FORM_VALIDO;
      if (!FORM_VALIDO) {
        this.datosPasos.indice = this.indice;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }
      this.ejecutarPostGuardar(e);
    } else {
      if (e.valor > 0 && e.valor < 5) {
        this.indice = e.valor;
        this.actualizarDatosPasos();
        if (e.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
        }
      }
    }
  }

  /**
   * Actualiza los datos del componente de pasos con el índice actual y el número total de pasos.
   */
  actualizarDatosPasos(): void {
    this.datosPasos = {
      nroPasos: this.pasos.length,
      indice: this.indice,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    };
  }

  /**
   * Lógica que se ejecuta después de intentar guardar la solicitud.
   * Maneja notificaciones, navegación del wizard y errores devueltos por el backend.
   * @param e Acción del botón con la dirección y valor de índice destino.
   */
  ejecutarPostGuardar(e: AccionBoton): void {
    if (this.indice === PASO_UNO) {
      this.ejecutaEnviarSolicitud()
        .pipe(
          takeUntil(this.destroyed$),
          tap((respuesta) => {
            if (!respuesta.exito) {
              const ERRORESEXTRA = (respuesta.erroresModelo || [])
                .map((err) => `${err.campo}: ${err.errores.join(', ')}`)
                .join('<br>');

              const MENSAJEFINAL = `${respuesta.mensaje || 'Error inesperado al enviar la solicitud.'
                }${ERRORESEXTRA}`;

              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: 'Error',
                mensaje:
                  MENSAJEFINAL || 'Error inesperado al enviar la solicitud.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };

              setTimeout(
                () => window.scrollTo({ top: 0, behavior: 'smooth' }),
                0
              );
              this.indice = 1;
              this.wizardComponent.indiceActual = 1;
              this.actualizarDatosPasos();
              return;
            }

            if (e.valor > 0 && e.valor < 5) {
              this.alertaNotificacion = {
                tipoNotificacion: 'banner',
                categoria: 'success',
                modo: 'action',
                titulo: '',
                mensaje: MSG_REGISTRO_EXITOSO(String(this.folioTemporal)),
                cerrar: true,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
              this.indice = e.valor;
              this.actualizarDatosPasos();
              if (e.accion === 'cont') {
                this.wizardComponent.siguiente();
              } else {
                this.wizardComponent.atras();
              }
            }
          }),
          catchError((err) => {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: '',
              mensaje:
                err?.mensaje || 'Error inesperado al enviar la solicitud.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            setTimeout(
              () => window.scrollTo({ top: 0, behavior: 'smooth' }),
              0
            );
            return of(false);
          })
        )
        .subscribe();
    } else {
      if (e.valor > 0 && e.valor < 5) {
        this.indice = e.valor;
        this.actualizarDatosPasos();
        if (e.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
        }
      }
    }
  }

  /**
   * Envía el payload construido al servicio `guardarService.postSolicitud`.
   * Normaliza la respuesta y devuelve un Observable con ResultadoSolicitud.
   * @returns Observable<ResultadoSolicitud> con el resultado del intento de guardado.
   */
  ejecutaEnviarSolicitud(): Observable<ResultadoSolicitud> {
    const PAYLOAD = this.generarRequestGuardarSolicitud();
    return this.guardarService.postSolicitud(PAYLOAD).pipe(
      map((response) => {
        if (
          response.codigo === CodigoRespuesta.EXITO &&
          response.datos?.id_solicitud
        ) {
          this.t231002Store.setIdSolicitud(response.datos.id_solicitud);
          this.folioTemporal = response.datos.id_solicitud;
          return { exito: true };
        }

        const MENSAJE =
          response?.error ||
          response?.mensaje ||
          response?.causa ||
          'Ocurrió un error al guardar la solicitud.';

        const ERRORESMODELO: ErrorModelo[] = (
          (response?.errores_modelo ?? []) as ErrorModeloRaw[]
        ).map((err) => {
          const CAMPO = typeof err?.campo === 'string' ? err.campo : 'general';
          const RAW_ERRORES = err?.errores;
          const ERRORES = Array.isArray(RAW_ERRORES)
            ? RAW_ERRORES.map(String)
            : RAW_ERRORES === null
              ? [String(RAW_ERRORES)]
              : [];
          return { campo: CAMPO, errores: ERRORES };
        });

        return {
          exito: false,
          MENSAJE,
          erroresModelo: ERRORESMODELO,
        } as ResultadoSolicitud;
      }),
      catchError((error) => {
        const MENSAJE =
          error?.error?.error ||
          error?.message ||
          'Error inesperado al guardar la solicitud.';

        return of({
          exito: false,
          MENSAJE,
          erroresModelo: error?.error?.errores_modelo || [],
        });
      }),
      takeUntil(this.destroyed$)
    );
  }

  /**
   * Genera el payload para guardar la solicitud basado en el estado actual.
   * @returns GuardarSolicitud231002Request con los datos estructurados para el guardado.
   */
  generarRequestGuardarSolicitud(): GuardarSolicitud231002Request {
    const DATOS = this.estadoSolicitud;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { solicitudForm, empresaReciclaje, empresaTransportista, lugarReciclaje, precaucionesManejo, residuos } = DATOS;

    return {
      id_solicitud: DATOS.idSolicitud,
      numero_programa_immex: Number(solicitudForm.numeroProgramaImmex),
      discriminator_value: Number(TRAMITE_ID),
      cve_rol_capturista: 'PersonaMoral',
      cve_usuario_capturista: 'AAL0409235E6',
      boolean_generico: solicitudForm.ideGenerica1 === ES_PRIMERA_VEZ, // boolean (es primera vez)
      descripcion_generica1: solicitudForm.descripcionGenerica1, //Giro del importador
      numero_registro_ambiental: solicitudForm.numeroRegistroAmbiental,
      descripcion_clob_generica2: Number(solicitudForm.domicilio), //Domicilio IMMEX
      descripcion_clob_generica1: precaucionesManejo.precaucionesManejo, // precauciones de manejo que se debe dar al residuo peligroso
      empresa_controladora:
        empresaReciclaje.requiereEmpresa.toLowerCase() ===
        REQUIERE_EMPRESA_RECICLAJE, // Requiere empresa retorno
      solicitante: {
        rfc: 'AAL0409235E6',
        nombre: 'IGNACIO EDUARDO',
        es_persona_moral: true,
        certificado_serial_number: '3082054030820428a00302010',
      },
      empresa_reciclaje: {
        id_empresa: null,
        razon_social: empresaReciclaje.representanteLegal,
        nombre: empresaReciclaje.nombreEmpresa,
        telefono: empresaReciclaje.telefono,
        correo_electronico: empresaReciclaje.correoElectronico,
      },
      destinatario: {
        razon_social: lugarReciclaje.razonSocial,
        pais: lugarReciclaje.pais,
        domicilio: lugarReciclaje.destinoDomicilio,
        codigo_postal: lugarReciclaje.codigoPostal,
      },
      transporte: {
        razon_social: empresaTransportista.nombreEmpresaTransportistaResiduos,
        autorizacion_semarnat_transporte:
          empresaTransportista.numeroAutorizacionSemarnat,
      },
      aduana_salida: {
        clave: precaucionesManejo.clave,
      },
      residuos: residuos.map((residuo) => ({
        boolean_generico_1: residuo.origenResiduoGeneracion
          .toLowerCase()
          .includes('materia prima residual'), //  Residuo (materia prima residual)
        desc_boolean_generico_1: residuo.origenResiduoGeneracion, // Descripción genérica del residuo - descripcion del radio buton
        fraccion_arancelaria: residuo.fraccionCve,
        cve_nico: residuo.nicoCve,
        desc_nico: residuo.nicoDesc,
        unidad_medida: residuo.unidadMedidaCve,
        desc_unidad_medida: residuo.unidadMedidaDesc,
        nombre_quimico: residuo.acotacion,
        nombre_residuo: residuo.residuoDescDesc,
        acotacion: residuo.acotacion,
        nombre_residuo_peligroso: residuo.nombreResiduo,
        cantidad: residuo.cantidad,
        cantidad_letra: residuo.cantidadLetra,
        cve_clasificacion: residuo.residuoCve,
        nombre_clasificacion: residuo.residuoNombre,
        desc_clasificacion: residuo.residuoDesc,
        desc_otra_clasificacion: residuo.residuoOtro,
        creti: residuo.cretiCve,
        estado_fisico: residuo.estadoFisicoCve,
        desc_otro_estado_fisico: residuo.estadoFisicoOtro,
        numero_manifiesto: residuo.numeroManifiesto,
        tipo_contenedor: residuo.tipoContenedorCve,
        desc_otro_contenedor: residuo.tipoContenedorOtro,
        desc_especie: residuo.desc_especie, // valores de los radios de "Tipo de residuo" que se selecciona
        capacidad: residuo.capacidad, //descripcionDenominacionEspecifica
        fraccion_name: residuo.fraccionDesc,
        nico_name: residuo.nicoDesc,
        cve_clasificacion_desc: residuo.residuoDescCve,
        name_clasificacion: residuo.residuoNombreDesc,
        desc_creti: residuo.cretiDesc,
        desc_estado_fisico: residuo.estadoFisicoDesc,
        desc_tipo_contenedor: residuo.tipoContenedorDesc,
        desc_otro: residuo.tipoContenedorOtro,
        materias_primas_relacionadas: residuo.materiasPrimasRelacionadas,
      })),
    };
  }

  /**
   * Limpia las suscripciones para evitar fugas de memoria al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
