import { AlertComponent, TercerosComponent } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AcuicolaComponent } from './pages/acuicola/acuicola.component';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { CrosslistComponent } from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudComponent } from './components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { ExportaccionAcuicolaRoutingModule } from './exportaccion-acuicola-routing.module';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { InputCheckComponent } from '@ng-mf/data-access-user';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { InputHoraComponent } from '@ng-mf/data-access-user';
import { InputRadioComponent } from "@ng-mf/data-access-user";
import { NavComponent } from '@ng-mf/data-access-user';
import { PagoDeDerechosComponent } from './components/pago-de-derechos/pago-de-derechos.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentanteFiscalComponent } from '@ng-mf/data-access-user';
import { RouterModule } from '@angular/router';
import { SelectPaisesComponent } from '@ng-mf/data-access-user';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent } from "@ng-mf/data-access-user";
import { TituloComponent } from '@ng-mf/data-access-user';
import { TransporteComponent } from './components/transporte/transporte.component';
import { WizardComponent } from '@ng-mf/data-access-user';



@NgModule({
  declarations: [
    AcuicolaComponent,
    PasoDosComponent,
    PasoTresComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ExportaccionAcuicolaRoutingModule,
    RouterModule,
    NavComponent,
    WizardComponent,
    TituloComponent,
    BtnContinuarComponent,
    ReactiveFormsModule,
    AlertComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    AnexarDocumentosComponent,
    InputCheckComponent,
    InputHoraComponent,
    InputFechaComponent,
    CrosslistComponent,
    RepresentanteFiscalComponent,
    SelectPaisesComponent,
    CatalogoSelectComponent,
    TercerosComponent,
    ToastrModule.forRoot(),
    InputRadioComponent,
    TablaDinamicaComponent,
    TransporteComponent,
    DatosDeLaSolicitudComponent,
    PagoDeDerechosComponent,
    PasoUnoComponent,
],
  providers:[ToastrService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ExportaccionAcuicolaModule { }