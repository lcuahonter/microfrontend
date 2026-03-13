import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InformationGeneralSolicitanteState, Tramite32515Store } from '../../estados/tramite32515.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DATOS_DEL_SOLICITANTE } from '../../constantes/modificacion-aviso-seguro-global.enum';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { Tramite32515Query } from '../../estados/tramite32515.query';
@Component({
  selector: 'app-datos-del-solicitante',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormasDinamicasComponent,
  ],
  templateUrl: './datos-del-solicitante.component.html',
  styleUrls: ['./datos-del-solicitante.component.scss'],
})
/**
 * Componente encargado de gestionar los datos del solicitante en el formulario dinámico.
 * 
 * Este componente incluye la lógica para manejar el estado del formulario, 
 * suscripciones al store, y la interacción con los datos del solicitante.
 * 
 * @remarks
 * - Utiliza un `FormGroup` para estructurar los datos del formulario.
 * - Se suscribe al estado del store para obtener y actualizar los datos del solicitante.
 * - Implementa los ciclos de vida `OnInit` y `OnDestroy` para gestionar suscripciones y liberar recursos.
 * 
 * @example
 * ```typescript
 * <app-datos-del-solicitante></app-datos-del-solicitante>
 * ```
 * 
 * @class
 * @implements OnInit
 * @implements OnDestroy
 */
export class DatosDelSolicitanteComponent implements OnInit, OnDestroy {


  /**
   * @public
   * @property {any} datosDelSolicitanteolFormData - Contiene los datos del solicitante.
   * 
   * @description
   * Esta propiedad almacena la información relacionada con los datos del solicitante.
   * Es utilizada para manejar el formulario correspondiente en el componente.
   * 
   * @comando
   * Asegúrese de que `DATOS_DEL_SOLICITANTE` esté correctamente definido y actualizado
   * para reflejar los datos requeridos en el formulario.
   */
  public datosDelSolicitanteolFormData = DATOS_DEL_SOLICITANTE;

  /**
   * @property informationGeneralState
   * @description Estado general de la información del solicitante.
   * @type {InformationGeneralSolicitanteState}
   * @remarks Este estado contiene los datos generales relacionados con el solicitante.
   */
  public informationGeneralState!: InformationGeneralSolicitanteState;

  /**
   * @private
   * Sujeto utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   * Este observable se completa cuando el componente se destruye.
   * 
   * @command Utilice `this.destroy$.next(); this.destroy$.complete();` en el método `ngOnDestroy` para liberar recursos.
   */
  private destroy$ = new Subject<void>();
    /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  esFormularioSoloLectura: boolean = false;
  /**
   * Representa el grupo de formulario principal para el componente.
   * 
   * @property {FormGroup} forma - El grupo de formulario raíz que contiene controles y grupos de formulario anidados.
   * @property {FormGroup} forma.ninoFormGroup - Un grupo de formulario anidado inicializado como vacío, destinado a gestionar controles de formulario relacionados con el niño.
   */
  public forma: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({})
  });

  /**
   * Constructor del componente
   * @param tramiteStore32515 Inyección del store para manejar el estado
   * @param tramiteQuery32515 Inyección del query para obtener datos del estado
   * @param consultaQuery Inyección del query para consultas adicionales
   */
  constructor(
    public tramiteStore32515: Tramite32515Store,
    private tramiteQuery32515: Tramite32515Query,
    public consultaQuery: ConsultaioQuery
  ) {}

  /**
   * Getter para acceder al FormGroup de los datos del niño
   * @returns FormGroup correspondiente a 'ninoFormGroup'
   */
  get ninoFormGroup(): FormGroup {
    return this.forma.get('ninoFormGroup') as FormGroup;
  }

  /**
   * Método que maneja el cambio de valor de un campo del formulario
   * @param event Objeto con el nombre del campo y el nuevo valor
   */
  establecerCambioDeValor(event: { campo: string; valor: string }): void {
    if (event) {
      this.cambioEnValoresStore(event.campo, event.valor);
    }
  }

  /**
   * Método que actualiza el estado en el store con los valores del formulario
   * @param campo Nombre del campo modificado
   * @param value Nuevo valor del campo
   */
  public cambioEnValoresStore(campo: string, value: unknown): void {
    this.tramiteStore32515.establecerDatos(campo, value);
  }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * @remarks
   * Este método suscribe al observable `select$` del servicio `tramiteQuery32515` 
   * y mapea el estado de la sección a la propiedad `informationGeneralState` 
   * utilizando el operador `map`. La suscripción se gestiona con `takeUntil` 
   * para evitar fugas de memoria al destruir el componente.
   * 
   * @comando
   * Se utiliza para inicializar el estado general del solicitante en el componente.
   */
  ngOnInit(): void {
    this.tramiteQuery32515.select$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.informationGeneralState = seccionState as InformationGeneralSolicitanteState;
        })
      )
      .subscribe();
       this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {          
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }


  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Emite un valor en el observable `destroy$` y lo completa para liberar recursos y evitar fugas de memoria.
   * 
   * @command Este método debe ser implementado para manejar la limpieza de recursos en el componente.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
