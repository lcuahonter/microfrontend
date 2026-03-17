import { AlertComponent, BtnContinuarComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, WizardComponent } from'@libs/shared/data-access-user/src';
import { CatalogoSelectComponent, TablaDinamicaComponent, TituloComponent } from '@ng-mf/data-access-user';
import { AvisoDePrivacidadComponent } from '../../shared/components/aviso-de-privacidad/aviso-de-privacidad.component';
import { CommonModule } from '@angular/common';
import { DatosDelSolicitudModificacionComponent } from '../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { DatosEmpresaComponent } from './component/datos-empresa/datos-empresa.component';
import { DomicilioDelEstablecimientoComponent } from './component/domicilio-del-establecimiento/domicilio-del-establecimiento.component';
import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { ManifiestosComponent } from '../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechosComponent } from './component/pago-de-derechos/pago-de-derechos.component';
import { PagoDeDerechosContenedoraComponent } from './component/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoSanitarioComponent } from './pages/permiso-sanitario/permiso-sanitario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroComoEmpresaRoutingModule } from './mod-permiso-importacion-routing.module';
import { RepresentanteLegalComponent } from '../../shared/components/representante-legal/representante-legal.component';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';
import { TercerosRelacionadosVistaComponent } from './component/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { ToastrService } from 'ngx-toastr';
import { TramitesAsociadoComponent } from './component/tramites-asociado/tramites-asociado.component';
import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';


@NgModule({
  declarations: [PermisoSanitarioComponent, PasoUnoComponent],
  imports: [
    CommonModule, 
    RegistroComoEmpresaRoutingModule,
    WizardComponent,
    SolicitanteComponent,
    DatosEmpresaComponent,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    BtnContinuarComponent,
    TablaDinamicaComponent,
    PasoDosComponent,
    PasoTresComponent,
    AlertComponent,
    PagoDeDerechosComponent,
    TramitesAsociadoComponent,
    DomicilioDelEstablecimientoComponent,
    TercerosRelacionadosVistaComponent,
    PagoDeDerechosContenedoraComponent,
    NotificacionesComponent,
    AvisoDePrivacidadComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    DatosDelSolicitudModificacionComponent,
    ManifiestosComponent,
    RepresentanteLegalComponent,
    TramitesAsociadosSeccionComponent
  ],
  providers:[ToastrService, InicioSesionService, SubirDocumentoService]
})
export class ModPermisoImportacionModule {}
