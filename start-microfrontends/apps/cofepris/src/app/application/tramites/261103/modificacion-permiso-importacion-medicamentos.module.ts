
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { BtnContinuarComponent } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { ModificacionPermisoImportacionMedicamentosComponent } from './components/modificacion-permiso-importacion-medicamentos/modificacion-permiso-importacion-medicamentos';
import { ModificacionPermisoImportacionMedicamentosRoutingModule } from './modificacion-permiso-importacion-medicamentos-routing.module';
import { NgModule } from '@angular/core';
import { PagoDeDerechosComponent } from '../../shared/components/pago-de-derechos-new/pago-de-derechos.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TercerosRelacionadosComponent } from '../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { TercerosRelacionadosVistaComponent } from './components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { WizardComponent } from '@libs/shared/data-access-user/src';

import{TramitesAsociadosSeccionComponent} from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

import { PagoDeDerechosContenedoraComponent } from './components/pago-de-derechos/pago-de-derechos.component';
import { TramiteAsociadosComponent } from '../../shared/components/tramite-asociados/tramite-asociados.component';

import { PasoCargaDocumentoComponent } from '@libs/shared/data-access-user/src'; 
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';

import { NotificacionesComponent } from '@libs/shared/data-access-user/src';

import { ContenedorDeDatosSolicitudComponent } from './components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';

@NgModule({
  declarations: [DatosComponent, PasoUnoComponent],
  imports: [
    CommonModule,
    WizardComponent,
    SolicitanteComponent,
    ContenedorDeDatosSolicitudComponent,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    BtnContinuarComponent,
    TablaDinamicaComponent,
    PasoDosComponent,
    PasoTresComponent,
    AlertComponent,
    ModificacionPermisoImportacionMedicamentosComponent,
    TercerosRelacionadosVistaComponent,
    PagoDeDerechosComponent,
    TercerosRelacionadosComponent,
    TramitesAsociadosSeccionComponent,
    TramiteAsociadosComponent,
    PagoDeDerechosContenedoraComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    NotificacionesComponent,
    ModificacionPermisoImportacionMedicamentosRoutingModule
],
})
export class ModificacionPermisoImportacionModule {}
