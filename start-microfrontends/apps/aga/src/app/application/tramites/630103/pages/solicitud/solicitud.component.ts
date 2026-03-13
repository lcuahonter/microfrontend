/**
 * solicitud.component.ts
 */
import { Component } from '@angular/core';
import { DatosDeLaSolicitudComponent } from '../../components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosMercanciaComponent } from '../../components/datos-mercancia/datos-mercancia.component';
import { FechaDeImportacionComponent } from '../../components/fecha-de-importacion/fecha-de-importacion.component';
import { ManifiestoComponent } from '../../components/manifiesto/manifiesto.component';
import { TipoPropietarioComponent } from '../../components/tipo-propietario/tipo-propietario.component';
import { ViewChild } from '@angular/core';

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
export class SolicitudComponent {

  @ViewChild(DatosDeLaSolicitudComponent) datosDeLaSolicitud!: DatosDeLaSolicitudComponent;
  @ViewChild(FechaDeImportacionComponent) fechaDeImportacion!: FechaDeImportacionComponent;
  @ViewChild(TipoPropietarioComponent) tipoPropietario!: TipoPropietarioComponent;
  @ViewChild(DatosMercanciaComponent) datosMercancia!: DatosMercanciaComponent;
  @ViewChild(ManifiestoComponent) manifiesto!: ManifiestoComponent;
  
  /*
  * Validates the entire form by checking each child component's form validity.
  */
  validarFormulario(): boolean {
    const VALID_SOLICITUD = this.datosDeLaSolicitud?.validarFormulario() ?? false;
    const VALID_FECHA = this.fechaDeImportacion?.validarFormulario() ?? false;
    const VALID_PROPIETARIO = this.tipoPropietario?.validarFormulario() ?? false;
    const VALID_MERCANCIA = this.datosMercancia?.validarFormulario() ?? false;
    const VALID_MANIFIESTO = this.manifiesto?.validarFormulario() ?? false;

    return (
      VALID_SOLICITUD &&
      VALID_FECHA &&
      VALID_PROPIETARIO &&
      VALID_MERCANCIA &&
      VALID_MANIFIESTO
    );
}

}
