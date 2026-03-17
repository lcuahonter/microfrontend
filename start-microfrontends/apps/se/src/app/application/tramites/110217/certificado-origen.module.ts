import { AlertComponent, BtnContinuarComponent, WizardComponent } from "@libs/shared/data-access-user/src";
import { CertificadoOrigenRoutingModule } from "./certificado-origen-routing.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PasoTresComponent } from "./pages/paso-tres/paso-tres.component";
import { PasoUnoComponent } from "./pages/paso-uno/paso-uno.component";
import { RouterModule } from "@angular/router";
import { SolicitantePageComponent } from "./pages/solicitante-page/solicitante-page.component";
import { ToastrService } from "ngx-toastr";

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    BtnContinuarComponent,
    CertificadoOrigenRoutingModule,
    RouterModule,
    WizardComponent,
    PasoUnoComponent,
    PasoTresComponent,
    AlertComponent,
    SolicitantePageComponent
  ],
  exports: [],
  providers: [ToastrService]
})
export class CertificadoOrigenModule{


}