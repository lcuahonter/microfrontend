import { AlertComponent,AnexarDocumentosComponent,BtnContinuarComponent,CatalogoSelectComponent,FirmaElectronicaComponent,
  NotificacionesComponent,SolicitanteComponent, TablaDinamicaComponent, TableComponent,TituloComponent,WizardComponent } from '@ng-mf/data-access-user';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AgregarAgenteComponent } from './components/agregar-agente/agregar-agente.component';
import { AvisoAgenteComponent } from './components/aviso-agente/aviso-agente.component';
import { AvisoCalculoComponent } from './components/aviso-calculo/aviso-calculo.component';
import { AvisoDeModificacionComponent } from './pages/aviso-de-modificacion/aviso-de-modificacion.component';
import { AvisoDeModificationRoutingModule } from './aviso-de-modificacion-routing.module';
import { CambioDenominacionRazonSocialComponent } from './components/cambio-denominacion-razon-social/cambio-denominacion-razon-social.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FusionOEscisionComponent } from './components/fusion-o-escision/fusion-o-escision.component';
import { ModificarAgenteComponent } from './components/modificar-agente/modificar-agente.component';
import { ModificarFusionEscisionComponent } from './components/modificar-fusion-escision/modificar-fusion-escision.component';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TercerosRelacionadosComponent } from './components/terceros-relacionados/terceros-relacionados.component';
import { TipoDeAvisoComponent } from './components/tipo-de-aviso/tipo-de-aviso.component';


@NgModule({
  declarations: [
    AvisoDeModificacionComponent,
    PasoDosComponent,
    PasoTresComponent,
    PasoUnoComponent
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
     WizardComponent,
    BtnContinuarComponent,
    AvisoCalculoComponent,
    SolicitanteComponent,
    FusionOEscisionComponent,
    FirmaElectronicaComponent,
    CambioDenominacionRazonSocialComponent,
    TituloComponent,
    TipoDeAvisoComponent,
    TercerosRelacionadosComponent,
    TableComponent,
    FormsModule,
    AlertComponent,
    AnexarDocumentosComponent,
    AvisoAgenteComponent,
    AgregarAgenteComponent,
    CambioDenominacionRazonSocialComponent,
    CatalogoSelectComponent,
    ModificarAgenteComponent,
    ModificarFusionEscisionComponent,
    AvisoDeModificationRoutingModule,
    TablaDinamicaComponent,
    NotificacionesComponent,
    ToastrModule.forRoot()
  ],
  exports: [
  ],
  providers: [ToastrService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AvisoDeModificacionModule {}
