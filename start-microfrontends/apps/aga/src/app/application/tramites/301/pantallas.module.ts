/* eslint-disable @nx/enforce-module-boundaries */
import { AlertComponent } from '@libs/shared/data-access-user/src/tramites/components/alert/alert.component';
import { AnexarDocumentosComponent } from 'libs/shared/data-access-user/src/tramites/components/anexar-documentos/anexar-documentos.component';
import { BtnContinuarComponent } from '@libs/shared/data-access-user/src/tramites/components/btn-continuar/btn-continuar.component';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DeLaMuestraComponent } from './components/de-la-muestra/de-la-muestra.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src/tramites/components/firma-electronica/firma-electronica.component';
import { InformacionDeLaComponent } from './components/informacion-de-la/informacion-de-la.component';
import { NavComponent } from 'libs/shared/data-access-user/src/tramites/components/nav/nav.component';
import { NgModule } from '@angular/core';
import { Pantallas301Service } from './services/pantallas301.service';

import { PagoDeDerechosComponent } from './components/pago-de-derechos/pago-de-derechos.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PantallasRoutingModule } from './pantallas-routing.module';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { RegistroParaLaComponent } from './components/registro-para-la/registro-para-la.component';
import { SolicitanteComponent } from 'libs/shared/data-access-user/src/tramites/components/solicitante/solicitante.component';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { WizardComponent } from 'libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    DatosComponent,
    PantallasComponent,
    PasoDosComponent,
    PasoTresComponent,
  ],
  imports: [
    CommonModule,
    PantallasRoutingModule,
    WizardComponent,
    NavComponent,
    PagoDeDerechosComponent,
    RegistroParaLaComponent,
    DeLaMuestraComponent,
    InformacionDeLaComponent,
    SolicitanteComponent,
    AnexarDocumentosComponent,
    TituloComponent,
    AlertComponent,
    FirmaElectronicaComponent,
    BtnContinuarComponent,
  ],
  exports: [
    PasoDosComponent,
    PasoTresComponent
  ],
  providers: [
    provideHttpClient(),
    Pantallas301Service
  ]
})
export class Pantallas301Module {}
