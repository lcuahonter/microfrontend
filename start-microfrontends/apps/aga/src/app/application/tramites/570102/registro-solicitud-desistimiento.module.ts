import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, InputCheckComponent, SharedModule, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificacionesComponent } from '@ng-mf/data-access-user';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RegistroSolicitudDesistimientoRoutingModule } from './registro-solicitud-desistimiento-routing.module';
import { SolicitudComponent } from './components/solicitud.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';


@NgModule({
  declarations: [PasoUnoComponent, PasoTresComponent, SolicitudPageComponent],
  imports: [
    CommonModule,
    RegistroSolicitudDesistimientoRoutingModule,
    SharedModule,
    SolicitudComponent,
    WizardComponent,
    BtnContinuarComponent,
    FormsModule,
    SolicitanteComponent,
    ReactiveFormsModule,
    InputCheckComponent,
    FirmaElectronicaComponent,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    SharedModule,
    TituloComponent,
    AlertComponent,
    NotificacionesComponent
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegistroSolicitudDesistimientoModule { }
