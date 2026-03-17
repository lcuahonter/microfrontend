import { AlertComponent, BtnContinuarComponent, InputCheckComponent, 
   PasoCargaDocumentoComponent,PasoFirmaComponent,SolicitanteComponent, TituloComponent, WizardComponent,
   } from '@libs/shared/data-access-user/src';
import { CancelacionComponent } from './components/cancelacion/cancelacion.component';
import { CancelacionPeticionRoutingModule } from './cancelacion-peticion-routing.module';
import { CommonModule } from '@angular/common';
import { ManifiestosDeclaracionesComponent } from './components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoCancelarComponent } from './components/permiso-cancelar/permiso-cancelar.component';
import { PermisoSanitarioModule } from '../260211/permiso-sanitario.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentanteLegalComponent } from './components/representante-legal/representante-legal.component';
import { TramiteAsociadosComponent } from '../../shared/components/tramite-asociados/tramite-asociados.component';


@NgModule({
  declarations: [
    PantallasComponent,
    PasoUnoComponent,
    CancelacionComponent,
    ManifiestosDeclaracionesComponent
  ],
  imports: [
    CommonModule,
    CancelacionPeticionRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    TituloComponent,
    SolicitanteComponent,
    AlertComponent,
    PermisoSanitarioModule,
    PermisoCancelarComponent,
    RepresentanteLegalComponent,
    TramiteAsociadosComponent,
    InputCheckComponent,
    ReactiveFormsModule,
     PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  ]
})
export class CancelacionPeticionModule { }
