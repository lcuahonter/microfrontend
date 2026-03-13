import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalFuncionesComponent } from '../modal-funciones/modal-funciones.component';
import { Router } from '@angular/router';

/**
 * Componente para el registro de opiniones.
 * 
 * Permite al usuario cargar archivos, visualizar instrucciones para los documentos requeridos,
 * y navegar al proceso de firma electrónica. Controla la visibilidad de botones y modales
 * relacionados con la carga de documentos.
 */
@Component({
  selector: 'app-registrar-opinion',
  standalone: true,
  imports: [CommonModule, ModalFuncionesComponent],
  templateUrl: './registrar-opinion.component.html',
  styleUrl: './registrar-opinion.component.scss',
})
export class RegistrarOpinionComponent {
  /**
   * Controla la visibilidad de los botones de acción.
   */
  mostrarBotones = false;

  /**
   * Representa la fecha de la solicitud.
   */
  fechaSolicitud: string = '2023-10-01';

  /**
   * Controla la visibilidad del modal para cargar documentos.
   */
  abrirModal = false;

  /**
   * Almacena los archivos seleccionados por el usuario.
   * Inicialmente es un arreglo vacío.
   */
  archivos: File[] = [];

  /**
   * Contiene las instrucciones o requisitos para los archivos que se pueden cargar.
   * Se muestra en el modal de carga de documentos.
   */
  descripcionModal: string = `
  <ul>
    <li>Debe ser formato PDF sin formularios ni código embebido.</li>
    <li>Máximo 10 MB.</li>
    <li>No debe contener páginas en blanco.</li>
    <li>Imágenes en escala de grises a 300 dpi.</li>
  </ul>
`;

  /**
   * Constructor del componente.
   * @param router Inyección del servicio Router para navegación.
   */
  constructor(private router: Router) {}

  /**
   * Agrega un archivo al arreglo de archivos seleccionados y muestra los botones de acción.
   * @param archivo Archivo seleccionado por el usuario.
   */
  agregarArchivo(archivo: File) :void{
    this.archivos.push(archivo);
    this.mostrarBotones = true;
  }

  /**
   * Cambia el estado de abrirModal a true para mostrar el modal de carga de documentos.
   */
  mostrarModalDocumentos() :void{
    this.abrirModal = true;
  }

  /**
   * Navega a la ruta de firma electrónica para continuar el proceso.
   */
  guardarFormar() :void{
    this.router.navigate(['funcionario/firma-electronica']);
  }
}