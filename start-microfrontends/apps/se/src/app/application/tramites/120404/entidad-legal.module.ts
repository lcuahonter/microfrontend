import {
  AlertComponent,
  BtnContinuarComponent,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  SolicitanteComponent,
} from '@ng-mf/data-access-user';
import { AsignciondirectaPageComponent } from './pages/asignciondirecta-page/asignciondirecta-page.component';
import { AsignciontabComponent } from './component/asigncionTab/asigncion-tab.component';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { EntidadLegalRoutingModule } from './entidad-legal-routing.module';
import { InputRadioComponent } from '@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from '../120404/component/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../120404/component/paso-tres/paso-tres.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteAsigncionComponent } from './pages/solicitante-asigncionTab/solicitante-entidad.component';
import { SolicitantetabComponent } from './component/solicitantetab/solicitantetab.component';
import { WizardComponent } from '@ng-mf/data-access-user';
@NgModule({
  declarations: [SolicitanteAsigncionComponent, AsignciondirectaPageComponent],
  imports: [
    PasoDosComponent,
    PasoTresComponent,
    CommonModule,
    WizardComponent,
    EntidadLegalRoutingModule,
    SolicitanteComponent,
    ReactiveFormsModule,
    AsignciontabComponent,
    SolicitantetabComponent,
    BtnContinuarComponent,
    CatalogoSelectComponent,
    InputRadioComponent,
    AlertComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ],
})
export class EntidadLegalModule {}
