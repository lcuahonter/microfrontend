import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent,FirmaElectronicaComponent,SolicitanteComponent,TablaDinamicaComponent,TituloComponent,WizardComponent } from '@ng-mf/data-access-user';
import { PasoCargaDocumentoComponent,PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { CapturarExpedicionCertificadosComponent } from './components/capturar-expedicion-certificados/capturar-expedicion-certificados.component';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { ExpedicionCertificadoRoutingModule } from './expedicion-certificado-cupos-routing.module';
import { FirmarSolicitudComponent } from './pages/firmar-solicitud/firmar-solicitud.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SolicitudExpedicionPageComponent } from './pages/solicitud-expedicion-page/solicitud-expedicion-page.component';
import { ToastrService } from 'ngx-toastr';



/**
 * Módulo `ExpedicionCertificadoModule`:
 * Este módulo gestiona la funcionalidad relacionada con la expedición de certificados de cupos.
 * Contiene componentes, servicios y configuraciones necesarias para esta funcionalidad específica.
 * 
 * @module ExpedicionCertificadoModule
 * 
 * @description
 * - **Declaraciones**: Define los componentes que pertenecen exclusivamente a este módulo.
 * - **Importaciones**: Incluye módulos y componentes externos necesarios para el funcionamiento de este módulo.
 * - **Proveedores**: Lista de servicios que estarán disponibles dentro del alcance de este módulo.
 * - **Exportaciones**: Expone componentes que pueden ser utilizados por otros módulos.
 * 
 * @declarations
 * - `DatosComponent`: Componente para gestionar los datos.
 * - `FirmarSolicitudComponent`: Componente para firmar la solicitud.
 * - `SolicitudExpedicionPageComponent`: Página principal para la solicitud de expedición.
 * - `RequisitosNecessariosComponent`: Componente para mostrar los requisitos necesarios.
 * - `AnexarRequisitosComponent`: Componente para anexar los requisitos.
 * 
 * @imports
 * - `AlertComponent`: Componente para mostrar alertas.
 * - `AnexarDocumentosComponent`: Componente para anexar documentos.
 * - `BtnContinuarComponent`: Botón para continuar.
 * - `CapturarExpedicionCertificadosComponent`: Componente para capturar datos de expedición.
 * - `CommonModule`: Módulo común de Angular.
 * - `ExpedicionCertificadoRoutingModule`: Configuración de rutas para este módulo.
 * - `FirmaElectronicaComponent`: Componente para la firma electrónica.
 * - `ReactiveFormsModule`: Módulo para formularios reactivos.
 * - `SolicitanteComponent`: Componente para gestionar datos del solicitante.
 * - `TablaDinamicaComponent`: Componente para mostrar tablas dinámicas.
 * - `TituloComponent`: Componente para mostrar títulos.
 * - `WizardComponent`: Componente para asistente de pasos.
 * 
 * @providers
 * - `ToastrService`: Servicio para mostrar notificaciones tipo toast.
 * 
 * @exports
 * - `SolicitudExpedicionPageComponent`: Componente exportado para ser utilizado en otros módulos.
 */
@NgModule({
  // Declaraciones de los componentes que pertenecen a este módulo
  declarations: [
    DatosComponent,
    FirmarSolicitudComponent,
    SolicitudExpedicionPageComponent

  ],
  // Importaciones de otros módulos y componentes necesarios para este módulo
  imports: [
    AlertComponent, // Componente para mostrar alertas
    AnexarDocumentosComponent,
    BtnContinuarComponent, // Componente de botón para continuar
    CapturarExpedicionCertificadosComponent,
    CommonModule, // Módulo común de Angular
    ExpedicionCertificadoRoutingModule, // Módulo de enrutamiento para este módulo
    FirmaElectronicaComponent, // Componente para la firma electrónica
    ReactiveFormsModule, // Módulo para formularios reactivos
    TablaDinamicaComponent,// Componente para el asistente de pasos
    TituloComponent, // Componente para mostrar títulos
    WizardComponent,
    SolicitanteComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ],
  // Proveedores de servicios que estarán disponibles en este módulo
  providers: [
    ToastrService, // Servicio para mostrar notificaciones tipo toast
  ],
  exports:[SolicitudExpedicionPageComponent]
})
export class ExpedicionCertificadoModule { }
