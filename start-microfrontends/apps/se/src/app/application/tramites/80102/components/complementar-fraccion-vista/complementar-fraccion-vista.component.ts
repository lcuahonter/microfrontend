import { COMPLEMENTAR_FRACCION_CATALOGO_DATOS, COMPLEMENTAR_FRACCION_DATOS } from '../../constantes/autorizacion-programa-nuevo.enum';
import {
  Catalogo,
  ComplimentarFraccion,
  ComplimentarFraccionResoponse,
} from '../../../../shared/models/nuevo-programa-industrial.model';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComplementarFraccionComponent } from '../../../../shared/components/complementar-fraccion/complementar-fraccion.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite80102Query } from '../../estados/tramite80102.query';

@Component({
  selector: 'app-complementar-fraccion-vista',
  standalone: true,
  imports: [CommonModule, ComplementarFraccionComponent],
  templateUrl: './complementar-fraccion-vista.component.html',
  styleUrl: './complementar-fraccion-vista.component.scss',
})
/**
 * @component
 * @name ComplementarFraccionVistaComponent
 * @description Componente encargado de gestionar la vista de la fracción complementaria.
 * Este componente permite visualizar y complementar los datos de la fracción en el trámite 80102.
 * 
 * @usageNotes
 * Este componente utiliza servicios de consulta (`Tramite80102Query`) para manejar y observar los datos 
 * relacionados con la fracción complementaria. Además, implementa el ciclo de vida de Angular para limpiar 
 * las suscripciones al destruirse.
 */
export class ComplementarFraccionVistaComponent implements OnInit, OnDestroy {
  /**
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   *
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$: Subject<void> = new Subject();

  
  /**
   * Datos de la fracción complementaria.
   * @type {ComplimentarFraccionResoponse}
   */

  public complimentarDatos!: ComplimentarFraccionResoponse;

  /**
   * Datos del catálogo de categorías seleccionadas.
   * @type {Catalogo[]}
   */
  public catagoriaSeleccionDatos: Catalogo[] = COMPLEMENTAR_FRACCION_CATALOGO_DATOS;

   /**
   * Datos para complementar la fracción.
   * @type {ComplimentarFraccion}
   */
  public complimentarFraccionDatos: ComplimentarFraccion = COMPLEMENTAR_FRACCION_DATOS;

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false; 

/**
 * Evento que se emite para cerrar el popup.
 */
  @Output() cerrarPopup = new EventEmitter<void>();

/**
 * Evento que se emite al guardar la información de complementación de fracción.
 * 
 * @event guardarComplementarFraccion
 */
  @Output() guardarComplementarFraccion = new EventEmitter<ComplimentarFraccionResoponse>();

/**
 * Descripción que se muestra en el componente.
 * 
 * @input descripcion
 */
  @Input() descripcion!: string;

  /**
   * Constructor de la clase ComplementarFraccionVistaComponent.
   * @param {Tramite80102Query} query - Servicio para consultar el estado del trámite.
   */
  constructor(private query: Tramite80102Query, private consultaQuery: ConsultaioQuery) {
    this.consultaQuery.selectConsultaioState$
     .pipe(
       takeUntil(this.destroyNotifier$),
       map((seccionState)=>{
         this.esFormularioSoloLectura = seccionState.readonly; 
       })
     )
     .subscribe()
    }

    /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe a los datos de navegación y actualiza la descripción de la fracción complementaria.
   * @returns {void}
   */
  ngOnInit(): void {
    this.query.selectDatosParaNavegar$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datosParaNavegar) => {
        this.complimentarFraccionDatos.descripcion =
          datosParaNavegar.encabezadoDescripcionComercial;
      });
  }

  
  /**
   * Obtiene los datos del evento emitido por el componente de complementar fracción.
   * @param {ComplimentarFraccionResoponse} event - Datos de la fracción complementaria.
   * @returns {void}
   */
  getDatos(event: ComplimentarFraccionResoponse): void {
    this.guardarComplementarFraccion.emit({
    ...event,
    descripcion: this.descripcion
  });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones y actualiza los BehaviorSubject para ocultar las tablas.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
