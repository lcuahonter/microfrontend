import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogosService, FirmaElectronicaComponent, InicioSesionService, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, SubirDocumentoService, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CertificadosLicenciasService } from '../services/certificados-licencias.service';
import { CertificadosRoutingModule } from './certificados-routing.module';
import { CommonModule } from '@angular/common';
import { DatosdelasolicitudComponent } from '../../../shared/components/shared2607/datos-del/datos-de-la-solicitud.component';
import { DomicilloDelComponent } from '../components/domicillo-del/domicillo-del.component';
import { ManifiestosComponent } from '../components/manifiestos/manifiestos.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechoComponent } from '../../../shared/components/shared2607/pagodederechos/pago-de-derecho.component';
import { PasoDosComponent } from '../pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../pages/paso-uno/paso-uno.component';
import { RepresentanteLegalComponent } from '../components/representante-legal/representante-legal.component';
import { SanitarioService } from '../../260211/services/sanitario.service';
import { TercerosRelacionadosModalComponent } from '../components/terceros-relacionados-modal/terceros-relacionados-modal.component';
import { TercerosrelacionadosComponent } from '../../../shared/components/shared2607/terceros relacionados/terceros-relacionados.component';
import { TodospasosComponent } from '../pages/todospasos/todospasos.component';
import { TramitesAsociadosComponent } from '../../../shared/components/shared2607/tramitesasociados/tramites-asociados.component';
import { provideHttpClient } from '@angular/common/http';


@NgModule({
  declarations: [TodospasosComponent,PasoUnoComponent,PasoDosComponent,PasoTresComponent],
  imports: [
    CommonModule,
    CertificadosRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    FirmaElectronicaComponent,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    TramitesAsociadosComponent,
     PagoDeDerechoComponent,
    TercerosrelacionadosComponent,
    TercerosRelacionadosModalComponent,
    DatosdelasolicitudComponent,
    DomicilloDelComponent,
    ManifiestosComponent,
    RepresentanteLegalComponent,
    ToastrModule.forRoot(),
 PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  ],
  providers: [
    ToastrService,
    provideHttpClient(),
    CatalogosService,
    InicioSesionService,
    SubirDocumentoService,
    CertificadosLicenciasService,
    SanitarioService
  ],
})
export class CertificadosModule { }
