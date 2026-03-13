import { AlertComponent, ConfiguracionColumna, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { DESTINO_SERVICIO, DestinoInfo, ExportadorInfo } from '../../constantes/acuicola.enum';
import { AcuicolaService } from '../../service/acuicola.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { EXPORTADOR_SERVICIO } from '../../constantes/acuicola.enum';
import { INSTRUCCION_OBLIGATORIA } from '../../constantes/acuicola.enum';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntil } from 'rxjs';


@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    TablaDinamicaComponent
  ],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss'
})
export class TercerosRelacionadosComponent implements OnInit, OnDestroy {

 /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;

 /**
  * Indica si el campo debe ser deshabilitado.
  * @property {boolean} campoDeshabilitar
  */
  campoDeshabilitar: boolean = false;

  /**
    * Subject para notificar la destrucción del componente.
    * @type {Subject<void>}
    */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
    * Instrucción que se muestra al usuario para indicar que debe hacer doble clic en un elemento
    * de la tabla para seleccionarlo.
    */
  instruccionDobleClic: string = INSTRUCCION_OBLIGATORIA;

  /**
   * Configuración para la selección de elementos en la tabla mediante checkboxes.
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas de la tabla para los datos de exportadores.
   */
  exportadorTabla: ConfiguracionColumna<ExportadorInfo>[] = EXPORTADOR_SERVICIO;

  /**
   * Datos que se muestran en la tabla de exportadores.
   */
  exportadorTableDatos: ExportadorInfo[] = [];

  /**
   * Configuración de las columnas de la tabla para los datos de destinos.
   */
  destinoTabla: ConfiguracionColumna<DestinoInfo>[] = DESTINO_SERVICIO;

  /**
   * Datos que se muestran en la tabla de destinos.
   */
  destinoTableDatos: DestinoInfo[] = [];

  /**
   * Constructor del componente.
   * @constructor
   * @param {AcuicolaService} acuicolaService - Servicio para obtener datos relacionados con la acuicultura.
   * @param {ConsultaioQuery} consultaioQuery - Consulta de estado para obtener y observar los datos de la consulta actual.
   */
  constructor(
    private readonly acuicolaService: AcuicolaService,
    private consultaioQuery: ConsultaioQuery
  ) {
      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      ).subscribe();
  }

  /**
 * Método que se ejecuta al inicializar el componente.
 * Aquí se configuran las suscripciones a los estados y se inicializa el formulario.
 * @method ngOnInit
 * @returns {void}
 */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.getExportadorDatos();
    this.getDestinoDatos();
  }

  /**
  * Evalúa si se debe inicializar o cargar datos en el formulario.  
  * Además, obtiene la información del catálogo de mercancía.
  */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    }
  }

  /**
   * Guarda los datos del formulario y actualiza el estado del componente.
   * @method guardarDatosFormulario
   * @returns {void} Este método no retorna ningún valor.
   */
  guardarDatosFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.campoDeshabilitar=true;
    } else {
      this.campoDeshabilitar=false;
    }
  }

  /**
   * Obtiene los datos del exportador desde el servicio `acuicolaService` y los asigna a la propiedad `exportadorTableDatos`.
   * @returns {void} No devuelve ningún valor explícito, pero asigna los datos obtenidos a `exportadorTableDatos`.
   */
  getExportadorDatos(): void {
    this.acuicolaService.getExportadorDatos()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
        this.exportadorTableDatos = data;
      });
  }

  /**
   * Obtiene los datos del destino desde el servicio `acuicolaService` y los asigna a la propiedad `destinoTableDatos`.
   * @returns {void} No devuelve ningún valor explícito, pero asigna los datos obtenidos a `destinoTableDatos`.
   */
  getDestinoDatos(): void {
    this.acuicolaService.getDestinoDatos()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
        this.destinoTableDatos = data;
      });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Aquí se desuscriben los observables para evitar fugas de memoria.
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.unsubscribe();
  }

}
