import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';

import { FitosanitarioRoutingModule } from './fitosanitario-routing.module';

import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';

import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';

import { DatosMercanciaComponent } from './components/datos-mercancia/datos-mercancia.component';

import { ToastrModule } from 'ngx-toastr';

import { ToastrService } from 'ngx-toastr';

import {
  BtnContinuarComponent,

  CatalogoSelectComponent,

  CrosslistComponent,

  InputCheckComponent,

  InputFechaComponent,

  InputRadioComponent,

  TablaDinamicaComponent,

  TableComponent,

  TercerosComponent,


  WizardComponent
} from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    SolicitudPageComponent
  ],
  imports: [
    CommonModule,
    WizardComponent,
    BtnContinuarComponent,
    ReactiveFormsModule,
    CrosslistComponent,
    InputCheckComponent,
    InputFechaComponent,
    InputRadioComponent,
    TableComponent,
    CatalogoSelectComponent,
    TercerosComponent,
    ToastrModule.forRoot(),
    FitosanitarioRoutingModule,
    TablaDinamicaComponent,
    DatosMercanciaComponent,
    PasoUnoComponent,
    PasoTresComponent,
    PasoDosComponent,
  ]
  ,
  providers: [
    ToastrService
  ]
})
export class FitosanitarioModule { }
