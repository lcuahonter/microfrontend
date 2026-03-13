import { AlertComponent, BtnContinuarComponent, WizardComponent } from "@libs/shared/data-access-user/src";
import { AvisoDestruccionService } from "./services/aviso-destruccion.service";
import { AvisoTrasladoRoutingModule } from "./aviso-destruccion-routing.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PasoDosComponent } from "./pages/paso-dos/paso-dos.component";
import { PasoTresComponent } from "./pages/paso-tres/paso-tres.component";
import { PasoUnoComponent } from "./pages/paso-uno/paso-uno.component";
import { RouterModule } from "@angular/router";
import { SolicitantePageComponent } from "./pages/solicitante-page/solicitante-page.component";
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from "ngx-toastr";


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AlertComponent,
    BtnContinuarComponent,
    AvisoTrasladoRoutingModule,
    RouterModule,
    WizardComponent,
    PasoUnoComponent,
    PasoTresComponent,
    PasoDosComponent,
    SolicitantePageComponent,
    ToastrModule.forRoot()
  ],
  exports: [],
  providers: [ToastrService, AvisoDestruccionService]
})
export class AvisoDestruccionModule {


}