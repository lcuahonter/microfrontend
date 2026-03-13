
import { AlertComponent, BtnContinuarComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, WizardComponent } from '@ng-mf/data-access-user';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AnexarDocumentosComponent } from '@libs/shared/data-access-user/src/tramites/components/anexar-documentos/anexar-documentos.component';
import { CatalogosService } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosComponent } from '../pages/datos/datos.component';
import { DomiciliosDePlantasComponent } from '../components/domicilios-de-plantas/domicilios-de-plantas.component';
import { ExpansionDeProductoresRoutingModule } from './expansion-de-productores-routing.module';
import { FirmarSolicitudComponent } from '../pages/firmar-solicitud/firmar-solicitud.component';
import { FirmarSolicitudPasoDosComponent } from '../components/firmar-solicitud-paso-dos/firmar-solicitud-paso-dos.component';
import { NgModule } from '@angular/core';
import { PantallasComponent } from '../pages/pantallas/pantallas.component';
import { ProductorIndirectoComponent } from '../components/productor-indirecto/productor-indirecto.component';
import { SectoresYMercanciasComponent } from '../components/sectores-y-mercancias/sectores-y-mercancias.component';


@NgModule({
  declarations: [ 
    DatosComponent, 
    PantallasComponent,
    FirmarSolicitudComponent
  ],
  imports: [
    CommonModule,
    AlertComponent,
    ExpansionDeProductoresRoutingModule,
    WizardComponent,
    SolicitanteComponent, 
    SectoresYMercanciasComponent,
    PasoFirmaComponent,       
    ProductorIndirectoComponent,
    DomiciliosDePlantasComponent,
    BtnContinuarComponent,
    FirmarSolicitudPasoDosComponent,
    AnexarDocumentosComponent,
    PasoCargaDocumentoComponent,
    ToastrModule.forRoot()
  ],
  exports: [],
  providers: [
    ToastrService,
    CatalogosService
  ]
})

/**
 * Este módulo se utiliza para configurar los componentes del módulo 90201.
 * Importar los componentes del módulo.
 */
export class ExpansionDeProductoresModule { }
