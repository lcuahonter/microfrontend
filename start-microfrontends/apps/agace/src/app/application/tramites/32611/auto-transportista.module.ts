import { AlertComponent, NotificacionesComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { AutoTransportistaComponent } from './components/auto-transportista/auto-transportista.component';
import { AutoTransportistaRoutingModule } from './auto-transportista-routing.module';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CTPATComponent } from './components/c-tpat/c-tpat.component';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosComunesComponent } from './components/datos-comunes/datos-comunes.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FormsModule } from '@angular/forms';
import { ImportadorExportadorComponent } from './components/importador-exportador/importador-exportador.component';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TercerosRelacionadosComponent } from './components/terceros-relacionados/terceros-relacionados.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';

@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    SolicitudPageComponent
  ],
  imports: [
    AutoTransportistaRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    WizardComponent,
    SolicitanteComponent,
    TituloComponent,
    FormsModule,
    CatalogoSelectComponent,
    InputFechaComponent,
    TablaDinamicaComponent,
    DatosComunesComponent,
    AlertComponent,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    TituloComponent,
    TercerosRelacionadosComponent,
    ImportadorExportadorComponent,
    AutoTransportistaComponent,
    ToastrModule.forRoot(),
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    CTPATComponent,
    NotificacionesComponent
  ],
  exports: [],
  
})
export class AutoTransportistaModule {}
