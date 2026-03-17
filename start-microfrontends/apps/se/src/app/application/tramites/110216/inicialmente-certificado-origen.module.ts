import { AlertComponent, BtnContinuarComponent, NotificacionesComponent, PasoFirmaComponent, WizardComponent } from "@libs/shared/data-access-user/src";
import { CommonModule } from "@angular/common";
import { InicialmenteCertificadoOrigenRoutingModule } from "./inicialmente-certificado-origen-routing.module";
import { NgModule } from "@angular/core";
import { PasoTresComponent } from "./pages/paso-tres/paso-tres.component";
import { PasoUnoComponent } from "./pages/paso-uno/paso-uno.component";
import { RouterModule } from "@angular/router";
import { SolicitantePageComponent } from "./pages/solicitante-page/solicitante-page.component";
import { ToastrService } from "ngx-toastr";

@NgModule({
  declarations: [
    SolicitantePageComponent,
  ],
  imports: [
    CommonModule,
    BtnContinuarComponent,
    InicialmenteCertificadoOrigenRoutingModule,
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
export class InicialmenteCertificadoOrigenModule {


}