// Módulo para la autorización de importación
import { AlertComponent, BtnContinuarComponent, WizardComponent } from "@libs/shared/data-access-user/src";
import { AutorizacionImportacionRoutingModule } from "./autorizacion-importacion-routing.module";
import { AutorizacionImportacionService } from "./services/autorizacion-importacion.service";
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
  // Declaración de componentes utilizados en este módulo
  declarations: [
    SolicitantePageComponent
  ],
  // Importación de módulos y componentes necesarios
  imports: [
    CommonModule,
    AlertComponent, // Componente de alerta reutilizable
    BtnContinuarComponent, // Botón para continuar en el flujo
    AutorizacionImportacionRoutingModule, // Módulo de rutas específico
    RouterModule,
    WizardComponent, // Componente para el asistente de pasos
    PasoUnoComponent, // Primer paso del trámite
    PasoTresComponent, // Tercer paso del trámite
    PasoDosComponent, // Segundo paso del trámite
    ToastrModule.forRoot() // Configuración de notificaciones
  ],
  exports: [],
  // Proveedores de servicios utilizados en el módulo
  providers: [ToastrService, AutorizacionImportacionService]
})
export class AutorizacionImportacionModule {
  // Clase del módulo de autorización de importación
}