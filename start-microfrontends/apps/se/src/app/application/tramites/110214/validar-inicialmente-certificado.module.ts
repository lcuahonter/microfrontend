import { AlertComponent, BtnContinuarComponent, NotificacionesComponent, PasoFirmaComponent, WizardComponent } from "@libs/shared/data-access-user/src";
import { CommonModule } from "@angular/common"; import { NgModule } from "@angular/core";
import { PasoTresComponent } from "./pages/paso-tres/paso-tres.component";
import { PasoUnoComponent } from "./pages/paso-uno/paso-uno.component";
import { RouterModule } from "@angular/router";
import { SolicitantePageComponent } from "./pages/solicitante-page/solicitante-page.component";
import { ToastrService } from "ngx-toastr";
import { ValidarInicialmenteCertificadoRoutingModule } from "./validar-inicialmente-certificado-routing.module";

@NgModule({
  declarations: [
    SolicitantePageComponent,
  ],
  imports: [
    CommonModule,
    BtnContinuarComponent,
    ValidarInicialmenteCertificadoRoutingModule,
    RouterModule,
    WizardComponent,
    PasoUnoComponent,
    PasoTresComponent,
    AlertComponent,
    NotificacionesComponent,
    PasoFirmaComponent
  ],
  exports: [],
  providers: [ToastrService]
})
export class ValidarInicialmenteCertificadoModule {


}