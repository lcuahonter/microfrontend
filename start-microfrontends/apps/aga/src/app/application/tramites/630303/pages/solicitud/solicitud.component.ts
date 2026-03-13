/**
 * solicitud.component.ts
 */
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DatosDeLaSolicitudComponent } from '../../components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosMercanciaComponent } from '../../components/datos-mercancia/datos-mercancia.component';
import { ManifiestoComponent } from '../../components/manifiesto/manifiesto.component';
import { TipoPropietarioComponent } from '../../components/tipo-propietario/tipo-propietario.component';


/**
 * Component representing the "Solicitud" page.
 *
 * This component is responsible for rendering the "Solicitud" view
 * in the application. It uses an external HTML template for its structure.
 *
 * @selector app-solicitud
 * @standalone false
 * @templateUrl ./solicitud.component.html
 */
@Component({
  selector: 'app-solicitud',
  standalone: false,
  templateUrl: './solicitud.component.html',
})
export class SolicitudComponent implements AfterViewInit {
  /**
   * Referencia al componente de datos de la solicitud.
   */
  @ViewChild('datosDeLaSolicitud') datosDeLaSolicitudComponent!: DatosDeLaSolicitudComponent;

  /**
   * Referencia al componente de tipo propietario.
   */
  @ViewChild('tipoPropietario') tipoPropietarioComponent!: TipoPropietarioComponent;

  /**
   * Referencia al componente de datos de mercancia.
   */
  @ViewChild('datosMercancia') datosMercanciaComponent!: DatosMercanciaComponent;

  /**
   * Referencia al componente de manifiesto.
   */
  @ViewChild('manifiesto') manifiestoComponent!: ManifiestoComponent;

  /**
   * Se ejecuta después de que la vista y sus hijos han sido inicializados.
   * Aquí se pueden realizar inicializaciones adicionales o suscripciones.
   */
  ngAfterViewInit(): void {
    // Ejemplo: Inicializar datos o suscribirse a eventos de los componentes hijos
    // Se recomienda verificar la existencia de los componentes antes de usarlos
    if (this.datosDeLaSolicitudComponent) {
      // Realizar alguna inicialización si es necesario
    }
    if (this.tipoPropietarioComponent) {
      // Realizar alguna inicialización si es necesario
    }
    if (this.datosMercanciaComponent) {
      // Realizar alguna inicialización si es necesario
    }
    if (this.manifiestoComponent) {
      // Realizar alguna inicialización si es necesario
    }
  }

  /**
   * Valida todos los formularios de los componentes de solicitud.
   * Solo valida campos que están visibles según las condiciones de "Cuenta con prórroga" y "Propietario".
   * @returns {boolean} true si todos los formularios son válidos, false en caso contrario.
   */
  public validarFormularios(): boolean {
    let esValido = true;

    // Validar datos de la solicitud (incluye validación del componente de autorización)
    if (this.datosDeLaSolicitudComponent && typeof this.datosDeLaSolicitudComponent.validarTodosFormularios === 'function') {
      const SOLICITUD_VALIDA = this.datosDeLaSolicitudComponent.validarTodosFormularios();
      if (!SOLICITUD_VALIDA) {
        esValido = false;
      }
    } else {
      esValido = false;
    }

    // Validar tipo propietario considerando solo campos visibles según condiciones
    if (this.tipoPropietarioComponent && typeof this.tipoPropietarioComponent.validarFormularioCondicional === 'function') {
      const TIPO_PROPIETARIO_VALIDO = this.tipoPropietarioComponent.validarFormularioCondicional();
      if (!TIPO_PROPIETARIO_VALIDO) {
        esValido = false;
      }
    }

    // Validar datos de mercancia - SIEMPRE marcar como touched
    if (this.datosMercanciaComponent?.datosMercancia) {
      this.datosMercanciaComponent.datosMercancia.markAllAsTouched();
      if (this.datosMercanciaComponent.datosMercancia.invalid) {
        esValido = false;
      }
    } else {
      esValido = false;
    }

    // Validar manifiesto si tiene formulario - SIEMPRE marcar como touched
    if (this.manifiestoComponent?.manifiestoFormulario) {
      this.manifiestoComponent.manifiestoFormulario.markAllAsTouched();
      if (this.manifiestoComponent.manifiestoFormulario.invalid) {
        esValido = false;
      }
    }

    // Si falta algún componente esencial, el formulario no es válido
    if (!this.datosDeLaSolicitudComponent || !this.datosMercanciaComponent) {
      esValido = false;
    }

    return esValido;
  }


}
