import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogosService, FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CertificadosLicenciasPermisosRoutingModule } from './certificados-licencias-permisos-routing.module';
import { CertificadosLicenciasPermisosService } from '../../../shared/services/shared2603/certificados-licencias-permisos.service';
import { CommonModule } from '@angular/common';

import { FabricanteModalComponent } from '../../../shared/components/2603/fabricante-modal/fabricante-modal.component';
import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { NgModule } from '@angular/core';
import { PasoCuatroComponent } from '../pages/paso-cuatro/paso-cuatro.component';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
import { provideHttpClient } from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CertificadosLicenciasPermisosRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    AlertComponent,
    FabricanteModalComponent,
    AnexarDocumentosComponent,
    ToastrModule.forRoot(),
    FirmaElectronicaComponent,
    PasoCuatroComponent
],
providers: [
  BsModalService,
  provideHttpClient(),
  CertificadosLicenciasPermisosService,
  CatalogosService,
  ToastrService,
  InicioSesionService,
  SubirDocumentoService
]
}) 
export class CertificadosLicenciasPermisosModule { }
