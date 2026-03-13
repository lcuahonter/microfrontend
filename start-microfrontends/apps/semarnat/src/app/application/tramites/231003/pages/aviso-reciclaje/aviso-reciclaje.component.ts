import { AVISO_CONTRNIDO, AccionBoton, CategoriaMensaje, ConsultaioState, DatosPasos, ERROR_FORMA_ALERT, ErrorModelo, ListaPasosWizard, Notificacion, WizardComponent, NotificacionesComponent, BtnContinuarComponent, AlertComponent } from '@libs/shared/data-access-user/src';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ES_PRIMERA_VEZ,
  PASOS,
  REQUIERE_EMPRESA_RECICLAJE,
  TRAMITE_ID,
} from '../../constantes/aviso-de-reciclaje.enum';
import { Observable, Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { AvisoDeReciclajeServiceService } from '../../service/aviso-de-reciclaje-service.service';
import { CodigoRespuesta } from './../../../231001/enum/enum-tramite';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatoSolicitudQuery } from '../../estados/queries/dato-solicitud.query';
import { DatoSolicitudStore } from '../../estados/tramites/dato-solicitud.store';
import { EstadoDatoSolicitud } from '../../models/datos-solicitud.model';
import { GuardarServiceT231003 } from '../../service/guardar.service';
import { GuardarSolicitud231003Request } from '../../models/guardar-solicitud-request';
import { MSG_REGISTRO_EXITOSO } from '../../../231001/enum/enum-tramite';

import { PasoDosComponent } from "../paso-dos/paso-dos.component";
import { PasoUnoT231003Component } from '../paso-uno/paso-uno-t231003.component';
import { ResultadoSolicitud } from '../../models/ResultadoSolicitud';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

/** Representa la forma cruda que puede venir desde el backend */
interface ErrorModeloRaw {
  campo?: string;
  errores?: string | string[] | null | undefined;
}

/**
 * Componente que representa la sección de aviso de reciclaje.
 * - selector: Etiqueta personalizada para utilizar este componente en otras plantillas.
 * - templateUrl: Archivo de plantilla HTML que contiene el diseño visual del componente.
 */
@Component({
  standalone: true,
  selector: 'app-aviso-reciclaje',
  templateUrl: './aviso-reciclaje.component.html',
  imports: [CommonModule, ReactiveFormsModule, PasoUnoT231003Component, NotificacionesComponent, WizardComponent, PasoDosComponent, BtnContinuarComponent, AlertComponent],
})
export class AvisoReciclajeComponent implements OnInit {
  /**
   * Folio temporal asignado a la solicitud.
   */
  public folioTemporal: number = 0;

  /**
   * Referencia al componente Wizard utilizado en la plantilla.
   */
  PASO_UNO = 1;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;
  /**
   * Indica si el formulario actual es válido.
   */
  esFormaValido: boolean = true;

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
   * @property pasos
   * @type {ListaPasosWizard[]}
   *  Arreglo que contiene los pasos del wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property wizardComponent
   * @type {WizardComponent}
   *  Referencia al componente del wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente del primer paso para validar formularios.
   */
  @ViewChild(PasoUnoT231003Component) pasoUno!: PasoUnoT231003Component;

  /** Clase CSS utilizada para mostrar una alerta de tipo informativo */
  public infoAlert = 'alert-info';

  /** Textos utilizados relacionados con el pago de derechos */
  TEXTOS = AVISO_CONTRNIDO;

  /**
   * Estado local de la solicitud obtenido desde el query/store.
   */
  public estadoSolicitud!: EstadoDatoSolicitud;

  /**
   * @property indice
   * @type {number}
   *  El índice de la pestaña seleccionada.
   */
  indice: number = 1;

  /**
   * The data for the steps in the wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Subject utilizado para notificar y limpiar las suscripciones al destruir el componente.
   */
  private destroy$ = new Subject<void>();

