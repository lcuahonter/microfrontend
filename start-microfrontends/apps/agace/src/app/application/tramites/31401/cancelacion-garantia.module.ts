import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CancelacionGarantiaRoutingModule } from './cancelacion-garantia-routing.module';
import { CancelacionGarantiaService } from './services/cancelacion-garantia/cancelacion-garantia.service';
import { ClientesYProvedoresComponent } from './components/clientes-y-provedores/clientes-y-provedores.component';
import { CommonModule } from '@angular/common';
import { ControlDeInventariosComponent } from './components/control-de-inventarios/control-de-inventarios.component';
import { DatosPorGarantiaComponent } from './components/datos-por-garantia/datos-por-garantia.component';
import { HttpClientModule } from '@angular/common/http';
import { InfraestructuraComponent } from './components/infraestructura/infraestructura.component';
import { ManifestacionesDeCancelacionComponent } from './components/manifestaciones-de-cancelacion/manifestaciones-de-cancelacion.component';
import { ManifiestoBajoProtestaComponent } from './components/manifiesto-bajo-protesta/manifiesto-bajo-protesta.component';
import { MiembroDeLaEmpresaComponent } from './components/miembro-de-la-empresa/miembro-de-la-empresa.component';
import { MiembrosDeLaEmpresaComponent } from './components/miembros-de-la-empresa/miembros-de-la-empresa.component';
import { ModalidadDeLaGarantiaComponent } from './components/modalidad-de-la-garantia/modalidad-de-la-garantia.component';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RegimenAduaneroComponent } from './components/regimen-aduanero/regimen-aduanero.component';
import { RequisitosComponent } from './components/requisitos/requisitos.component';
import { TerecerosRelacionadosComponent } from './components/tereceros-relacionados/tereceros-relacionados.component';
import { TipoDeGarantiaComponent } from './components/tipo-de-garantia/tipo-de-garantia.component';
import { TipoSectorComponent } from './components/tipo-sector/tipo-sector.component';

@NgModule({
  declarations: [
    PantallasComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent
  ],
  imports: [
    CommonModule,
    CancelacionGarantiaRoutingModule,
    WizardComponent,
    AlertComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    TipoDeGarantiaComponent,
    HttpClientModule,
    ModalidadDeLaGarantiaComponent,
    TipoSectorComponent,
    ManifiestoBajoProtestaComponent,
    RequisitosComponent,
    ClientesYProvedoresComponent,
    ControlDeInventariosComponent,
    MiembrosDeLaEmpresaComponent,
    MiembroDeLaEmpresaComponent,
    RegimenAduaneroComponent,
    InfraestructuraComponent,
    ManifestacionesDeCancelacionComponent,
    DatosPorGarantiaComponent,
    TerecerosRelacionadosComponent,
    TituloComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent
  ],
  providers: [
    CancelacionGarantiaService
  ]
})
export class CancelacionGarantiaModule { }
 