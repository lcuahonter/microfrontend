import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosComunesTresComponent } from '../../shared/components/datos-comunes-tres/datos-comunes-tres.component';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDuosComponent } from './pages/paso-duos/paso-duos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PerfilesFerrovarioComponent } from './components/perfiles-ferrovario/perfiles-ferrovario.component';
import { RubroTransporteFerroviarioRoutingModule } from './rubro-transporte-ferroviario-routing.module';
import { TercerosRelacionadosComponent } from '../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { TransporteFerroviarioComponent } from './components/transporte-ferroviario/transporte-ferroviario.component';

@NgModule({
  declarations: [
    PantallasComponent,
    PasoUnoComponent,
    PasoDuosComponent,
    PasoTresComponent
  ],
  imports: [
    CommonModule,
    RubroTransporteFerroviarioRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    AlertComponent,
    SolicitanteComponent,
    DatosComunesTresComponent,
    TercerosRelacionadosComponent,
    TransporteFerroviarioComponent,
    PerfilesFerrovarioComponent,
    TituloComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent
  ]
})
export class RubroTransporteFerroviarioModule { }
