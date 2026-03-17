import { CancelacionPeticion261701State, Tramite261701Store } from '../../estados/store/tramite261701.store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite261701Query } from '../../estados/query/tramite261701.query';

/**
 * ManifiestosDeclaracionesComponent es un componente que permite gestionar los manifiestos
 * y declaraciones, mostrando alertas y títulos relacionados con el proceso en el contexto de trámites.
 * 
 * @component
 */
@Component({
  selector: 'manifiestos-declaraciones',
  templateUrl: './manifiestos-declaraciones.component.html',
  styleUrl: './manifiestos-declaraciones.component.scss',
})
export class ManifiestosDeclaracionesComponent implements OnInit, OnDestroy {
  /**
   * Grupo de formularios principal.
   * @property {FormGroup} manifiestosForm
   */
  manifiestosForm!: FormGroup;

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
  public manifiestosCheckboxChecked: boolean = false;

  /**
   * compo doc
   * Estado de la solicitud de la sección 261701.
   * @type {CancelacionPeticion261701State}
   * @memberof ManifiestosDeclaracionesComponent
   */
    public cancelacionPeticionState!: CancelacionPeticion261701State;

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 
      
  /**
 * compo doc
 * @constructor
 * Inicializa una nueva instancia del componente `ManifiestosDeclaracionesComponent`.
 * 
 * @param tramite261701Store Servicio encargado de gestionar el estado dinámico asociado al trámite 261701.
 * @param tramite261701Query Consulta que facilita la obtención de datos específicos del estado del trámite 261701.
 */
  constructor(
    public readonly fb: FormBuilder,
    private tramite261701Store: Tramite261701Store,
    private tramite261701Query: Tramite261701Query,
    private consultaioQuery: ConsultaioQuery, 
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe()
}

  /**
  * compo doc
  * @method ngOnInit
  * @description 
  * El gancho ngOnInit se llama para inicializar el formulario
  * @memberof ManifiestosDeclaracionesComponent
  * @returns {void}
  */
  ngOnInit(): void {
    this.tramite261701Query.select$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.cancelacionPeticionState = seccionState;
        })
      )
      .subscribe();

    this.manifiestosForm = this.fb.group({
      manifiestos: [this.cancelacionPeticionState?.['manifiestos'], Validators.required],
    });
  }

  /**
   * compo doc
   * Este método se ejecuta cuando el usuario hace clic en el checkbox "manifiestos".
   */
  alHacerClicEnCheckbox(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite261701Store.establecerDatos('manifiestos', VALOR);
  }

  /**
   * @method ngOnDestroy
   * @description
   * Este método se ejecuta cuando el componente se destruye.
   * - Notifica la destrucción del componente a través del Subject `destroyNotifier$`.
   * 
   * @memberof ManifiestosDeclaracionesComponent
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}