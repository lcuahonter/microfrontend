import { CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { AnexarDocumentosComponent } from '@libs/shared/data-access-user/src';
import { BtnContinuarComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { CrosslistComponent } from '@libs/shared/data-access-user/src';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { PhytosanitaryExportRoutingModule } from './phytosanitary-export-routing.module';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { WizardComponent } from '@libs/shared/data-access-user/src';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PhytosanitaryExportRoutingModule,
    TituloComponent,
    CatalogoSelectComponent,
    ToastrModule.forRoot(),
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    FormsModule,
    ReactiveFormsModule,
    WizardComponent,
    FirmaElectronicaComponent,
    CrosslistComponent,
    SolicitanteComponent,
    TablaDinamicaComponent
  ],
  providers: [
    ToastrService
  ]
})
export class PhytosanitaryExportModule { }
