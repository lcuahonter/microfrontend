import { BtnContinuarComponent, PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
import { TemporalContenedoresRoutingModule } from './temporal-contenedores-routing.module';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';
import { NotificacionesComponent } from '@ng-mf/data-access-user';

@NgModule({
  declarations: [
    SolicitantePageComponent,
  ],
  imports: [
    CommonModule,
    TemporalContenedoresRoutingModule,
    BtnContinuarComponent,
    PasoUnoComponent,
    PasoTresComponent,
    PasoDosComponent,
    WizardComponent,
    NotificacionesComponent,
    PasoFirmaComponent
  ],
  exports: [],
  providers: [
    ToastrService
  ]
})
export class TemporalContenedoresModule { }
