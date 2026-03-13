import { AlertComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { AutoridadService } from './services/autoridad.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FormsModule } from '@angular/forms';
import { InputRadioComponent } from '@ng-mf/data-access-user';
import { ManifiestoAereoRoutingModule } from './manifiesto-aereo-routing.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RequirementoComponent } from './components/requiremento/requiremento.component';
import { SeleccionarDocumentosComponent } from './components/seleccionar-documentos/seleccionar-documentos.component';
import { SolicitarRequerimientoComponent } from './pages/solicitar-requerimiento/solicitar-requerimiento.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';
import { provideHttpClient } from '@angular/common/http';
@NgModule({
  declarations: [
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManifiestoAereoRoutingModule,
    WizardComponent,
    FirmaElectronicaComponent,
    TituloComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    BtnContinuarComponent,
    ToastrModule.forRoot(),
    InputRadioComponent,
    SolicitarRequerimientoComponent,
    RequirementoComponent,
    SeleccionarDocumentosComponent,
  ],
  providers: [
    AutoridadService,
    provideHttpClient(),
    ToastrService,
    BsModalService
  ]
})

/**
 * Este módulo se utiliza para configurar los componentes del módulo 32401.
 * Importar los componentes del módulo.
 */
export class ManifiestoAereoModule {}
