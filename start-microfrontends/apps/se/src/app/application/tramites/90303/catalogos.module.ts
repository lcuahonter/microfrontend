
import { AlertComponent, BtnContinuarComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SharedModule, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BitacoraComponent } from './components/bitacora/bitacora.component';
import { CatalogosRoutingModule } from './catalogos-routing.module';
import { CommonModule } from '@angular/common';
import { ComplementariaComponent } from './components/complementaria/complementaria.component';
import { ModificacionComponent } from './components/Modificacion/modificacion.component';
import { NgModule } from '@angular/core';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PlantasComponent } from '../../shared/components/plantas/plantas.component';
import { ProducirMercanciasComponent } from '../../shared/components/producir-mercancias/producir-mercancias.component';
import { ProductorIndirectoComponent } from '../../shared/components/productor-indirecto/productor-indirecto.component';
import { SectorComponent } from '../../shared/components/sector/sector.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

@NgModule({
  declarations: [
    PasoUnoComponent,
    SolicitudPageComponent
  ],
  imports: [
    CommonModule,
    CatalogosRoutingModule,
    TituloComponent,
    AlertComponent,
    SharedModule,
    SolicitanteComponent,
    ReactiveFormsModule,
    BtnContinuarComponent,
    FormsModule,
    WizardComponent,
    BitacoraComponent,
    ModificacionComponent,
    TituloComponent,
    TablaDinamicaComponent,
    PlantasComponent, 
    SectorComponent, 
    ProducirMercanciasComponent, 
    ProductorIndirectoComponent,
    ComplementariaComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
  ]
})
export class CatalogosModule { }
