import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { AlertComponent, CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';
import { DatosDelFabricanteComponent } from './components/datos-del-fabricante/datos-del-fabricante.component';
import { DatosDonanteExtranjeroComponent } from './components/datos-donante-extranjero/datos-donante-extranjero.component';
import { DatosDonatarioComponent } from './components/datos-donatario/datos-donatario.component';
import { DatosPersonaOirRecibirComponent } from './components/datos-persona-oir-recibir/datos-persona-oir-recibir.component';
import { DatosRepLegalDonatarioComponent } from './components/datos-rep-legal-donatario/datos-rep-legal-donatario.component';
import { DatosRepLegalRecibirDonacionComponent } from './components/datos-rep-legal-recibir-donacion/datos-rep-legal-recibir-donacion.component';
import { DonacionesExtranjerasRoutingModule } from './donaciones-extranjeras-routing.module';
import { DonacionesExtranjerasService } from './services/donaciones-extranjeras/donaciones-extranjeras.service';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { InputRadioComponent } from '@ng-mf/data-access-user';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RegistroDeDonacionComponent } from './components/registro-de-donacion/registro-de-donacion.component';
import { RegistroSolicitudPageComponent } from './pages/registro-solicitud-page/registro-solicitud-page.component';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';
import { TableComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TramiteFolioService } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';


@NgModule({
  declarations: [
    RegistroDeDonacionComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    RegistroSolicitudPageComponent,
    DatosDonanteExtranjeroComponent,
    DatosDonatarioComponent,
    DatosRepLegalDonatarioComponent,
    DatosRepLegalRecibirDonacionComponent,
    DatosPersonaOirRecibirComponent,
    DatosDelFabricanteComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DonacionesExtranjerasRoutingModule,
    WizardComponent,
    TituloComponent,
    BtnContinuarComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    SolicitanteComponent,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CatalogoSelectComponent,
    TableComponent,
    InputRadioComponent,
    InputFechaComponent,
    ToastrModule.forRoot(),
    TooltipModule
  ],
  providers: [
    ToastrService,
    DonacionesExtranjerasService,
    CatalogosService,
    InicioSesionService,
    SubirDocumentoService,
    TramiteFolioService 
  ]
})
export class DonacionesExtranjerasModule { }
