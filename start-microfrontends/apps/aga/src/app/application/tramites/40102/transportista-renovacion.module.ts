import { AgregarTransporteComponent, CatalogosService } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent, TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { AlertComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { Chofer40102Service } from './estados/chofer40102.service';
import { ChoferesComponent } from './components/choferes/choferes.component';
import { CommonModule } from '@angular/common';
import { CrosslistComponent } from '@ng-mf/data-access-user';
import { DirectorGeneralComponent } from './components/director-general/director-general.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { InputCheckComponent } from '@ng-mf/data-access-user';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { InputHoraComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentanteFiscalComponent } from '@ng-mf/data-access-user';
import { RouterModule } from '@angular/router';
import { SelectPaisesComponent } from '@ng-mf/data-access-user';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from './components/solicitante/solicitante.component';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { TransportistaRenovacionRoutingModule } from './transportista-renovacion-routing.module';
import { VehiculosComponent } from './components/vehiculos/vehiculos.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { forwardRef } from '@angular/core';
import { AcuseReciboComponent } from '../../shared/components/acuse-recibo/acuse-recibo.component';
@NgModule({
  declarations: [
    SolicitantePageComponent,
    PasoUnoComponent,
    PasoDosComponent,
    VehiculosComponent,
    DirectorGeneralComponent,
    SolicitanteComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TransportistaRenovacionRoutingModule,
    RouterModule,
    WizardComponent,
    forwardRef(() => TituloComponent),
    forwardRef(() => BtnContinuarComponent),
    ReactiveFormsModule,
    forwardRef(() => AlertComponent),
    forwardRef(() => FirmaElectronicaComponent),
    forwardRef(() => AnexarDocumentosComponent),
    forwardRef(() => InputCheckComponent),
    forwardRef(() => InputFechaComponent),
    forwardRef(() => InputHoraComponent),
    forwardRef(() => CrosslistComponent),
    forwardRef(() => AgregarTransporteComponent),
    forwardRef(() => RepresentanteFiscalComponent),
    forwardRef(() => SelectPaisesComponent),
    forwardRef(() => CatalogoSelectComponent),
    ChoferesComponent,
    TablaDinamicaComponent,
    AcuseReciboComponent
  ],
  exports: [
    PasoUnoComponent,
    PasoDosComponent,

  ],
  providers: [ToastrService, CatalogosService, Chofer40102Service],
})
export class TransportistaRenovacionModule { }
