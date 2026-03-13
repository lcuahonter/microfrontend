/* eslint-disable sort-imports */
/* eslint-disable @nx/enforce-module-boundaries */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroCuentasBancariasRoutingModule } from './registro-cuentas-bancarias-routing.module';
import { WizardComponent } from 'libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
import { TodospasosComponent } from '../pages/todospasos/todospasos.component';
import { PasoDosComponent } from '../pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from '../pages/paso-uno/paso-uno.component';
import { DatosGeneralesComponent } from '../components/datos-generales/datos-generales.component';
import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { provideHttpClient } from '@angular/common/http';
import { RegistroCuentasBancariasService } from '../services/registro-cuentas-bancarias.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AgregarCuentaComponent } from '../components/agregar-cuenta/agregar-cuenta.component';
import { PasoTresComponent } from '../pages/paso-tres/paso-tres.component';


@NgModule({
  declarations: [TodospasosComponent,PasoDosComponent,PasoUnoComponent,PasoTresComponent],
  imports: [
    CommonModule,
    RegistroCuentasBancariasRoutingModule,
    WizardComponent,
    DatosGeneralesComponent,
    AlertComponent,
    FirmaElectronicaComponent,
    BtnContinuarComponent,
    AgregarCuentaComponent,
    TituloComponent,
    AnexarDocumentosComponent,
    ToastrModule.forRoot(),
  ],
  providers: [
    RegistroCuentasBancariasService,
    provideHttpClient(),
    ToastrService
  ]
})
export class RegistroCuentasBancariasModule { }
