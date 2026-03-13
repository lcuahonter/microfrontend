import {AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, SharedModule, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { AvisoRetornoComponent } from './components/aviso-retorno.component';
import { AvisoRetornoRoutingModule } from './aviso-retorno-routing.module';
import { CommonModule } from '@angular/common';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [PasoDosComponent, PasoUnoComponent, PasoTresComponent, SolicitudPageComponent],
  imports: [
    CommonModule,
    AvisoRetornoRoutingModule,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent, 
    FirmaElectronicaComponent,
    SharedModule,
    SolicitanteComponent, 
    AvisoRetornoComponent,
    WizardComponent,
    BtnContinuarComponent,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
   ],
  providers: [ToastrService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AvisoRetornoModule { }
