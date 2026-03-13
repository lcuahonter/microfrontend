import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BtnContinuarComponent, NotificacionesComponent, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';

import { PagoDeDerechosEntradaComponent } from '../../shared/components/pago-de-derechos-entrada/pago-de-derechos-entrada.component';
import { PagoDeDerechosEntradaService } from '../../shared/services/pago-de-derechos-entrada.service';
import { PropietarioComponent } from '../../shared/components/propietario/propietario.component';
import { TercerosProcedenciaService } from '../../shared/services/terceros-procedencia.service';
import { TercerosRelacionadosProcedenciaComponent } from '../../shared/components/terceros-relacionados-procedencia/terceros-relacionados-procedencia.component';

import { DatosTerritorioComponent } from './pages/datos-territorio.component/datos-territorio.component';
import { PasoDosComponent } from './components/paso-dos/paso-dos.component';
import { PasoTresComponent } from './components/paso-tres/paso-tres.component';
import { TerritorioNacionalSolicitudeComponent } from './pages/territorio-nacional-solicitude/territorio-nacional-solicitude.component';
import { TerritorioNacionalSolicitudeRoutingModule } from './territorio-nacional-solicitude-routing.module';
import { ToastrService } from 'ngx-toastr';

import { PasoCargaDocumentoComponent } from '@ng-mf/data-access-user';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';


@NgModule({
  declarations: [
    TerritorioNacionalSolicitudeComponent,
    DatosTerritorioComponent,
  ],
  imports: [
    WizardComponent,
    BtnContinuarComponent,
    CommonModule,
    FormsModule,
    TerritorioNacionalSolicitudeRoutingModule,
    PropietarioComponent,
    PagoDeDerechosEntradaComponent,
    TercerosRelacionadosProcedenciaComponent,
    PasoTresComponent,PasoDosComponent,
    SolicitanteComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    NotificacionesComponent
  ],
  providers: [PagoDeDerechosEntradaService,TercerosProcedenciaService,ToastrService ],
})
export class TerritorioNacionalSolicitudeModule {}
