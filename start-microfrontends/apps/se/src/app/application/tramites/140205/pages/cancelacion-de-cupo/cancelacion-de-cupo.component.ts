import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subject, catchError, map, switchMap, take, takeUntil, throwError } from 'rxjs';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { DatosPasos } from '@libs/shared/data-access-user/src';
import { GuardarMappingAdapter } from '../../adapters/guardar-mapping.adapter';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';
import { OCTA_TEMPO } from '@libs/shared/data-access-user/src/core/services/130102/octava-temporal.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ServiciosService } from '../../../../shared/services/servicios.service';
import { Solicitud140205Query } from '../../estados/query/solicitud140205.query';
import { Solicitud140205Service } from '../../services/service140205.service';
import { Solicitud140205Store } from '../../estados/store/solicitud140205.store';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-cancelacion-de-cupo',
  templateUrl: './cancelacion-de-cupo.component.html',
  styleUrls: ['./cancelacion-de-cupo.component.css'],
})
export class CancelacionDeCupoComponent implements OnDestroy {
  /**
   * ID del trámite actual.
   * @type {number}
   * @memberof CancelacionDeCupoComponent
   */
  tramiteId: number = 140205;

  /**
   * Referencia al componente del primer paso del wizard.
   * @type {PasoUnoComponent | undefined}
   * @memberof CancelacionDeCupoComponent
   */
  @ViewChild('pasoUnoComponent', { static: false }) pasoUnoComponent:
    | PasoUnoComponent
    | undefined;

  /**
   * Referencia al componente del wizard.
   * @type {WizardComponent}
   * @memberof CancelacionDeCupoComponent
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
   * @type {number | null}
   * @memberof CancelacionDeCupoComponent
   */
  idSolicitudState: number | null = 0;

  /**
   * Array para almacenar los pasos del wizard.
   * @type {ListaPasosWizard[]}
   * @memberof CancelacionDeCupoComponent
   */
  pantallasPasos: ListaPasosWizard[] = OCTA_TEMPO;

  /**
   * El índice actual del paso.
   * @type {number}
   * @memberof CancelacionDeCupoComponent
   */
  indice: number = 1;

  /**
   * Mensaje de error para mostrar en el formulario.
   * @type {string}
   * @memberof CancelacionDeCupoComponent
   */
  public formErrorAlert!: string;

  /**
   * Indica si el formulario es válido.
   * @type {boolean}
   * @memberof CancelacionDeCupoComponent
   */
  public esFormaValido: boolean = true;

  /**
   * Clase CSS para mostrar una alerta de error.
   * @type {string}
   * @memberof CancelacionDeCupoComponent
   */
  infoError = 'alert-danger';

  /**
   * Notificador para destruir las suscripciones.
   * @type {Subject<void>}
   * @memberof CancelacionDeCupoComponent
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Datos de los pasos del wizard.
   * @type {DatosPasos}
   * @memberof CancelacionDeCupoComponent
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Constructor del componente.
   * @param toastrService Servicio para mostrar notificaciones.
   * @param solicitud140205Service Servicio para operaciones de la solicitud.
   * @param solicitud140205Store Store para el estado de la solicitud.
   * @param solicitud140205Query Query para seleccionar datos de la solicitud.
   */
  constructor(
    private toastrService: ToastrService,
    private solicitud140205Service: Solicitud140205Service,
    private solicitud140205Store: Solicitud140205Store,
    private solicitud140205Query: Solicitud140205Query
  ) {}

  /**
   * Maneja el cambio de paso en el wizard según la acción del botón.
   * Valida el formulario del primer paso y guarda la información si es válido.
   * @param e Acción del botón (cont/atras) y valor del índice.
   */
  getValorIndice(e: AccionBoton): void {
    if (this.indice === 1) {
      const FORM_VALIDO = this.pasoUnoComponent?.validarFormularios() || false;
      const FORMFIELDVALIDO = this.pasoUnoComponent?.formFieldValidado;

      if (!FORM_VALIDO) {
        this.datosPasos.indice = 1;
        this.formErrorAlert = `<div class="text-center">Se debe seleccionar 1 cupo para poder Consultar.</div>`;
        this.esFormaValido = false;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }

      if (FORM_VALIDO && !FORMFIELDVALIDO) {
        const ERROR_SERVICIO_ALERT = `Se debe seleccionar 1 cupo para poder Consultar.`;
        this.formErrorAlert =
          ServiciosService.generarAlertaDeError(ERROR_SERVICIO_ALERT);
        this.datosPasos.indice = 1;
        this.esFormaValido = false;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }

      this.onGuardar()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: (respuesta: BaseResponse<{ id_solicitud: number }>) => {
            if (respuesta.codigo !== '00') {
              this.formErrorAlert =
                respuesta.error || 'Error desconocido en la solicitud';
              this.esFormaValido = false;
              this.indice = 1;
              this.datosPasos.indice = 1;
              this.wizardComponent.indiceActual = 1;
              setTimeout(
                () => window.scrollTo({ top: 0, behavior: 'smooth' }),
                0
              );
              return;
            }
            this.esFormaValido = true;
            this.indice = e.valor;
            this.datosPasos.indice = this.indice;
            this.wizardComponent.siguiente();
            if (respuesta.datos?.id_solicitud) {
              this.idSolicitudState = respuesta.datos.id_solicitud;
              this.solicitud140205Store.setIdSolicitud(
                respuesta.datos.id_solicitud
              );
            }
            this.toastrService.success(respuesta.mensaje);
          },
          error: () => {
            this.indice = 1;
            this.datosPasos.indice = this.indice;
            this.wizardComponent.indiceActual = 1;
          },
        });
    } else {
      if (e.valor > 0 && e.valor < 5) {
        this.indice = e.valor;
        if (e.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
        }
      }
    }
  }

  /**
   * Guarda los datos del formulario actual llamando al servicio correspondiente.
   * @returns Observable con la respuesta del servicio, incluyendo el id de la solicitud.
   */
  onGuardar(): Observable<BaseResponse<{ id_solicitud: number }>> {
    return this.solicitud140205Query.selectSolicitud$.pipe(
      take(1), // Tomar solo el primer valor para evitar loops
      map((ESTADO_ACTUAL) =>
        GuardarMappingAdapter.toFormPayload(ESTADO_ACTUAL)
      ),
      switchMap((FORM_PAYLOAD) => {
        return (
          this.solicitud140205Service.postGuardarDatos(
            this.tramiteId.toString(),
            FORM_PAYLOAD
          ) as Observable<BaseResponse<{ id_solicitud?: number }>>
        ).pipe(
          map((response: BaseResponse<{ id_solicitud?: number }>) => {
            return {
              ...response,
              datos: {
                id_solicitud: response.datos?.id_solicitud ?? 0,
              },
            };
          })
        );
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
