import { Component, ViewChild } from '@angular/core';
import { CargarArchivosComponent } from '../cargar-archivos/cargar-archivos.component';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from '../datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosGeneralesSociosComponent } from '../datos-generales-socios/datos-generales-socios.component';
import { DomicilioComponent } from '../domicilio/domicilio.component';
import { RepresentacionFederal } from '../../modelos/datos-empresa.model';
import { RepresentacionFederalComponent } from '../representacion-federal/representacion-federal.component';
/**
 * Componente que representa los datos de la empresa en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-datos-empresa',
  standalone: true,
  imports: [
    CommonModule,
    RepresentacionFederalComponent,
    DatosDeLaSolicitudComponent,
    DomicilioComponent,
    DatosGeneralesSociosComponent,
    CargarArchivosComponent
  ],
  templateUrl: './datos-empresa.component.html',
  styleUrls: ['./datos-empresa.component.scss'],
})
export class DatosEmpresaComponent {
  
  /**
   * Referencias ViewChild a los componentes hijos con formularios
   */
  /** Referencia al componente de representación federal */
  @ViewChild('representacionFederalRef') representacionFederal!: RepresentacionFederalComponent;
  
  /** Referencia al componente de datos de la solicitud */
  @ViewChild('datosSolicitudRef') datosSolicitud!: DatosDeLaSolicitudComponent;
  
  /** Referencia al componente de domicilio */
  @ViewChild('domicilioRef') domicilio!: DomicilioComponent;
  
  /** Referencia al componente de datos generales de socios */
  @ViewChild('datosGeneralesRef') datosGenerales!: DatosGeneralesSociosComponent;
  
  /** Referencia al componente de carga de archivos */
  @ViewChild('cargarArchivosRef') cargarArchivos!: CargarArchivosComponent;

  /**
   * Constructor del componente DatosEmpresaComponent.
   * 
   * @description
   * Inicializa el componente que gestiona los datos de la empresa.
   * Este componente coordina múltiples formularios hijos para recopilar
   * información completa de la empresa.
   */
  constructor() {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Valida todos los formularios de los componentes hijos de datos-empresa.
   * Marca todos los campos como tocados para mostrar errores de validación.
   * 
   * @returns {boolean} `true` si todos los formularios son válidos, `false` en caso contrario
   */
  public validarFormularios(): boolean {
    let isValid = true;

    // Validar formulario de representación federal
    if (this.representacionFederal && this.representacionFederal.formulario) {
      if (this.representacionFederal.formulario.invalid) {
        this.representacionFederal.formulario.markAllAsTouched();
        isValid = false;
      }
    }

    // Validar formulario de datos de la solicitud
    if (this.datosSolicitud && this.datosSolicitud.solicitudForm) {
      if (this.datosSolicitud.solicitudForm.invalid) {
        this.datosSolicitud.solicitudForm.markAllAsTouched();
        isValid = false;
      }
    }

    // Validar formulario de domicilio
    if (this.domicilio && this.domicilio.form) {
      if (this.domicilio.form.invalid) {
        this.domicilio.form.markAllAsTouched();
        isValid = false;
      }
    }

    // Validar formulario de datos generales de socios
    if (this.datosGenerales && this.datosGenerales.FormSolicitud) {
      if (this.datosGenerales.FormSolicitud.invalid) {
        this.datosGenerales.FormSolicitud.markAllAsTouched();
        isValid = false;
      }
    }

    return isValid;
  }

/**
 * Maneja los datos recibidos de las plantas.
 * Llama al método prefillDomicilioForm para rellenar el formulario de domicilio con la información obtenida.
 */
  onPlantasDataReceived(plantasData: RepresentacionFederal[]): void {
    this.domicilio.prellenarDomicilioForm(plantasData);
  }
  
}
