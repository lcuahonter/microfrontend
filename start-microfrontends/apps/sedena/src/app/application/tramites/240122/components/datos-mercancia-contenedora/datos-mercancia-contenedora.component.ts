import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { Tramite240122Store } from '../../estados/tramite240122Store.store';

/**
 * @title Datos de la Mercancía Contenedora
 * @description Componente contenedor encargado de recibir los datos de mercancía y actualizar el estado global del trámite.
 * @summary Actúa como puente entre el componente de datos de mercancía y el store de Akita.
 */
/**
 * Componente que representa los datos de mercancía contenedora.
 * 
 * Este componente es parte del trámite 240122 y se encarga de gestionar
 * y actualizar los datos de mercancías en el store correspondiente.
 * 
 * @selector app-datos-mercancia-contenedora
 * @standalone true
 * @imports CommonModule, DatosMercanciaComponent
 * @templateUrl ./datos-mercancia-contenedora.component.html
 * @styleUrl ./datos-mercancia-contenedora.component.scss
 */
@Component({
  selector: 'app-datos-mercancia-contenedora',
  standalone: true,
  imports: [CommonModule, DatosMercanciaComponent],
  templateUrl: './datos-mercancia-contenedora.component.html',
  styleUrl: './datos-mercancia-contenedora.component.scss',
})
export class DatosMercanciaContenedoraComponent implements OnInit, OnDestroy {
  /**
    * @event cerrar
    * @description Evento emitido para indicar que se debe cerrar el componente.
    * @remarks
    * Este evento no envía ningún valor, simplemente notifica a los componentes padres que se debe realizar la acción de cierre.
    * 
    * @eventType void
    * @es
    * Evento que se dispara para cerrar el componente actual.
    */
  @Output() cerrar = new EventEmitter<void>();
  /**
   * Identificador único del procedimiento asociado al trámite.
   * 
   * @property {number} idProcedimiento
   * @remarks Este valor se utiliza para identificar el trámite específico.
   */
  idProcedimiento = NUMERO_TRAMITE.TRAMITE_240122;
  /**
   * Observable para limpiar suscripciones activas al destruir el componente.
   * 
   * @property {Subject<void>} unsubscribe$
   */
  private unsubscribe$ = new Subject<void>();

  /**
* Indica si el formulario debe mostrarse solo en modo de lectura.
*
* @remarks
* Cuando esta propiedad es `true`, el formulario no permite la edición de sus campos.
*
* @compodoc
* @description
* Determina si el formulario se presenta únicamente para consulta, deshabilitando la edición de los datos.
*/
  esFormularioSoloLectura: boolean = false;


  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240122Store} tramiteStore - Store de Akita para actualizar el estado de la tabla de mercancías.
   * @returns {void}
   */
  // eslint-disable-next-line no-empty-function
  constructor(private tramiteStore: Tramite240122Store, private readonly consultaioQuery: ConsultaioQuery, private readonly cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.cdr.detectChanges();
        })
      )
      .subscribe();

  }

  /**
   * Actualiza los datos de la tabla de mercancía en el store.
   *
   * @method updateMercanciaDetalle
   * @param {MercanciaDetalle[]} event - Lista de mercancías actualizada desde el formulario.
   * @returns {void}
   */
  updateMercanciaDetalle(event: MercanciaDetalle[]): void {
    this.tramiteStore.updateMercanciaTablaDatos(event);
     this.cerrar.emit();
  }

  /**
   * @inheritdoc
   * @description
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   * Se utiliza para limpiar recursos, como la cancelación de suscripciones a observables, evitando así posibles fugas de memoria.
   *
   * @see https://angular.io/guide/lifecycle-hooks#ondestroy
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
