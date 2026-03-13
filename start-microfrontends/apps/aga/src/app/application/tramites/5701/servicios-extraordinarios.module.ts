import {
  AgregarTransporteComponent,
  CargaDocumentoComponent,
  CatalogosService,
  InputRadioComponent,
  NotificacionesComponent,
  PaginadorTablaComponent,
  SoloNumerosDirective,
  TablaDinamicaComponent,
  TablePaginationComponent,
  TransporteComponent,
  UppercaseDirective,
} from '@ng-mf/data-access-user';
import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CatalogoSelectComponent,
  CrosslistComponent,
  FirmaElectronicaComponent,
  InputCheckComponent,
  InputFechaComponent,
  InputHoraComponent,
  NavComponent,
  RepresentanteFiscalComponent,
  SelectPaisesComponent,
  SolicitanteComponent,
  TercerosComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { NgModule, forwardRef } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { AgregaPersonasComponent } from './components/agrega-personas/agrega-personas.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CheckInputTextComponent } from '../../shared/components/check-input-text/check-input-text.component';
import { AcuseReciboComponent } from '../../shared/components/acuse-recibo/acuse-recibo.component';
import { CommonModule } from '@angular/common';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PedimentoComponent } from './components/pedimento/pedimento.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ServiciosExtraordinariosRoutingModule } from './servicios-extraordinarios-routing.module';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
@NgModule({
  declarations: [
    SolicitudPageComponent,
    SolicitudComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
  ],
  imports: [
    CheckInputTextComponent,
    forwardRef(() => TercerosComponent),
    forwardRef(() => AgregaPersonasComponent),
    forwardRef(() => AgregarTransporteComponent),
    forwardRef(() => AlertComponent),
    forwardRef(() => AnexarDocumentosComponent),
    forwardRef(() => BtnContinuarComponent),
    forwardRef(() => CatalogoSelectComponent),
    CommonModule,
    forwardRef(() => CrosslistComponent),
    forwardRef(() => FirmaElectronicaComponent),
    forwardRef(() => InputCheckComponent),
    forwardRef(() => InputFechaComponent),
    forwardRef(() => InputHoraComponent),
    forwardRef(() => NavComponent),
    forwardRef(() => NotificacionesComponent),
    forwardRef(() => PedimentoComponent),
    ReactiveFormsModule,
    forwardRef(() => RepresentanteFiscalComponent),
    RouterModule,
    forwardRef(() => SelectPaisesComponent),
    ServiciosExtraordinariosRoutingModule,
    forwardRef(() => SolicitanteComponent),
    forwardRef(() => TituloComponent),
    forwardRef(() => WizardComponent),
    forwardRef(() => UppercaseDirective),
    forwardRef(() => InputRadioComponent),
    forwardRef(() => NotificacionesComponent),
    forwardRef(() => CargaDocumentoComponent),
    forwardRef(() => TransporteComponent),
    forwardRef(() => TablaDinamicaComponent),
    forwardRef(() => SoloNumerosDirective),
    forwardRef(() => TablePaginationComponent),
    forwardRef(() => PaginadorTablaComponent),
    ToastrModule.forRoot(),
    PasoFirmaComponent
  ],
  exports: [PasoUnoComponent],
  providers: [ToastrService, CatalogosService, BsModalService],
})
export class ServiciosExtraordinariosModule { }
