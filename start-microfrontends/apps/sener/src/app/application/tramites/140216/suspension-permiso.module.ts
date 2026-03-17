import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogosService, FirmaElectronicaComponent, InicioSesionService, SubirDocumentoService, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { BusquedaPermisosComponent } from './components/busqueda-permisos/busqueda-permisos.component';
import { DatosComponent } from './pages/datos/datos.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from '../../shared/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../../shared/paso-tres/paso-tres.component';
import { SuspensionPermisoRoutingModule } from './suspension-permiso-routing.module';


@NgModule({
  declarations: [
    PantallasComponent,
    DatosComponent    
  ],
  imports: [
    CommonModule,
    SuspensionPermisoRoutingModule,
    BusquedaPermisosComponent,
    WizardComponent,
    BtnContinuarComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    TituloComponent,
    FirmaElectronicaComponent,
    PasoDosComponent,
    PasoTresComponent
  ],
  providers: [
    ToastrService,
    InicioSesionService,
    SubirDocumentoService,
    CatalogosService
  ],
})
export class SuspensionPermisoModule { }
