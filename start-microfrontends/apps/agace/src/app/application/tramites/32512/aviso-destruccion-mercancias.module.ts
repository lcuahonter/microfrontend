import { AvisoDestruccionMercanciasRoutingModule } from "./aviso-destruccion-mercancias-routing.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PasoDosComponent } from "./pages/paso-dos/paso-dos.component";
import { PasoTresComponent } from "./pages/paso-tres/paso-tres.component";
import { PasoUnoComponent } from "./pages/paso-uno/paso-uno.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SolicitudPageComponent } from "./pages/solicitud-page/solicitud-page.component";
import { ToastrModule } from "ngx-toastr";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    PasoUnoComponent,
    SolicitudPageComponent,
    PasoDosComponent,
    PasoTresComponent,
    AvisoDestruccionMercanciasRoutingModule
  ],
  exports: [],
  providers: [],
})
export class AvisoDestruccionMercanciasModule {}