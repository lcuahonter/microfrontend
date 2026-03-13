import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {
  DOCUMENTO_CATALOGO_DATOS,
  PROYECTO_DATOS,
} from '../../constantes/autorizacion-programa-nuevo.enum';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Catalogo } from '../../../../shared/models/nuevo-programa-industrial.model';
import { CommonModule } from '@angular/common';
import { PROYECTO_IMMEX_CONFIG } from '../../../../shared/constantes/anexo-dos-y-tres.enum';
import { PoryectoDatos } from '../../../../shared/models/nuevo-programa-industrial.model';
import { ProyectoImmexComponent } from '../../../../shared/components/proyecto-immex/proyecto-immex.component';
import { ProyectoImmexEncabezado } from '../../../../shared/models/nuevo-programa-industrial.model';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Tramite80102Query } from '../../estados/tramite80102.query';
import { Tramite80102Store } from '../../estados/tramite80102.store';

@Component({
  selector: 'app-proyecto-immex-vista',
  standalone: true,
  imports: [CommonModule, ProyectoImmexComponent],
  templateUrl: './proyecto-immex-vista.component.html',
  styleUrl: './proyecto-immex-vista.component.scss',
})

/**
 * Componente para la vista del proyecto IMMEX.
 * Este componente permite visualizar y manejar los datos del proyecto IMMEX en el trámite 80102.
 *
 * @export ProyectoImmexVistaComponent
 */
export class ProyectoImmexVistaComponent implements OnInit, OnDestroy {
  /**
   * Datos del proyecto IMMEX.
   * @type {PoryectoDatos}
   */
  public proyectoImmexDatos: PoryectoDatos = PROYECTO_DATOS;

  

  /**
   * Configuración del proyecto IMMEX.
   * @type {Object}
   * @property {TablaSeleccion} proyectoImmexSeleccionCheckBox - Selección de tabla del proyecto IMMEX.
   * @property {any} proyectoImmexTabla - Configuración de la tabla del proyecto IMMEX.
   */
  public proyectoImmexConfiguartion = {
    proyectoImmexSeleccionCheckBox: TablaSeleccion.CHECKBOX,
    proyectoImmexTabla: PROYECTO_IMMEX_CONFIG,
  };

  /**
   * Lista de encabezados del proyecto IMMEX.
   * @type {ProyectoImmexEncabezado[]}
   */
  public proyectoImmexTablaLista$!: Observable<ProyectoImmexEncabezado[]>;
public proyectoImmexTablaLista: ProyectoImmexEncabezado[] = [];
  /**
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   *
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$: Subject<void> = new Subject();

/**
 * Evento que se emite para cerrar el popup.
 */
  @Output() cerrarPopup = new EventEmitter<void>();

  /**
   * Constructor de la clase ProyectoImmexVistaComponent.
   * @param {Tramite80102Query} query - Servicio para consultar el estado del trámite.
   */
  constructor(private query: Tramite80102Query,private tramite80102Store: Tramite80102Store) {
    //El constructor requiere inyección de dependencias, pero se ha mantenido vacío debido a una regla de ESLint.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe a los datos de navegación y actualiza la descripción del proyecto IMMEX.
   * @returns {void}
   */
  ngOnInit(): void {
        this.proyectoImmexTablaLista$ = this.query.selectProyectoImmexTablaLista$;

    this.query.selectDatosParaNavegar$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datosParaNavegar) => {
        this.proyectoImmexDatos=
        {...this.proyectoImmexDatos,
          descripcion: datosParaNavegar.encabezadoDescripcionComercial,
          fraccionArancelaria: datosParaNavegar.encabezadoFraccion
        }
      });
  }

  /**
   * Obtiene la devolución de llamada de la tabla del proyecto IMMEX.
   * @param {ProyectoImmexEncabezado[]} event - Evento que contiene la lista de encabezados del proyecto IMMEX.
   * @returns {void}
   */
  obtenerProyectoTablaDevolverLaLlamada(
    event: ProyectoImmexEncabezado[]
  ): void {
    this.proyectoImmexTablaLista = event;

     this.tramite80102Store.setProyectoImmexTablaLista(this.proyectoImmexTablaLista);
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
