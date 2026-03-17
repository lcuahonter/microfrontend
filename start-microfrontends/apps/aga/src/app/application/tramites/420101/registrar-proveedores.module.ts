import { BtnContinuarComponent, FirmaElectronicaComponent, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RegistrarDeProveedoresComponent } from './components/registrar-de-proveedores/registrar-de-proveedores.component';
import { RegistrarProveedoresRoutingModule } from './registrar-proveedores-routing.module';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [
    SolicitantePageComponent,
    PasoUnoComponent,
    PasoDosComponent,
  ],
  imports: [
    CommonModule,
    SolicitanteComponent,
    FirmaElectronicaComponent,
    RegistrarDeProveedoresComponent,
    WizardComponent,
    BtnContinuarComponent,
    RegistrarProveedoresRoutingModule
  ],
  providers: [
    ToastrService
  ],
})
export class RegistrarProveedoresModule { }