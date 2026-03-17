import { AlertComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TituloComponent } from '@ng-mf/data-access-user';
/**
 * @descripción
 * `CargarArchivosComponent` es responsable de mostrar un mensaje de alerta
 * sobre el número de solicitud temporal al cargar archivos.
 */
@Component({
  selector: 'app-cargar-archivos',
  standalone: true,
  imports: [CommonModule, AlertComponent, TituloComponent],
  templateUrl: './cargar-archivos.component.html',
  styleUrl: './cargar-archivos.component.scss',
})
export class CargarArchivosComponent {
  /**
   * @propiedad {string} cargararchivos - Mensaje mostrado para informar a los usuarios
   * sobre el número de solicitud temporal.
   */
  cargararchivos: string = "La solicitud ha quedado registrada con el número temporal 202759017. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.";
}
