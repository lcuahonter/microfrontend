import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BtnContinuarComponent, FirmaElectronicaComponent, SharedModule, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { ConcluirRelacionComponent } from './components/concluir-relacion/concluir-relacion-de.component';
import { ConcluirRelacionDeRoutingModule} from './concluir-relacion-de-routing.module';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [
    PasoDosComponent,
    PasoUnoComponent,
    SolicitantePageComponent
  ],
  imports: [
    CommonModule,
    ConcluirRelacionDeRoutingModule,
    CommonModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    ConcluirRelacionComponent,
    FirmaElectronicaComponent,
    SharedModule,
  ],
  providers: [
    ToastrService
  ],
})
export class ConcluirRelacionDeModule { }
