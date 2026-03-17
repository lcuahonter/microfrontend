import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { AlertComponent, BtnContinuarComponent, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { DatosDeLaSolicitudComponent } from '../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosDelSolicitudModificacionComponent } from '../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { ModificacionPermisoSanitarioLaSaludComponent } from './pages/modificacion-permiso-sanitario-la-salud/modificacion-permiso-sanitario-la-salud.component';
import { ModificacionPermisoSanitarioLaSaludRoutingModule } from './modificacion-permiso-sanitario-la-salud-routing.module';

import { NgModule } from '@angular/core';
import { PagoDeDerechosEntradaComponent } from '../../shared/components/pago-de-derechos-entrada/pago-de-derechos-entrada.component';
import { PasoDosComponent } from '../../shared/components/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../../shared/components/paso-tres/paso-tres.component';
import { PasoUnoPagesComponent } from './pages/paso-uno-pages/paso-uno-pages.component';

import { TercerosRelacionadosFebService } from '../../shared/services/tereceros-relacionados-feb.service';

import { TercerosRelacionadosFabSeccionComponent } from '../../shared/components/terceros-relacionados-fab-seccion/terceros-relacionados-fab-seccion.component';
import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

@NgModule({
  declarations: [PasoUnoPagesComponent,ModificacionPermisoSanitarioLaSaludComponent],
  imports: [ 
    WizardComponent,
      BtnContinuarComponent,
      CommonModule,
      FormsModule,
      SolicitanteComponent,
      DatosDeLaSolicitudComponent,
      DatosDelSolicitudModificacionComponent,
      TramitesAsociadosSeccionComponent,
      PagoDeDerechosEntradaComponent,
      AlertComponent,
      TercerosRelacionadosFabSeccionComponent,
      PasoDosComponent,
      PasoTresComponent,
      ModificacionPermisoSanitarioLaSaludRoutingModule],
       providers: [provideHttpClient(), ToastrService,TercerosRelacionadosFebService]
})
export class ModificacionPermisoSanitarioLaSaludModule {}
