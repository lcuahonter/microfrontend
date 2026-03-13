import { AlertComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { InspeccionFisicaComponent } from './pages/inspeccion-fisica/inspeccion-fisica.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { InspeccionFisicaZoosanitarioRoutingModule } from './inspeccion-fisica-zoosanitario-routing.module';

import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InspeccionFisicaZoosanitarioRoutingModule,
    SharedModule,
    BtnContinuarComponent,
    ReactiveFormsModule,
    TituloComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    SolicitanteComponent,
    InspeccionFisicaComponent
  ],
  providers: [ToastrService],
})

export class InspeccionFisicaZoosanitarioModule { }
