import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, InputFechaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosdelasolicitudComponent } from './components/datos-del/datos-de-la-solicitud.component';
import { ImportarDeRemediosHerbalsRoutingModule } from './importar-de-remedios-herbals-routing.module';
import { ImportarDeRemediosHerbalsService } from './services/importar-de-remedios-herbals.service';
import { PagoDeDerechoComponent } from './components/pagodederechos/pago-de-derecho.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoRemediosHerbalesComponent } from './pages/permiso-remedios-herbales/permiso-remedios-herbales.component';
import { TercerosrelacionadosComponent } from './components/terceros relacionados/terceros-relacionados.component';

import { ToastrService } from 'ngx-toastr';
import { TramitesAsociadosComponent } from './components/tramitesasociados/tramites-asociados.component';

@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    PermisoRemediosHerbalesComponent,
  ],
  imports: [
    CommonModule,
    ImportarDeRemediosHerbalsRoutingModule,
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    PagoDeDerechoComponent,
    TramitesAsociadosComponent,
    TercerosrelacionadosComponent,
    DatosdelasolicitudComponent,
    FirmaElectronicaComponent,
    InputFechaComponent,
    SolicitanteComponent,
    TituloComponent,
    WizardComponent,
    TablaDinamicaComponent,
  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [ToastrService,ImportarDeRemediosHerbalsService],
})
export class ImportarDeRemediosHerbalsModule {}
