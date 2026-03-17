import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CancelarSolicitudComponent } from '../../components/cancelar-solicitud/cancelar-solicitud.component';
import { CancelarSolicitudService } from '../../service/cancelar-solicitud.service';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,
})
export class PasoUnoComponent implements OnDestroy {
  /**
   * Componente PasoUnoComponent
   *
   * Este componente representa el primer paso del trámite 570101.
   * Gestiona la visualización y validación del formulario de cancelación de solicitud,
   * así como la navegación entre pestañas y la carga de datos desde el servicio correspondiente.
   *
   * @example
   * <app-paso-uno (pestanaCambiado)="onTabChange($event)" (isValid)="onFormValid($event)"></app-paso-uno>
   */
  indice: number = 1;

  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Evento emitido cuando se cambia la pestaña activa.
   * Emite el índice de la pestaña seleccionada.
   */
  @Output() pestanaCambiado = new EventEmitter<number>();

  /**
   * Evento emitido cuando el formulario es válido o inválido.
   * Emite un booleano indicando el estado de validez.
   */
  @Output() isValid = new EventEmitter<boolean>();
  /**
   * Referencia al componente CancelarSolicitudComponent hijo.
   * Permite acceder a sus propiedades y métodos, como el formulario interno.
   */
  @ViewChild(CancelarSolicitudComponent)
  cancelarSolicitudComponent!: CancelarSolicitudComponent;

  /**
   * Constructor del componente PasoUnoComponent.
   * 
   * Inicializa los servicios necesarios y suscribe al estado de consulta.
   * Si el estado indica que hay una actualización, carga los datos del formulario.
   * 
   * @param consultaQuery Servicio para consultar el estado de la solicitud.
   * @param CancelarSolicitudService Servicio para gestionar la cancelación de la solicitud.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private CancelarSolicitudService: CancelarSolicitudService
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * @method seleccionaTab
   * @description
   * Cambia la pestaña activa y emite el nuevo índice seleccionado.
   * @param {number} i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method isFormValid
   * @description
   * Verifica si el formulario dentro del componente `CancelarSolicitudComponent` es válido.
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
   */
  isFormValid(): boolean {
    return this.cancelarSolicitudComponent?.formCancelorSolicitud.valid;
  }
  /**
   * Marca todos los controles del formulario como tocados.
   * Esto es útil para mostrar mensajes de error de validación.
   */
  markFormAsTouched(): void {
    if (this.cancelarSolicitudComponent?.formCancelorSolicitud) {
      this.cancelarSolicitudComponent.formCancelorSolicitud.markAllAsTouched();
    }
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.CancelarSolicitudService.getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.CancelarSolicitudService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Obtiene el folio de la solicitud de cancelación.
   * @returns El folio de la solicitud.
   */
  getFolio(): string {
    return this.cancelarSolicitudComponent?.formCancelorSolicitud?.getRawValue()?.folioSVEX || '';
  }
  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Libera los recursos y completa el Subject para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
