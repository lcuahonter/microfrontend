import { AlertComponent, BtnContinuarComponent, FirmaElectronicaComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { BienFinalComponent } from './components/bien-final/bien-final.component';
import { CommonModule } from '@angular/common';
import { ConsultarCupoComponent } from './components/consultar-cupo/consultar-cupo.component';
import { DatosGeneralesComponent } from './components/datos-generales/datos-generales.component';
import { DescripcionDelCupoComponent } from './components/descripcion-del-cupo/descripcion-del-cupo.component';
import { DomicilioFiscalComponent } from './components/domicilio-fiscal/domicilio-fiscal.component';
import { InsumosComponent } from './components/insumos/insumos.component';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ProcesoProductivoComponent } from './components/proceso-productivo/proceso-productivo.component';
import { RepresentacionFederalComponent } from './components/representacion-federal/representacion-federal.component';
import { ServicioDeFormularioService } from './services/forma-servicio/servicio-de-formulario.service';
import { SolicitudDeRegistroTplRoutingModule } from './solicitud-de-registro-tpl-routing.module';
//import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    PantallasComponent,
    PasoUnoComponent,
    PasoDosComponent
  ],
  imports: [
    CommonModule,
    SolicitudDeRegistroTplRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    DatosGeneralesComponent,
    DomicilioFiscalComponent,
    ConsultarCupoComponent,
    AlertComponent,
    DescripcionDelCupoComponent,
    RepresentacionFederalComponent,
    BienFinalComponent,
    FirmaElectronicaComponent,
    InsumosComponent,
    ProcesoProductivoComponent,
    PasoFirmaComponent
  ],
  providers: [ServicioDeFormularioService,
    //provideHttpClient()
  ],
})
export class SolicitudDeRegistroTplModule { }
