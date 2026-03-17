import { BtnContinuarComponent, InicioSesionService, SubirDocumentoService } from '@libs/shared/data-access-user/src';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { AnexarDocumentosComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosDeLaSolicitudModificacionComponent } from '../../shared/components/datos-de-la-solicitud-modificacion/datos-de-la-solicitud-modificacion.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { InputCheckComponent } from '@libs/shared/data-access-user/src';
import { ModificacionDelPermisoRoutingModule } from './modificacion-del-permiso-routing.module';
import { NgModule } from '@angular/core';
import { PagoDeDerechosEntradaComponent } from '../../shared/components/pago-de-derechos-entrada/pago-de-derechos-entrada.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { TercerosRelacionadosFabricanteComponent } from '../../shared/components/terceros-relacionados-fabricante/terceros-relacionados-fabricante.component';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { ToastrService } from 'ngx-toastr';
import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';

@NgModule({
  declarations: [
    DatosComponent,
    PantallasComponent,
    PasoDosComponent,
    PasoTresComponent,
  ],
  imports: [
    CommonModule,
    ModificacionDelPermisoRoutingModule,
    BtnContinuarComponent,
    WizardComponent,
   
    SolicitanteComponent,
    PagoDeDerechosEntradaComponent,
    TramitesAsociadosSeccionComponent,
    TercerosRelacionadosFabricanteComponent,
    InputCheckComponent,
    DatosDeLaSolicitudModificacionComponent,
    TituloComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    FirmaElectronicaComponent
  ],
  providers: [
    ToastrService,
    InicioSesionService,
    SubirDocumentoService,
  ],
})
export class ModificacionDelPermisoModule { }
