import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, NotificacionesComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosEmpresaComponent } from './components/datos-empresa/datos-empresa.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroComoEmpresaRoutingModule } from './registro-como-empresa-routing.module';
import { RegistroComoEmpresaService } from './services/registro-como-empresa.service';
import { RegistroEmpresaComponent } from './pages/registro-empresa/registro-empresa.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    PasoDosComponent,
    PasoUnoComponent,
    PasoTresComponent,
    RegistroEmpresaComponent
  ],
  imports: [
    DatosEmpresaComponent,
    CommonModule,
    RegistroComoEmpresaRoutingModule,
    TituloComponent,
    BtnContinuarComponent,
    CommonModule,
    WizardComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    ReactiveFormsModule,
    NotificacionesComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ToastrService, RegistroComoEmpresaService],
})
export class RegistroComoEmpresaModule { }
