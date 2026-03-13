import { AlertComponent, BtnContinuarComponent, NotificacionesComponent, PasoFirmaComponent, WizardComponent } from "@libs/shared/data-access-user/src";
import { CertificadoOrigenComponent } from "./components/certificado-origen/certificado-origen.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PasoTresComponent } from "./pages/paso-tres/paso-tres.component";
import { PasoUnoComponent } from "./pages/paso-uno/paso-uno.component";
import { RouterModule } from "@angular/router";
import { SolicitantePageComponent } from "./pages/solicitante-page/solicitante-page.component";
import { ToastrService } from "ngx-toastr";
import { ValidacionPosterioriRoutingModule } from "./validacion-posteriori-routing.module";

@NgModule({
  declarations: [
    SolicitantePageComponent,
  ],
  imports: [
    CommonModule,
    BtnContinuarComponent,
    ValidacionPosterioriRoutingModule,
    RouterModule,
    WizardComponent,
    PasoUnoComponent,
    PasoTresComponent,
    AlertComponent,
    PasoFirmaComponent,
    NotificacionesComponent,
    CertificadoOrigenComponent
  ],
  exports: [],
  providers: [ToastrService]
})
export class ValidacionPosterioriModuleModule {


}