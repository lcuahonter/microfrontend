import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosDelSeguroComponent } from "../datos-del-seguro/datos-del-seguro.component";
import { DatosDelSolicitanteComponent } from "../datos-del-solicitante/datos-del-solicitante.component";
import { InformacionDeCompaniaComponent } from "../informacion-de-compania/informacion-de-compania.component";
import { RepresentanteLegalComponent } from "../representante-legal/representante-legal.component";
import { TituloComponent } from "@ng-mf/data-access-user";

@Component({
  selector: 'app-information-general-solicitante',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    DatosDelSolicitanteComponent,
    DatosDelSeguroComponent,
    RepresentanteLegalComponent,
    InformacionDeCompaniaComponent
  ],
  templateUrl: './information-general-solicitante.component.html',
  styleUrl: './information-general-solicitante.component.scss',
})
export class InformationGeneralSolicitanteComponent {
  
  @ViewChild('datosDelSolicitanteRef') 
  datosDelSolicitanteComponent!: DatosDelSolicitanteComponent;

  @ViewChild('representanteLegalRef')
  representanteLegalComponent!: RepresentanteLegalComponent;

  @ViewChild('datosDelSeguroRef')
  datosDelSeguroComponent!: DatosDelSeguroComponent;

  @ViewChild('informacionDeCompaniaRef')
  informacionDeCompaniaComponent!: InformacionDeCompaniaComponent;

  // Method to validate all forms and mark as touched
  public validateAllForms(): boolean {
    let isValid = true;

    if (this.datosDelSolicitanteComponent?.ninoFormGroup) {
      if (this.datosDelSolicitanteComponent.ninoFormGroup.invalid) {
        this.datosDelSolicitanteComponent.ninoFormGroup.markAllAsTouched();
        isValid = false;
      }
    }
    
    if (this.representanteLegalComponent?.ninoFormGroup) {
      if (this.representanteLegalComponent.ninoFormGroup.invalid) {
        this.representanteLegalComponent.ninoFormGroup.markAllAsTouched();
        isValid = false;
      }
    }
    
    if (this.datosDelSeguroComponent?.ninoFormGroup) {
      if (this.datosDelSeguroComponent.ninoFormGroup.invalid) {
        this.datosDelSeguroComponent.ninoFormGroup.markAllAsTouched();
        isValid = false;
      }
    }
    
    if (this.informacionDeCompaniaComponent?.ninoFormGroup) {
      if (this.informacionDeCompaniaComponent.ninoFormGroup.invalid) {
        this.informacionDeCompaniaComponent.ninoFormGroup.markAllAsTouched();
        isValid = false;
      }
    }

    return isValid;
  }

  // Method to check if all forms are valid without marking as touched
  public areAllFormsValid(): boolean {
    
    const DATOS_DEL_SOLICITANTE_VALIDO = this.datosDelSolicitanteComponent?.ninoFormGroup?.valid ?? true;
    const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.ninoFormGroup?.valid ?? true;
    const DATOS_DEL_SEGURO_VALIDO = this.datosDelSeguroComponent?.ninoFormGroup?.valid ?? true;
    const INFORMACION_DE_COMPANIA_VALIDA = this.informacionDeCompaniaComponent?.ninoFormGroup?.valid ?? true;

    return DATOS_DEL_SOLICITANTE_VALIDO &&
          REPRESENTANTE_LEGAL_VALIDO &&
          DATOS_DEL_SEGURO_VALIDO &&
          INFORMACION_DE_COMPANIA_VALIDA;
      }
}