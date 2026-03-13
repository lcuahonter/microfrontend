import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from '../../shared/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../../shared/paso-tres/paso-tres.component';
import { PermisoRenunciaDeDerechosComponent } from './components/permiso-renuncia-de-derechos/permiso-renuncia-de-derechos.component';
import { provideHttpClient } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import { RenunciaDeDerechosDeComponent } from './pages/renuncia-de-derechos-de/renuncia-de-derechos-de.component';
import { RenunciaDeDerechosDePermisosComponent } from './pages/renuncia-de-derechos-de-permisos/renuncia-de-derechos-de-permisos.component';
import { RenunciaDeDerechosDeRoutingModule } from './renuncia-de-derechos-de-routing.module';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';

@NgModule({
  declarations: [
    DatosComponent,
    RenunciaDeDerechosDePermisosComponent,
    RenunciaDeDerechosDeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RenunciaDeDerechosDeRoutingModule,
    WizardComponent,
    SolicitanteComponent,
    BtnContinuarComponent,
    PermisoRenunciaDeDerechosComponent,
    PasoDosComponent,
    PasoTresComponent,
  ],
  providers: [provideHttpClient(), ToastrService],
})
export class RenunciaDeDerechosDeModule {}
