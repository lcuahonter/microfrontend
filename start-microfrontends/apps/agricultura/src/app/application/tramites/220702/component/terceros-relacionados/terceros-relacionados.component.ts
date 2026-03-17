import { AlertComponent, ConfiguracionColumna, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { DESTINO_SERVICIO, DestinoInfo, ExportadorInfo } from '../../constantes/acuicola.enum';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { EXPORTADOR_SERVICIO } from '../../constantes/acuicola.enum';
import { FitosanitarioService } from '../../service/fitosanitario.service';
import { MANDATORY_INSTRUCTION } from '../../constantes/acuicola.enum';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

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
  
})
export class TercerosRelacionadosComponent implements OnInit, OnDestroy {

  /**
    * Instrucción que se muestra al usuario para indicar que debe hacer doble clic en un elemento
    * de la tabla para seleccionarlo.
    */
  instruccionDobleClic: string = MANDATORY_INSTRUCTION;

  /**
   * Configuración para la selección de elementos en la tabla mediante checkboxes.
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas de la tabla para los datos de exportadores.
   */
  exportadorTabla: ConfiguracionColumna<ExportadorInfo>[] = EXPORTADOR_SERVICIO;

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 

  /**
   * Indica si el campo debe ser deshabilitado.
   * @property {boolean} campoDeshabilitar
   */
  campoDeshabilitar:boolean= false;

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
   * Subject utilizado para notificar la destrucción del componente y limpiar suscripciones.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente TercerosRelacionadosComponent.
   * Inicializa el servicio de fitosanitario y la consulta de estado.
   * @param fitosanitarioService Servicio para manejar operaciones relacionadas con fitosanitarios.
   * @param consultaioQuery Consulta para manejar el estado de la aplicación.
   */

  constructor(private fitosanitarioService: FitosanitarioService,private consultaioQuery: ConsultaioQuery
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
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
 inicializarEstadoFormulario(): void {
  if (this.esFormularioSoloLectura) {
    this.guardarDatosFormulario();
  } 
  
}
  /**
   * Método que se ejecuta al inicializar el componente.
   * Inicializa el formulario y carga los datos de exportadores y destinatarios.
   * @method ngOnInit
   * @returns {void} Este método no retorna ningún valor.
   * @description
   * Este método se encarga de inicializar el estado del formulario y obtener los datos necesarios
   * para el componente. Si el formulario está en modo solo lectura, se deshabilitan los campos.
   * Si no, se habilitan los campos para permitir la edición.
   */

   ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.getDatos();
    this.getDatosDestinatario(); 
    }
    /**
   * Guarda los datos del formulario y actualiza el estado del componente.
   * Si el formulario está en modo solo lectura, deshabilita los campos.
   * Si no, habilita los campos para permitir la edición.
   *
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
     * Obtiene los datos del exportador utilizando el servicio de fitosanitario.
     * Se suscribe a los cambios y actualiza la tabla de exportadores con los datos obtenidos.
     */
    getDatos(): void {
      this.fitosanitarioService.getDatosExportador()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.exportadorTableDatos = RESPONSE;
        }
      });
    }

    /**
     * Obtiene los datos del destinatario utilizando el servicio de fitosanitario.
     * Se suscribe a los cambios y actualiza la tabla de destinos con los datos obtenidos.
     */
    getDatosDestinatario(): void {
      this.fitosanitarioService.getDatosDestinatarioInfo()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.destinoTableDatos = RESPONSE;
        }
      });
    }
    /**
     * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
     * Limpia las suscripciones para evitar fugas de memoria.
     */

    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.unsubscribe();
    }

}
