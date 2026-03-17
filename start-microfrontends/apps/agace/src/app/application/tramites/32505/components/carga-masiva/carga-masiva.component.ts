import { Component } from '@angular/core';
import { TEXTOS } from '../../constants/avios-procesos.enum';
import { TituloComponent } from "@ng-mf/data-access-user";
/**
 * @class CargaMasivaComponent
 * @description Componente encargado de gestionar la funcionalidad de carga masiva de archivos.
 * Este componente permite al usuario cargar archivos y manejar eventos relacionados con la carga.
 * También utiliza componentes auxiliares como `TituloComponent` y `AlertComponent`.
 */
@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrl: './carga-masiva.component.scss',
  imports: [TituloComponent],
  standalone: true,
})
export class CargaMasivaComponent {

   /**
   * Objeto con las instrucciones.
   * Contiene los textos utilizados en el componente.
   * @property {string} TEXTOS
   */
  TEXTOS = TEXTOS;

    /**
   * Evento que almacena los datos del archivo cargado.
   * @property {any} event
   */
  event = {};

 /**
   * Método para actualizar el archivo cargado.
   * Este método se ejecuta cuando el usuario selecciona un archivo para cargar.
   * @param {Event} event - Evento que contiene los datos del archivo cargado.
   */
  actualizarArchivo(event: Event): void {
    // Implementar lógica de carga de archivo.
    this.event = event;
  }
    
}
