import { NgModule, forwardRef } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CancelacionExtraordinariosPageComponent } from './pages/cancelacion-extraordinarios-page/cancelacion-extraordinarios-page.component';
import { CancelacionServiciosExtraordinariosRoutingModule } from './cancelacion-servicios-extraordinarios-routing.module';
import { CancelarSolicitudComponent } from './components/cancelar-solicitud/cancelar-solicitud.component';
import { CancelarSolicitudService } from './service/cancelar-solicitud.service';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { CrosslistComponent } from '@ng-mf/data-access-user';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SelectPaisesComponent } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { TramiteFolioService } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';

@NgModule({
  declarations: [
    CancelacionExtraordinariosPageComponent,
    PasoUnoComponent,
    PasoDosComponent,
    CancelarSolicitudComponent,
  ],
  imports: [
    forwardRef(() => BtnContinuarComponent),
    forwardRef(() => CatalogoSelectComponent),
    CommonModule,
    forwardRef(() => CrosslistComponent),
    forwardRef(() => FirmaElectronicaComponent),
    ReactiveFormsModule,
    RouterModule,
    forwardRef(() => SelectPaisesComponent),
    CancelacionServiciosExtraordinariosRoutingModule,
    forwardRef(() => SolicitanteComponent),
    forwardRef(() => TituloComponent),
    forwardRef(() => WizardComponent),
    ToastrModule.forRoot()
  ],
  exports: [],
  providers: [
    ToastrService,
    CancelarSolicitudService,
    TramiteFolioService 
  ]
})
export class CancelacionServiciosExtraordinariosModule {}
