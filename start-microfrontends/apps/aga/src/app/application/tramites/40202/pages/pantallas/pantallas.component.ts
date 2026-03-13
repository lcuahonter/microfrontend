import { AccionBoton, DatosPasos, ListaPasosWizard, WizardComponent, AlertComponent, AVISO_CONTRNIDO, BtnContinuarComponent, PasoFirmaComponent, Notificacion, NotificacionesComponent, LoginQuery, CategoriaMensaje } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Tramite40202Store, TransportacionMaritima40202State } from '../../estados/tramite40202.store';
import { ALERTA } from '@libs/shared/data-access-user/src/tramites/constantes/mensajes-error-formularios';
import { DatosComponent } from '../datos/datos.component';
import { ERROR_AGENTE_NAVIERO, MSG_REGISTRO_EXITOSO, PASOS } from '../../../40201/constantes/transportacion-maritima.enum';
import { MODIFICACION_TRANSPORTACION_MARITIMA_PASO } from '../../constantes/modificacion-transportacion-maritima.enum';
import { ModificacionTransportacionMaritimaService } from '../../services/modificacion-transportacion-maritima/modificacion-transportacion-maritima.service';
import { Tramite40202Query } from '../../estados/tramite40202.query';
import { catchError, map, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { ResultadoSolicitud } from '../../../31910/models/ResultadoSolicitud';
import { CodigoRespuesta } from '../../../../core/enums/aga-core-enum';
import { CommonModule } from '@angular/common';

/**
 * Componente principal para la gestión de pantallas en el wizard de cupos.
 */
@Component({
  standalone: true,
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
  styles: ``,
  imports: [AlertComponent, BtnContinuarComponent, CommonModule, PasoFirmaComponent, DatosComponent, WizardComponent, NotificacionesComponent]
})
export class PantallasComponent implements OnInit, OnDestroy {

  /**
   * Sujeto para manejar la destrucción del componente y evitar fugas de memoria.
   */
  destroy$: Subject<void> = new Subject<void>();

  constructor(
    private store: Tramite40202Store,
    private query: Tramite40202Query,
    private loginQuery: LoginQuery,
    private service: ModificacionTransportacionMaritimaService
  ) { }

  /**
    * Lista de pasos para el wizard (configuración estática importada).
    */
  pasos: ListaPasosWizard[] = PASOS;

  ngOnInit(): void {
    this.obtenerUsuarioLogueado();
    this.obtenerEstadoSolicitud();
  }

  /**
   * Indica si el usuario es un agente naviero.
   */
  esNaviero: boolean = true;


  /**
* Mensaje que se muestra cuando el RFC no corresponde a un agente naviero.
*/
  mensajeAgenteNaviero = ERROR_AGENTE_NAVIERO;

  /**
  * Notificación que se puede utilizar para mostrar mensajes emergentes (toastr).
  * Null cuando no hay notificación nueva.
  */
  public nuevaNotificacion: Notificacion | null = null;
  /**
   * Referencia al componente DatosComponent
   */
  @ViewChild(DatosComponent) datosComponent!: DatosComponent;

  /**
   * Mensaje de error a mostrar.
   */
  esValido = true;

  /**
   * Lista de pasos del wizard.
   * @type {ListaPasosWizard[]}
   */
  public pantallasPasos: ListaPasosWizard[] = MODIFICACION_TRANSPORTACION_MARITIMA_PASO;

  /**
   * Índice del paso actual.
   * @type {number}
   * @default 1
   */
  public indice: number = 1;

  /**
   * folio temporal de la solicitud.
   */
  folioTemporal: number = 0;


  /**
   * Referencia al componente Wizard para controlar la navegación entre pasos.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent)
  public wizardComponent!: WizardComponent;

  /**
   * Texto de notificación usado cuando el guardado es exitoso.
   */
  notificacionGuardadoExitoso!: string;


  /**
   * Obtiene el usuario que ha iniciado sesión y valida si es un agente naviero.
   */
  obtenerUsuarioLogueado(): void {
    this.loginQuery.select()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user.rfc) {
          this.validarAgenteNaviero(user.rfc);
        }
      });
  }

  /**
   * valida si el agente naviero existe en CAAT.
   * @param rfcLogueado 
   */
  validarAgenteNaviero(rfcLogueado: string): void {
    this.service.validaAgenteNaviero(rfcLogueado).subscribe(res => {
      this.esNaviero = res.datos || false;
    });
  }

  /**
   * 
   * Una cadena que representa la clase CSS para una alerta de información.
   * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
   */
  public infoAlert = 'alert-info';

  /**
   * Asigna el aviso de privacidad simplificado al atributo `TEXTOS`.
   */
  TEXTOS = AVISO_CONTRNIDO.aviso;

  /**
   * Mensajes de alerta para el formulario.
   */
  ALERTA = ALERTA;

  /**
   * Una cadena que representa la clase CSS para una alerta de error.
   */
  infoError = 'alert-danger';

  /**
   * Datos utilizados para el control del wizard.
   * @type {DatosPasos}
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };


  /**
   * Estado de la solicitud de transportación marítima.
   */
  estadoSolicitud!: TransportacionMaritima40202State;


  /**
   * Obtiene el estado de la solicitud de transportación marítima desde el store.
   */
  obtenerEstadoSolicitud(): void {
    this.query.select()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.estadoSolicitud = res;
      });
  }

  /**
   * Actualiza el índice del paso y maneja la navegación hacia adelante o atrás.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor del paso y la acción a realizar.
   * @returns {void}
   */
  public getValorIndice(e: AccionBoton): void {
    if (this.indice === 1) {
      const CAAT_MARITIMO = this.datosComponent?.caatMaritimoComponent;
      this.esValido = CAAT_MARITIMO?.validarFormulario() ?? false;
      if (!this.esValido) {
        this.datosPasos.indice = this.indice;
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
    if (this.indice === 1) {
      this.ejecutaEnviarSolicitud()
        .pipe(
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
              this.notificacionGuardadoExitoso = MSG_REGISTRO_EXITOSO(
                this.folioTemporal.toString()
              );
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
    const REQUEST = {
      ...this.estadoSolicitud,
      fecha_registro: new Date().toISOString(),
      solicitante: {
        rfc: this.loginQuery.getValue().rfc || '',
      }
    };
    return this.service.guardarSolicitud(REQUEST).pipe(
      map((response) => {
        if (
          response.codigo === CodigoRespuesta.EXITO &&
          response.datos?.id_solicitud
        ) {
          this.store.update({
            idSolicitud: response.datos.id_solicitud,
          });
          this.folioTemporal = response.datos.id_solicitud;
          return { exito: true };
        }

        const MENSAJE =
          response?.error ||
          response?.mensaje ||
          response?.causa ||
          'Ocurrió un error al guardar la solicitud.';

        const ERRORESMODELO = (response?.errores_modelo || []).map(
          (error: any) => {
            return {
              campo: error.campo || 'general',
              errores: Array.isArray(error.errores)
                ? error.errores
                : [String(error.errores)],
            };
          }
        );

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
      })
    );
  }


  /**
  * Ejecuta la lógica para avanzar o retroceder en el wizard después de guardar los datos.
  * @param e Objeto que contiene la acción y el valor del botón.
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
   * Limpia los recursos al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}