  /** Subject para notificar la destrucción del componente. */
  public consultaState!: ConsultaioState;

  /**
   * Constructor del componente.
   * @param consultaQuery Servicio para consultar el estado de la consulta.
   * @param avisoDeReciclajeServiceService Servicio para manejar los datos del aviso de reciclaje.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private t231003Query: DatoSolicitudQuery,
    private t231003Store: DatoSolicitudStore,
    private avisoDeReciclajeServiceService: AvisoDeReciclajeServiceService,
    private guardarService: GuardarServiceT231003
  ) { }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Se suscribe al estado de la consulta y actualiza la propiedad consultaState.
   * Si el estado indica actualización, carga los datos del formulario.
   */
  ngOnInit(): void {
    this.obtenerEstadoSolicitud();
  }

  /**
   * Método para guardar los datos del formulario.
   * Obtiene los datos iniciales de la solicitud y actualiza el estado del formulario si la respuesta es válida.
   */
  guardarDatosFormulario(): void {
    this.avisoDeReciclajeServiceService
      .obtenerDatosSolicitudInicial()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        // Si la respuesta existe, actualiza el estado del formulario
        if (resp) {
          this.avisoDeReciclajeServiceService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Método para obtener el estado de la solicitud desde el query.
   * Se suscribe al observable estadoFormulario$ y actualiza la propiedad estadoSolicitud.
   */
  obtenerEstadoSolicitud(): void {
    this.t231003Query.estadoFormulario$
      ?.pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.estadoSolicitud = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Updates the index value based on the action button event.
   * @param e The action button event containing the action and value.
   */
  getValorIndice(e: AccionBoton): void {
    if (this.indice === this.PASO_UNO) {
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
   * Lógica que se ejecuta después de intentar guardar la solicitud.
   * Maneja notificaciones, navegación del wizard y errores devueltos por el backend.
   * @param e Acción del botón con la dirección y valor de índice destino.
   */
  ejecutarPostGuardar(e: AccionBoton): void {
    if (this.indice === this.PASO_UNO) {
      this.ejecutaEnviarSolicitud()
        .pipe(
          takeUntil(this.destroy$),
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
          this.t231003Store.setIdSolicitud(response.datos.id_solicitud);
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
      takeUntil(this.destroy$)
    );
  }

  /**
   * Genera el payload para guardar la solicitud basado en el estado actual.
   * @returns GuardarSolicitud231003Request con los datos estructurados para el guardado.
   */
  generarRequestGuardarSolicitud(): GuardarSolicitud231003Request {
    const DATOS = this.estadoSolicitud;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { solicitudForm, empresaReciclaje, empresaTransportista, precaucionesManejo, residuos, lugarReciclaje } = DATOS;

    return {
      id_solicitud: DATOS.idSolicitud,
      numero_programa_immex: Number(solicitudForm.numeroProgramaImmex),
      discriminator_value: Number(TRAMITE_ID),
      cve_rol_capturista: 'PersonaMoral',
      cve_usuario_capturista: 'AAL0409235E6',
      descripcion_generica1: solicitudForm.descripcionGenerica1, //Giro del importador
      numero_registro_ambiental: solicitudForm.numeroRegistroAmbiental,
      descripcion_clob_generica1: precaucionesManejo.precaucionesManejo, // precauciones de manejo que se debe dar al residuo peligroso
      empresa_mismo_grupo:
        lugarReciclaje.reciclajeInstalaciones.toLowerCase() === ES_PRIMERA_VEZ,
      descripcion_generica3: lugarReciclaje.numeroAutorizacionEmpresaReciclaje,
      descripcion_generica2: lugarReciclaje.lugarReciclaje,
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

      transporte: {
        razon_social: empresaTransportista.nombreEmpresaTransportistaResiduos,
        autorizacion_semarnat_transporte:
          empresaTransportista.numeroAutorizacionSemarnat,
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
}
