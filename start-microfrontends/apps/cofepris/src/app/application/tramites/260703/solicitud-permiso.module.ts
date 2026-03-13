import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CatalogoSelectComponent,
  FirmaElectronicaComponent,
  InputRadioComponent,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  SolicitanteComponent,
  TablaDinamicaComponent,
  TableComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DatosComponent } from './pages/datos/datos.component';
import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudPermisoRoutingModule } from './solicitud-permiso-routing.module';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';

import { DatosdelasolicitudComponent } from '../../shared/components/shared2607/datos-del/datos-de-la-solicitud.component';
import { PagoDeDerechoComponent } from '../../shared/components/shared2607/pagodederechos/pago-de-derecho.component';
import { TercerosrelacionadosComponent } from '../../shared/components/shared2607/terceros relacionados/terceros-relacionados.component';
import { TramitesAsociadosComponent } from '../../shared/components/shared2607/tramitesasociados/tramites-asociados.component';


@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    DatosComponent,

  ],
  imports: [
    CommonModule,
    SolicitudPermisoRoutingModule,
    WizardComponent,
    SolicitanteComponent,
    TituloComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    BtnContinuarComponent,
    TablaDinamicaComponent,
    AlertComponent,
  
    TableComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    NotificacionesComponent,

    DatosdelasolicitudComponent,
    PagoDeDerechoComponent,
    TercerosrelacionadosComponent,
    TramitesAsociadosComponent,

    ToastrModule.forRoot(),
      PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  ],
  providers: [ToastrService, InicioSesionService, SubirDocumentoService],
})
export class SolicitudPermisoModule {}
