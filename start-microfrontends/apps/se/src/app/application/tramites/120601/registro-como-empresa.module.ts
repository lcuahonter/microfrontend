import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AlertComponent, BtnContinuarComponent, CatalogoSelectComponent, PasoCargaDocumentoComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosEmpresaComponent } from './component/datos-empresa/datos-empresa.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RegistroComoEmpresaRoutingModule } from './registro-como-empresa-routing.module';



@NgModule({
  declarations: [DatosComponent, PasoUnoComponent],
  imports: [
    CommonModule, 
    RegistroComoEmpresaRoutingModule,
    WizardComponent,
    SolicitanteComponent,
    DatosEmpresaComponent,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    BtnContinuarComponent,
    TablaDinamicaComponent,
    PasoDosComponent,
    PasoTresComponent,
    AlertComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ],
})
export class RegistroComoEmpresaModule {}
