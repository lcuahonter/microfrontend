/**
 * Componente del flujo 221602 - Mercancía
 * 
 * Este archivo importa todos los módulos, modelos, componentes reutilizables y configuraciones 
 * necesarias para la gestión de exportadores y destinatarios en el flujo 221602.
 * 
 * - Se utilizan componentes como `TablaDinamicaComponent`, `AlertComponent` y `TituloComponent` para la UI.
 * - Se importan modelos como `Exportador` y `Destinatario` para representar los datos.
 * - Se emplean configuraciones como `CONFIGURATION_TABLA_DATOS` y `CONFIGURATION_TABLA_DESTINATARIO` 
 *   para definir el comportamiento de las tablas.
 * - También se hace uso de operadores RxJS (`Subject`, `map`, `takeUntil`) para el manejo de estados reactivos.
 * - Se integra `ConsultaioQuery` para consultar datos globales desde el store.
 * - Finalmente, se importa un archivo JSON con configuraciones adicionales del flujo (`realizar.json`).
 */
import { AlertComponent, ConfiguracionColumna, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Exportador, MENSAJE_TABLA_OBLIGATORIA } from '@libs/shared/data-access-user/src/core/models/221602/mercancia.model';
import { Subject,map,takeUntil } from 'rxjs';
import { CONFIGURATION_TABLA_DATOS } from '@libs/shared/data-access-user/src/core/models/221602/mercancia.model';
import { CONFIGURATION_TABLA_DESTINATARIO } from '@libs/shared/data-access-user/src/core/models/221602/mercancia.model';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Destinatario } from '@libs/shared/data-access-user/src/core/models/221602/mercancia.model';
import realizar from '@libs/shared/theme/assets/json/221602/realizar.json';
/**
 * Componente encargado de gestionar la visualización y exportación de datos relacionados con los exportadores y destinatarios.
 * Este componente muestra dos tablas dinámicas: una para los exportadores y otra para los destinatarios. 
 * Además, permite la exportación de los datos a formatos adecuados.
 * 
 * Este componente también incluye la gestión de la visualización de mensajes obligatorios para las tablas.
 * 
 * @component
 * @example
 * <app-terceros></app-terceros>
 * 
 * @imports
 * - `TituloComponent`: Componente para mostrar el título en la interfaz.
 * - `TablaDinamicaComponent`: Componente para mostrar tablas dinámicas con la posibilidad de ordenar y filtrar.
 * - `AlertComponent`: Componente para mostrar alertas.
 * 
 */
@Component({
  selector: 'app-terceros',
  standalone: true,
  imports: [
    TituloComponent,
    TablaDinamicaComponent,
    AlertComponent
  ],
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss']
})
/**
 * Componente encargado de gestionar los datos de exportadores y destinatarios dentro de una tabla dinámica.
 * También permite la exportación de los datos. 
 * 
 * @class
 * @example
 * <app-terceros></app-terceros>
 * 
 * @constructor
 * El componente no requiere de un constructor explícito para inicializar dependencias.
 * 
 * @property {string} TEXTOS - Mensaje a mostrar en la interfaz cuando una tabla es obligatoria.
 * @property {Exportador[]} exportador - Lista de exportadores que se obtiene desde un archivo JSON.
 * @property {Destinatario[]} destinatario - Lista de destinatarios que se obtiene desde un archivo JSON.
 * @property {TablaSeleccion} checkbox - Configuración para los checkboxes en las tablas.
 * @property {ConfiguracionColumna<Exportador>[]} configuracionTabla - Configuración de las columnas de la tabla de exportadores.
 * @property {ConfiguracionColumna<Destinatario>[]} configuracionTablaDatos - Configuración de las columnas de la tabla de destinatarios.
 * 
 */
export class TercerosComponent {
 /** Indica si el formulario debe mostrarse en modo solo lectura.  
 *  Controla la habilitación o deshabilitación de los campos. */
  esFormularioSoloLectura: boolean = false;
  /**
   * Mensaje que indica que la tabla es obligatoria.
   */
  TEXTOS: string = MENSAJE_TABLA_OBLIGATORIA;

  /**
   * Lista de exportadores obtenida desde un archivo JSON.
   * Cada exportador contiene información como nombre, teléfono, correo electrónico y domicilio.
   */
  exportador: Exportador[] = realizar.exportador

  /**
   * Configuración de las columnas de la tabla de exportadores.
   * Define el encabezado, clave y el orden de las columnas para la tabla de exportadores.
   */
  public checkbox = TablaSeleccion.CHECKBOX;
  /**
 * Configuración de las columnas para la tabla de exportadores.
 * Se utiliza para definir qué columnas se mostrarán, su orden y propiedades.
 */
  configuracionTabla: ConfiguracionColumna<Exportador>[] =CONFIGURATION_TABLA_DATOS;

  /**
   * Lista de destinatarios obtenida desde un archivo JSON.
   * Cada destinatario contiene información como nombre, teléfono, correo electrónico y dirección.
   */
  destinatario: Destinatario[] = realizar.destinatario;

  /**
   * Configuración de las columnas de la tabla de destinatarios.
   * Define el encabezado, clave y el orden de las columnas para la tabla de destinatarios.
   */
  configuracionTablaDatos: ConfiguracionColumna<Destinatario>[] = CONFIGURATION_TABLA_DESTINATARIO ;
     /**
      * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
      */
     private destroyNotifier$: Subject<void> = new Subject();
  /**
     * Constructor del componente. Inicializa las dependencias necesarias y prepara el formulario reactivo.
     * 
     * @param fb - FormBuilder utilizado para crear el formulario reactivo.
     * @param tramite221602Store - Store que gestiona los valores persistentes del trámite 221602.
     * @param tramite221602Query - Query que se utiliza para obtener el estado actual de la solicitud 221602.
     */
    constructor(
         private consultaioQuery: ConsultaioQuery,  
    ) { 
         this.consultaioQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.esFormularioSoloLectura = seccionState.readonly;       
           
          })
        )
        .subscribe();
      }
}
