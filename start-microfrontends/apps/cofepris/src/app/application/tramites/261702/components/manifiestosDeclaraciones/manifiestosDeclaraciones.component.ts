import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { RetirosCofepris261702State, Tramite261702Store } from '../../../../estados/tramites/tramite261702.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { MANIFIESTOS_ALERT } from '../../constantes/retiros-cofepris.enum';
import { Tramite261702Query } from '../../../../estados/queries/tramite261702.query';
/**
 * ManifiestosDeclaracionesComponent es un componente que permite gestionar los manifiestos
 * y declaraciones, mostrando alertas y títulos relacionados con el proceso en el contexto de trámites.
 * 
 * @component
 */
@Component({
  selector: 'manifiestos-declaraciones',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    AlertComponent,
  ],
  templateUrl: './manifiestosDeclaraciones.component.html',
  styleUrl: './manifiestosDeclaraciones.component.scss',
})
export class ManifiestosDeclaracionesComponent implements OnInit, AfterViewInit, OnDestroy{
/** compo doc
 * Constantes importadas desde el archivo de enumeración que contienen textos importantes y de advertencia.
 *
 * @type {string}
 * @memberof ManifiestosDeclaracionesComponent
 */
  public manifiestosAlert: string = MANIFIESTOS_ALERT.message;
  
/**
    * @property consultaState
    * @description
    * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
    */
    @Input() consultaState!: ConsultaioState;

  /**
   * compo doc
   * Subject para notificar la destrucción del componente.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * compo doc
   * Indica si el checkbox "manifiestos" está marcado o no.
   * Esta variable se utiliza para rastrear dinámicamente el estado del checkbox
   * y puede actualizarse en función de la interacción del usuario.
   * 
   * @type {boolean}
   * @memberof ManifiestosDeclaracionesComponent
   */
  private manifiestosCheckboxChecked: boolean = false;

  /**
   * compo doc
   * Estado de la solicitud de la sección 261702.
   * @type {RetirosCofepris261702State}
   * @memberof ManifiestosDeclaracionesComponent
   */
    public retirosCofeprisState!: RetirosCofepris261702State;

      
  /**
 * compo doc
 * @constructor
 * Inicializa una nueva instancia del componente `ManifiestosDeclaracionesComponent`.
 * 
 * @param tramite261702Store Servicio encargado de gestionar el estado dinámico asociado al trámite 261702.
 * @param tramite261702Query Consulta que facilita la obtención de datos específicos del estado del trámite 261702.
 */
  constructor(
    private tramite261702Store: Tramite261702Store,
    private tramite261702Query: Tramite261702Query
  // eslint-disable-next-line no-empty-function
  ) {}

  /**
  * compo doc
  * @method ngOnInit
  * @description 
  * /**
    El gancho ngOnInit se llama para inicializar el formulario
  * @memberof ManifiestosDeclaracionesComponent
  * @returns {void}
  */
  
  ngOnInit(): void {
    this.tramite261702Query.selectRetiros$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.retirosCofeprisState = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * compo doc
   * @method establecerValor
   * @description
   * Este método se utiliza para establecer el estado del checkbox "manifiestos"
   * basado en el valor almacenado en el estado `retirosCofeprisState`.
   * 
   * @returns {void}
   * @memberof ManifiestosDeclaracionesComponent
   */
  establecerValor(): void {
    const CHECKBOX_ELEMENT = document.getElementById('manifiestos');
    if (CHECKBOX_ELEMENT) {
      (CHECKBOX_ELEMENT as HTMLInputElement).checked = this.retirosCofeprisState['manifiestos'];
    }
  }

  /**
   * compo doc
   * @method ngAfterViewInit
   * @description
   * Este gancho se ejecuta después de que la vista del componente ha sido inicializada.
   * En este método se agrega un evento de escucha al checkbox "manifiestos" para 
   * actualizar dinámicamente su estado y almacenar el valor correspondiente en 
   * el store del trámite 261702. Además, se establece el valor inicial del checkbox 
   * según el estado actual.
   * 
   * @memberof ManifiestosDeclaracionesComponent
   * @returns {void}
   */
  ngAfterViewInit(): void {
    const CHECKBOX_ELEMENT = document.getElementById('manifiestos');
    if (CHECKBOX_ELEMENT) {
      CHECKBOX_ELEMENT.addEventListener('click', () => {
        this.manifiestosCheckboxChecked = (CHECKBOX_ELEMENT as HTMLInputElement).checked;
        this.tramite261702Store.setDynamicFieldValue('manifiestos', this.manifiestosCheckboxChecked);
      });
    }
    this.establecerValor();
  }

  /**
   * @method ngOnDestroy
   * @description Método `ngOnDestroy()`.
   * Este método se ejecuta cuando el componente se destruye y realiza las siguientes acciones:
   * - Desuscribe la suscripción a los cambios en el formulario reactivo.
   * @memberof ManifiestosDeclaracionesComponent
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
