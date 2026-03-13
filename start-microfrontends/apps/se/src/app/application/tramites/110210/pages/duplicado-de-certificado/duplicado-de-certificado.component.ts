import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { BuscarCertificadoDeOrigenComponent } from '../../components/buscar-certificado-de-origen/buscar-certificado-de-origen.component';
import { CertificadoDisponibles } from '@libs/shared/data-access-user/src';

/**
 * @descripcion
 * El componente `DuplicadoDeCertificadoComponent` es responsable de renderizar la interfaz de usuario
 * y manejar la lógica para la página "Duplicado de Certificado" en la aplicación.
 *
 * @selector app-duplicado-de-certificado
 * @templateUrl ./duplicado-de-certificado.component.html
 */
@Component({
  selector: 'app-duplicado-de-certificado',
  templateUrl: './duplicado-de-certificado.component.html',
  standalone: false, // Indica que este componente no es independiente.
})
export class DuplicadoDeCertificadoComponent {
  /**
   * Evento que se emite cuando no se encuentran datos.
   * @type {EventEmitter<void>}
   */
  @Output() noDatosError = new EventEmitter<void>();
   /**
   * Evento que se emite cuando se deshabilita el certificado.
   * @type {EventEmitter<void>}
   */
  @Output() disableCertificado = new EventEmitter<void>();
  /**
   * Evento que se emite cuando se hace clic en una fila de la tabla.
   * @type {EventEmitter<CertificadoDisponibles>}
   */
  @Output() rowClicked = new EventEmitter<CertificadoDisponibles>();
  /**
   * @property {BuscarCertificadoDeOrigenComponent} buscarCertificado
   * @description
   * Referencia al componente hijo `BuscarCertificadoDeOrigenComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de búsqueda de certificado.
   */
  @ViewChild('buscarCertificado') buscarCertificado!: BuscarCertificadoDeOrigenComponent;


  /**
   * @method validarFormulario
   * @description
   * Valida el formulario de búsqueda de certificado en el componente hijo.
   * Si el componente hijo no existe, retorna `false`.
   * Si el formulario del componente hijo es inválido, retorna `false`.
   * Si el componente existe y su formulario es válido, retorna `true`.
   * 
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
   */
  public validarFormulario(): boolean {
    let isValid = true;

    if (this.buscarCertificado) {
      if (!this.buscarCertificado.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }
}