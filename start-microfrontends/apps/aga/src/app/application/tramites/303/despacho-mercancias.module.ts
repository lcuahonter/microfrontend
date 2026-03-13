import { AlertComponent, CargaDocumentoComponent, CatalogoSelectComponent, NotificacionesComponent, TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { NgModule, forwardRef } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AgentesAgenciasAduanalesComponent } from './components/agentes-agencias-aduanales/agentes-agencias-aduanales.component';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { CrosslistComponent } from '@ng-mf/data-access-user';
import { DatosTransportistaComponent } from './components/datos-transportista/datos-transportista.component';
import { DespachoMercanciasRoutingModule } from './despacho-mercancias-routing.module';
import { DespachoMercanciasSolicitudComponent } from './components/despacho-mercancias-solicitud/despacho-mercancias-solicitud.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { InputCheckComponent } from '@ng-mf/data-access-user';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { InputHoraComponent } from '@ng-mf/data-access-user';
import { NavComponent } from '@ng-mf/data-access-user';
import { PagoDerechosComponent } from './components/pago-derechos/pago-derechos.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroFiguraComponent } from './components/registro-figura/registro-figura.component';
import { RegistroPageComponent } from './pages/registro-page/registro-page.component';
import { RegistroTrasportistaComponent } from './components/registro-trasportista/registro-trasportista.component';
import { RouterModule } from '@angular/router';
import { SelectPaisesComponent } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TercerosRelacionadosComponent } from './components/terceros-relacionados/terceros-relacionados.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';

@NgModule({
  declarations: [
    AgentesAgenciasAduanalesComponent,
    DatosTransportistaComponent,
    DespachoMercanciasSolicitudComponent,
    PasoDosComponent,
    PasoTresComponent,
    PasoUnoComponent,
    RegistroPageComponent,
    PagoDerechosComponent
  ],
  imports: [
    CommonModule,
    DespachoMercanciasRoutingModule,
    RouterModule,
    NavComponent,
    forwardRef(() => WizardComponent),
    TituloComponent,
    BtnContinuarComponent,
    ReactiveFormsModule,
    AlertComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    InputCheckComponent,
    InputHoraComponent,
    InputFechaComponent,
    CrosslistComponent,
    SelectPaisesComponent,
    TercerosRelacionadosComponent,
    forwardRef(() => AnexarDocumentosComponent),
    ToastrModule.forRoot(),
    NotificacionesComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    forwardRef(() => CargaDocumentoComponent),
    RegistroFiguraComponent,
    RegistroTrasportistaComponent,
  ],
  exports: [
  ],
  providers: [
    ToastrService
  ]
})
export class DespachoMercanciasModule { }
