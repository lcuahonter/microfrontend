import { CommonModule } from '@angular/common';

import { NgModule, forwardRef } from '@angular/core';
import { AcuseReciboComponent } from '../../shared/components/acuse-recibo/acuse-recibo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import {
  AgregarTransporteComponent,
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CatalogoSelectComponent,
  CatalogosService,
  CrosslistComponent,
  FirmaElectronicaComponent,
  InputCheckComponent,
  InputFechaComponent,
  InputHoraComponent,
  NotificacionesComponent,
  RepresentanteFiscalComponent,
  SelectPaisesComponent,
  SharedModule,
  TablaDinamicaComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';

import { Chofer40103Service } from './estados/chofer40103.service';
import { ModificarCaatTerrestreRoutingModule } from './modificarCaatTerrestre-routing.module';

import { ChoferesComponent } from './components/choferes/choferes.component';
import { DirectorGeneralComponent } from './components/director-general/director-general.component';
import { SolicitanteComponent } from './components/solicitante/solicitante.component';
import { VehiculosModule } from './components/vehiculos/vehiculos.module';

import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';

@NgModule({
  declarations: [
    SolicitantePageComponent,
    PasoUnoComponent,
    PasoDosComponent,
    DirectorGeneralComponent,
    SolicitanteComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModificarCaatTerrestreRoutingModule,
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
    forwardRef(() => NotificacionesComponent),
    ChoferesComponent,
    TablaDinamicaComponent,
    AcuseReciboComponent,
    VehiculosModule
  ],
  exports: [
    PasoUnoComponent,
    PasoDosComponent,
  ],
  providers: [ToastrService, CatalogosService, Chofer40103Service],
})
export class ModificarCaatTerrestreModule { }
