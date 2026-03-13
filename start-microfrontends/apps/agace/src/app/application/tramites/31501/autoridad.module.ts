import { AlertComponent, AnexarDocumentosComponent, FirmaElectronicaComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AntecesorRoutingModule } from './autoridad-routing.module';
import { AutoridadService } from './services/autoridad.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CapturarElTextoLibreComponent } from './pages/capturar-el-texto-libre/capturar-el-texto-libre.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RequirementoComponent } from './components/requiremento/requiremento.component';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { SolicitanteComponent } from './components/solicitante/solicitante.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    PasoDosComponent,
    PasoTresComponent,
    SolicitudPageComponent
    ],
  imports: [
    CapturarElTextoLibreComponent,
    CommonModule,
    SolicitanteComponent,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    PasoUnoComponent,
    RequirementoComponent,
    AntecesorRoutingModule,
    WizardComponent,
    FirmaElectronicaComponent,
    RequirementoComponent,
    TituloComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    BtnContinuarComponent,
    ToastrModule.forRoot(),
  ],
  providers: [
    AutoridadService,
    ServiciosPantallaService,
    provideHttpClient(),
    ToastrService,
    BsModalService
  ]
})

/**
 * Este módulo se utiliza para configurar los componentes del módulo 31601.
 * Importar los componentes del módulo.
 */
export class AutoridadModule {}
