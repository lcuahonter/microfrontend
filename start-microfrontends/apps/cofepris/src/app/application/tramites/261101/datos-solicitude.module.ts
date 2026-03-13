
import { AlertComponent, NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { AvisoDePrivacidadComponent } from '../../shared/components/aviso-de-privacidad/aviso-de-privacidad.component';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosSolicitudComponent } from './components/datos-solicitude/datos-solicitud.component';
import { DatosSolicitudeRoutingModule } from './datos-solicitude-routing.module';
import { ManifiestosComponent } from '../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechosComponent } from '../../shared/components/pago-de-derechos-new/pago-de-derechos.component';
import { PagoDeDerechosContenedoraComponent} from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoCargaDocumentoComponent } from '@ng-mf/data-access-user';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentanteLegalComponent } from '../../shared/components/representante-legal/representante-legal.component';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TercerosRelacionadosComponent } from '../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { TercerosRelacionadosFabricanteComponent } from './components/terceros-relacionados-fabricante/terceros-relacionados-fabricante.component';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';
// import { TramiteAsociadosComponent } from '../../shared/components/tramite-asociados/tramite-asociados.component';
import { WizardComponent } from '@ng-mf/data-access-user';




@NgModule({
  declarations: [DatosComponent, PasoUnoComponent],
  imports: [
    AvisoDePrivacidadComponent,
    CommonModule,
    DatosSolicitudeRoutingModule,
    WizardComponent,
    SolicitanteComponent,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    RepresentanteLegalComponent,
    BtnContinuarComponent,
    TablaDinamicaComponent,
    PasoDosComponent,
    PasoTresComponent,
    AlertComponent,
    DatosSolicitudComponent,
    TercerosRelacionadosFabricanteComponent,
    PagoDeDerechosComponent,
    TercerosRelacionadosComponent,
    TramitesAsociadosSeccionComponent,
    ManifiestosComponent,
    PasoFirmaComponent,
    NotificacionesComponent,
    PasoCargaDocumentoComponent,
    PagoDeDerechosContenedoraComponent,
],
})
export class DatosSolicitudeModule {}
