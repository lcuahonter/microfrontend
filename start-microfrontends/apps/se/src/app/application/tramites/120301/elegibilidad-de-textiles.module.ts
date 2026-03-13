import { AlertComponent, CargaDocumentoComponent } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CapturarFacturasComponent } from './components/capturar-facturas/capturar-facturas.component';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ConstanciaDelRegistroComponent } from './components/constancia-del-registro/constancia-del-registro.component';
import { CrosslistComponent } from '@ng-mf/data-access-user';
import { ElegibilidadDeTextilesRoutingModule } from './elegibilidad-de-textiles-routing.module';
import { ElegibilidadTextilesComponent } from './pages/elegibilidad-textiles/elegibilidad-textiles.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FormularioAsociacionFacturaComponent } from './components/facturas-asociadas/facturas-asociadas.component';
import { HistoricoFabricantesComponent } from './components/historico-fabricantes/historico-fabricantes.component';
import { ImportadorEnDestinoComponent } from './components/importador-en-destino/importador-en-destino.component';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TableComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';

@NgModule({
  declarations: [
    ElegibilidadTextilesComponent,
    PasoDosComponent,
    PasoTresComponent,
    PasoUnoComponent,
    ImportadorEnDestinoComponent,
  ],
  imports: [
    CommonModule,
    ElegibilidadDeTextilesRoutingModule,
    ConstanciaDelRegistroComponent,
    WizardComponent,
    SolicitanteComponent,
    TituloComponent,
    InputFechaComponent,
    ReactiveFormsModule,
    SharedModule,
    BtnContinuarComponent,
    CrosslistComponent,
    AlertComponent,
    InputFechaComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    RouterModule,
    CapturarFacturasComponent,
    FormularioAsociacionFacturaComponent,
    HistoricoFabricantesComponent,
    TableComponent,
    CatalogoSelectComponent,
    CargaDocumentoComponent
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ElegibilidadDeTextilesModule { }