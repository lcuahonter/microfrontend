import { Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ID_PROCEDIMIENTO } from '../../../constants/importacion-materias-primas.enum';
import { PagoDeDerechosComponent } from '../../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../../shared/models/terceros-relacionados.model';
import { Tramite260202Query } from '../../../estados/tramite260202Query.query';
import { Tramite260202Store } from '../../../estados/tramite260202Store.store';

/**
 * @component PagoDeDerechosContenedoraComponent
 * @description Componente contenedor que utiliza el componente `PagoDeDerechosComponent`
 * para gestionar la funcionalidad relacionada con el pago de derechos.
 * Este componente interactúa con el estado del trámite a través del store `Tramite260202Store`.
 */
@Component({
  selector: 'app-pago-de-derechos-contenedora',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-de-derechos-contenedora.component.html',
  styleUrl: './pago-de-derechos-contenedora.component.scss',
})

/**
 * @class PagoDeDerechosContenedoraComponent
 * @description
 * Componente encargado de gestionar el formulario de pago de derechos dentro del trámite 260202.
 * Este componente interactúa con el store `Tramite260202Store` para obtener y actualizar el estado
 * del formulario de pago de derechos. Además, permite habilitar o deshabilitar el formulario según
 * las necesidades del usuario.
 *
 * @property {boolean} formularioDeshabilitado
 * Indica si el formulario está deshabilitado. Por defecto, su valor es `false`.
 *
 * @property {PagoDerechosFormState} pagoDerechos
 * Representa el estado actual del formulario de pago de derechos, obtenido del store del trámite.
 *
 * @property {string} idProcedimiento
 * Identificador único del procedimiento asociado al trámite 260202.
 *
 * @constructor
 * Inicializa el componente y establece el estado inicial del formulario de pago de derechos
 * utilizando el store `Tramite260202Store`.
 *
 * @method updatePagoDerechos
 * Actualiza el estado del formulario de pago de derechos en el store del trámite.
 * Este método recibe como parámetro el estado actualizado del formulario y lo almacena en el store.
 */
export class PagoDeDerechosContenedoraComponent implements OnInit, OnDestroy {
  /**
* @property {boolean} formularioDeshabilitado
* @description
* Indica si el formulario está deshabilitado. Por defecto es `false`.
*/
  @Input()
  formularioDeshabilitado: boolean = false;
  /** Indica si el formulario debe mostrarse en modo solo lectura.  
*  Controla la habilitación o deshabilitación de los campos. */
  public esFormularioSoloLectura: boolean = false;
  /**
    * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
    */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * @property {PagoDerechosFormState} pagoDerechos
   * @description Estado actual del formulario de pago de derechos, obtenido del store del trámite.
   */
  public pagoDerechos!: PagoDerechosFormState;
  /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260202Store` para gestionar el estado del trámite.
   * Inicializa la propiedad `pagoDerechos` con el valor actual del store.
   *
   * @param tramiteStore - Store que administra el estado del trámite 260202.
   */

  /**
   * @property {string} idProcedimiento
   * @description
   * Identificador del procedimiento.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  @ViewChild('pagoDeDerechosComponent') pagoDeDerechosComponent!: PagoDeDerechosComponent;

  /**
   * Constructor de la clase `PagoDeDerechosContenedoraComponent`.
   * 
   * Este constructor inicializa el componente y establece el valor de `pagoDerechos`
   * utilizando el estado actual de la tienda `Tramite260202Store`.
   * 
   * @param tramiteStore - Una instancia de la tienda `Tramite260202Store` que contiene
   *                       los datos y el estado relacionados con el trámite 260202.
   */
  constructor(public tramiteStore: Tramite260202Store, private consultaQuery: ConsultaioQuery, private tramiteQuery: Tramite260202Query) {
    //this.pagoDerechos = this.tramiteStore.getValue().pagoDerechos;
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }
  ngOnInit(): void {
    this.tramiteQuery.selectTramiteState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.pagoDerechos = data.pagoDerechos;
      });
  }
  /**
   * @method updatePagoDerechos
   * @description Actualiza los datos del formulario de pago de derechos en el store del trámite.
   *
   * @param {PagoDerechosFormState} event - Estado actualizado del formulario de pago de derechos.
   * @returns {void} Este método no retorna ningún valor.
   */
  updatePagoDerechos(event: PagoDerechosFormState): void {
    this.tramiteStore.updatePagoDerechos(event);
  }

  validarFormulario(): boolean {
    return (
      this.pagoDeDerechosComponent?.formularioSolicitudValidacion() ?? false
    );
  }
  /**
 * Método que se ejecuta cuando el componente es destruido.
 * 
 * Libera los recursos y completa la notificación de destrucción del componente.
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
