import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user'; // Importa componentes compartidos.
import { CommonModule } from '@angular/common'; // Importa el módulo común de Angular.
import { NgModule } from '@angular/core'; // Importa el decorador NgModule para definir un módulo de Angular.
import { ReactiveFormsModule } from '@angular/forms'; // Importa el módulo para trabajar con formularios reactivos.
import { ToastrService } from 'ngx-toastr'; // Importa el servicio para mostrar notificaciones tipo toast.

import { DatosComponent } from './pages/datos/datos.component'; // Importa el componente para gestionar los datos.
import { DatosMonumentoComponent } from './component/datos-monumentos/datos-monumentos.component'; // Importa el componente para gestionar los datos de los monumentos.
import { DestinoComponent } from './component/destino/destino.component'; // Importa el componente para gestionar los datos del destino.
import { ElementoAnadidasComponent } from './component/elemento-anadidos/elemento-anadidos.component'; // Importa el componente para gestionar los elementos añadidos.
import { FirmarSolicitudComponent } from './pages/firmar-solicitud/firmar-solicitud.component'; // Importa el componente para gestionar la firma de la solicitud.
import { MonumentoComponent } from './component/monumento/monumento.component'; // Importa el componente para gestionar los monumentos.
import { PermisoDeExportacionComponent } from './pages/permiso-de-exportacion/permiso-de-exportacion.component'; // Importa el componente principal de permisos de exportación.
import { PermisoDeExportacionRoutingModule } from './permiso-de-exportacion-routing.module'; // Importa el módulo de enrutamiento para permisos de exportación.
import { SolicitudComponent } from './component/solicitud/solicitud.component'; // Importa el componente para gestionar la solicitud.

@NgModule({
  // Declaraciones de los componentes que pertenecen a este módulo.
  declarations: [
    DatosComponent, // Componente para gestionar los datos.
    FirmarSolicitudComponent, // Componente para gestionar la firma de la solicitud.
    PermisoDeExportacionComponent, // Componente principal de permisos de exportación.
  ],
  // Importaciones de otros módulos y componentes necesarios para este módulo.
  imports: [
    AnexarDocumentosComponent, // Componente para anexar documentos.
    SolicitudComponent, // Componente para gestionar la solicitud.
    CommonModule, // Módulo común de Angular.
    BtnContinuarComponent, // Componente de botón para continuar.
    DestinoComponent, // Componente para gestionar los datos del destino.
    FirmaElectronicaComponent, // Componente para la firma electrónica.
    MonumentoComponent, // Componente para gestionar los monumentos.
    DatosMonumentoComponent, // Componente para gestionar los datos de los monumentos.
    ElementoAnadidasComponent, // Componente para gestionar los elementos añadidos.
    ReactiveFormsModule, // Módulo para trabajar con formularios reactivos.
    PermisoDeExportacionRoutingModule, // Módulo de enrutamiento específico para permisos de exportación.
    SolicitanteComponent, // Componente para gestionar los datos del solicitante.
    TablaDinamicaComponent, // Componente para mostrar tablas dinámicas.
    TituloComponent, // Componente para mostrar títulos.
    AlertComponent, // Componente para mostrar alertas.
    WizardComponent, // Componente para el asistente de pasos.
  ],
  // Proveedores de servicios que estarán disponibles en este módulo.
  providers: [
    ToastrService, // Servicio para mostrar notificaciones tipo toast.
  ],
  // Exportaciones de componentes o módulos que estarán disponibles fuera de este módulo.
  exports: [PermisoDeExportacionComponent], // Exporta el componente principal de permisos de exportación.
})
export class PermisoDeExportacionModule { }
