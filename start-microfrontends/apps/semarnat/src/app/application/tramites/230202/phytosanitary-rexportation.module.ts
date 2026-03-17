import { 
  AlertComponent, 
  AnexarDocumentosComponent, 
  BtnContinuarComponent, 
  CatalogoSelectComponent, 
  CrosslistComponent, 
  FirmaElectronicaComponent, 
  SolicitanteComponent, 
  TablaDinamicaComponent, 
  TituloComponent, 
  WizardComponent 
} from '@libs/shared/data-access-user/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PhytosanitaryRexportationRoutingModule } from './phytosanitary-rexportation-routing.module';



@NgModule({
  declarations: [ ], 
  imports: [
    CommonModule,
    TituloComponent,
    PhytosanitaryRexportationRoutingModule,
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
  providers:[ToastrService]
})
export class PhytosanitaryRexportationModule { }
