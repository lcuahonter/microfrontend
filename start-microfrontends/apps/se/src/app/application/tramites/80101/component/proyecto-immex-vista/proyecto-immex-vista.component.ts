import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { PROYECTO_DATOS } from '../../constantes/nuevo-programa.enum';
import { PROYECTO_IMMEX_CONFIG } from '../../../../shared/constantes/anexo-dos-y-tres.enum';
import { PoryectoDatos } from '../../../../shared/models/nuevo-programa-industrial.model';
import { ProyectoImmexComponent } from '../../../../shared/components/proyecto-immex/proyecto-immex.component';
import { ProyectoImmexEncabezado } from '../../../../shared/models/nuevo-programa-industrial.model';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { Tramite80101Store } from '../../estados/tramite80101.store';

/**
 * Componente Angular para la vista del proyecto IMMEX.
 * Este componente se encarga de mostrar y gestionar los datos relacionados
 * con el proyecto IMMEX, incluyendo la configuración de la tabla y los documentos asociados.
 * 
 * @remarks
 * Este componente es autónomo y utiliza el módulo `CommonModule` y el componente `ProyectoImmexComponent`.
 */
@Component({
  selector: 'app-proyecto-immex-vista',
  standalone: true,
  imports: [CommonModule, ProyectoImmexComponent],
  templateUrl: './proyecto-immex-vista.component.html',
  styleUrl: './proyecto-immex-vista.component.scss',
})
export class ProyectoImmexVistaComponent implements OnInit {
  /**
   * Representa los datos del proyecto IMMEX.
   * 
   * @type {PoryectoDatos}
   * @constant
   * @description Esta propiedad contiene los datos relacionados con el proyecto IMMEX,
   *              inicializados con un valor predeterminado definido en `PROYECTO_DATOS`.
   */
  public proyectoImmexDatos: PoryectoDatos = PROYECTO_DATOS;

  /**
   * Crea una instancia del componente e inyecta el servicio Tramite80101Store.
   * 
   * @param tramite80101Store Servicio para gestionar el estado y operaciones relacionadas con el trámite 80101.
   */
  constructor( private tramite80101Store: Tramite80101Store, private query: Tramite80101Query,){
 // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Lista de encabezados del proyecto IMMEX.
   * 
   * Esta propiedad almacena un arreglo de objetos de tipo `ProyectoImmexEncabezado`,
   * que representan los datos principales relacionados con el proyecto IMMEX.
   * 
   * @type {ProyectoImmexEncabezado[]}
   */
  public proyectoImmexTablaLista: ProyectoImmexEncabezado[] = [];
  /**
   * Configuración para el proyecto IMMEX.
   * 
   * Esta propiedad define la configuración utilizada en el componente 
   * para manejar la tabla y la selección de elementos relacionados 
   * con el proyecto IMMEX.
   * 
   * Propiedades:
   * - `proyectoImmexSeleccionCheckBox`: Define el tipo de selección en la tabla, 
   *   en este caso, se utiliza un checkbox para seleccionar elementos.
   * - `proyectoImmexTabla`: Contiene la configuración específica de la tabla 
   *   para el proyecto IMMEX.
   */
  public proyectoImmexConfiguartion = {
    proyectoImmexSeleccionCheckBox: TablaSeleccion.CHECKBOX,
    proyectoImmexTabla: PROYECTO_IMMEX_CONFIG
  };

  /**
   * Evento que se emite para cerrar el popup actual.
   * 
   * Notifica al componente padre que se debe cerrar el popup.
   * No envía ningún dato, solo indica la acción de cierre.
   */
  @Output() cerrarPopup = new EventEmitter<void>();

  /**
   * Observable que representa los datos de la tabla de complementos.
   *
   * @type {Observable<ProyectoImmexEncabezado[]>}
   * @description Este observable contiene una lista de objetos de tipo `ProyectoImmexEncabezado`,
   * que se utiliza para mostrar y gestionar los datos relacionados con los complementos
   * en la interfaz de usuario.
   */
  public proyectoImmexTablaLista$!: Observable<ProyectoImmexEncabezado[]>;

  ngOnInit(): void {
    this.proyectoImmexTablaLista$ = this.query.selectProyectoImmexTablaLista$;
  }

  /**
   * Método para asignar la lista de proyectos IMMEX a la propiedad `proyectoImmexTablaLista`.
   * 
   * @param event - Arreglo de objetos de tipo `ProyectoImmexEncabezado` que contiene los datos de los proyectos IMMEX.
   */
  obtenerProyectoTablaDevolverLaLlamada(event: ProyectoImmexEncabezado[]): void{
    this.proyectoImmexTablaLista = event;
    this.tramite80101Store.setProyectoImmexTablaLista(this.proyectoImmexTablaLista);
  }
}
