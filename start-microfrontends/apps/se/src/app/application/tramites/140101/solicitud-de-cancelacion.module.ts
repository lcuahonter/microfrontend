import { AlertComponent, BtnContinuarComponent,FirmaElectronicaComponent, PasoFirmaComponent, SolicitanteComponent,TituloComponent,WizardComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { DatosComponent } from './pages/datos/datos.component';
import { ProgramaACancelarComponent } from './components/programaACancelar/programaACancelar.component';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
import { SolicitudDeCancelacionRoutingModule } from './solicitud-de-cancelacion-routing.module';

@NgModule({
  // Declaraciones de los componentes que pertenecen a este módulo
  declarations: [
    DatosComponent,
    SolicitantePageComponent
  ],
  // Importaciones de otros módulos y componentes necesarios para este módulo
  imports: [
    CommonModule, // Módulo común de Angular
    BtnContinuarComponent, // Componente de botón para continuar
    FirmaElectronicaComponent, // Componente para la firma electrónica
    ProgramaACancelarComponent, // Componente para mostrar el programa a cancelar
    ReactiveFormsModule, // Módulo para formularios reactivos
    SolicitudDeCancelacionRoutingModule, // Módulo de enrutamiento para este módulo
    SolicitanteComponent, // Componente del solicitante
    TituloComponent, // Componente para mostrar títulos
    AlertComponent, // Componente para mostrar alertas
    WizardComponent, // Componente para el asistente de pasos
    PasoFirmaComponent, // Componente para el paso de firma
  ],
  // Proveedores de servicios que estarán disponibles en este módulo
  providers: [
    ToastrService, // Servicio para mostrar notificaciones tipo toast
  ],
  exports:[SolicitantePageComponent]
})
export class SolicitudDeCancelacionModule { }
