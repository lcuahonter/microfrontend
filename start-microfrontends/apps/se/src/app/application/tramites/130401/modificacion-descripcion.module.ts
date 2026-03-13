import { AlertComponent, BtnContinuarComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, WizardComponent } from "@libs/shared/data-access-user/src";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InvocarPageComponent } from "./pages/invocar-page/invocar-page.component";
import { ModificacionDescripcionRoutingModule } from "./modificacion-descripcion-routing.module";
import { NgModule } from "@angular/core";
import { PasoDosComponent } from "./pages/paso-dos/paso-dos.component";
import { PasoTresComponent } from "./pages/paso-tres/paso-tres.component";
import { PasoUnoComponent } from "./pages/paso-uno/paso-uno.component";
import { RouterModule } from "@angular/router";
import { SolicitantePageComponent } from "./pages/solicitante-page/solicitante-page.component";
import { ToastrService } from "ngx-toastr";

@NgModule({
  declarations: [
    SolicitantePageComponent,
    InvocarPageComponent
  ],
  imports: [
    CommonModule,
    BtnContinuarComponent,
    ModificacionDescripcionRoutingModule,
    RouterModule,
    WizardComponent,
    PasoUnoComponent,
    PasoTresComponent,
    PasoDosComponent,
    AlertComponent,
    FormsModule,
    ReactiveFormsModule,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    NotificacionesComponent
  ],
  exports: [],
  providers: [ToastrService]
})
export class ModificacionDescripcionModule {


}