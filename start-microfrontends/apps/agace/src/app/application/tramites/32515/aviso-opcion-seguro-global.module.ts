// Importaciones de componentes compartidos del módulo de usuario
import { AlertComponent,AnexarDocumentosComponent,BtnContinuarComponent,CatalogoSelectComponent,CrosslistComponent,FirmaElectronicaComponent,InputCheckComponent,InputFechaComponent,InputHoraComponent,SelectPaisesComponent,SharedModule,SolicitanteComponent,TituloComponent,WizardComponent} from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvisoOpcionSeguroGlobalRoutingModule } from './aviso-opcion-seguro-global-routing.module';
import { CommonModule } from '@angular/common';
import { InformationGeneralSolicitanteComponent } from './components/information-general-solicitante/information-general-solicitante.component';
import { InformationGeneralSolicitanteService } from './services/information-general-solicitante.service';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RouterModule } from '@angular/router';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  // Declaración de los componentes que pertenecen a este módulo
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    SolicitudPageComponent,
  ],
  // Importación de módulos requeridos por este módulo
  imports: [
    CommonModule, // Módulo común de Angular con directivas básicas
    RouterModule, // Soporte para el enrutamiento
    FormsModule, // Formularios template-driven
    ReactiveFormsModule, // Formularios reactivos
    AvisoOpcionSeguroGlobalRoutingModule, // Rutas específicas de este módulo
    SharedModule, // Módulo compartido con utilidades comunes
    WizardComponent, // Componente tipo "wizard" para navegación entre pasos
    SolicitanteComponent, // Componente para datos del solicitante
    BtnContinuarComponent, // Botón de continuar
    InputCheckComponent, // Checkbox personalizado
    InputFechaComponent, // Componente de fecha
    InputHoraComponent, // Componente de hora
    CrosslistComponent, // Lista cruzada
    TituloComponent, // Componente de título
    SelectPaisesComponent, // Selector de países
    FirmaElectronicaComponent, // Componente de firma electrónica
    AnexarDocumentosComponent, // Componente para anexar documentos
    AlertComponent, // Componente de alertas
    CatalogoSelectComponent, // Selector de catálogo
    InformationGeneralSolicitanteComponent // Componente con información general del solicitante
  ],
  // Servicios disponibles para inyección en este módulo
  providers: [
    InformationGeneralSolicitanteService, // Servicio para manejar información del solicitante
    ToastrService // Servicio de notificaciones toast
  ],
  // Esquema que permite el uso de elementos personalizados (web components)
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
// Módulo principal para la funcionalidad de Aviso de Opción de Seguro Global
export class AvisoOpcionSeguroGlobalModule { }
