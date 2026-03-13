import { NgModule, forwardRef } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DesistimientoPageComponent } from './pages/desistimiento-page/desistimiento-page.component';
import { DesistimientoRoutingModule } from './desistimiento-routing.module';
import { DesistimientoService } from './services/desistimiento.service';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SelectPaisesComponent } from '@ng-mf/data-access-user';
import { ServiciosExtraordinariosService } from './services/servicios-extraordinarios.service';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';
@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    DesistimientoPageComponent,
    SolicitudComponent
  ],
  imports: [
    forwardRef(() => BtnContinuarComponent),
    CommonModule,
    forwardRef(() => FirmaElectronicaComponent),
    ReactiveFormsModule,
    RouterModule,
    forwardRef(() => SelectPaisesComponent),
    DesistimientoRoutingModule,
    forwardRef(() => SolicitanteComponent),
    forwardRef(() => TituloComponent),
    forwardRef(() => WizardComponent),
    ToastrModule.forRoot()
  ],
  exports: [],
  providers: [
    ToastrService,
    DesistimientoService,
    ServiciosExtraordinariosService 
  ]
})
export class DesistimientoModule {}
