import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { ProsecModificacionRoutingModule } from './prosec-modificacion-routing.module';

import { FormsModule } from '@angular/forms';

import { ProsecModificacionComponent } from './pages/prosec-modificacion/prosec-modificacion.component';

import { Modificacion90305Component } from './component/modificacion-90305/modificacion-90305.component';

import { BtnContinuarComponent, WizardComponent } from '@ng-mf/data-access-user';

import { ConsultadDomicilios90305Component } from './component/consultad-domicilios-90305/consultad-domicilios-90305.component';

import { Bitacora90305Component } from './component/bitacora-90305/bitacora-90305.component';

import { SolicitanteComponent } from '@ng-mf/data-access-user';

import { Datos90305Component } from './pages/datos-90305/datos-90305.component';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

import { PasoTresComponent } from './component/paso-tres/paso-tres.component';

import { PasoDosComponent } from './component/paso-dos/paso-dos.component';


@NgModule({
  declarations: [ProsecModificacionComponent, Datos90305Component,],
  imports: [WizardComponent, BtnContinuarComponent, CommonModule,FormsModule, ProsecModificacionRoutingModule,Modificacion90305Component,ConsultadDomicilios90305Component,Bitacora90305Component,SolicitanteComponent,PasoTresComponent,PasoDosComponent],
  providers: [provideHttpClient(), ToastrService],
})
export class ProsecModificacionModule {}
