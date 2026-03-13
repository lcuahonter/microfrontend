import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, InputCheckComponent, SharedModule, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RegistroSolicitudRoutingModule } from './registro-solicitud-routing.module';
import { SolicitudComponent } from './components/Solicitud.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [PasoUnoComponent, PasoDosComponent, PasoTresComponent, SolicitudPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    RegistroSolicitudRoutingModule,
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
  ],
  providers: [ToastrService],
})
export class RegistroSolicitudModule { }
