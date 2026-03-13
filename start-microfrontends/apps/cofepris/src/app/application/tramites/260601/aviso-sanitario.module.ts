import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogosService, FirmaElectronicaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { AvisoSanitarioRoutingModule } from './aviso-sanitario-routing.module';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    AvisoSanitarioRoutingModule,
    SolicitanteComponent,
    FirmaElectronicaComponent,
    WizardComponent,
    BtnContinuarComponent,
    AnexarDocumentosComponent,
    TituloComponent,
    AlertComponent,
    DatosComponent,
    PantallasComponent,
  ],
  providers: [
    ToastrService,
    InicioSesionService,
    SubirDocumentoService,
    CatalogosService
  ],
  exports: []
})
export class AvisoSanitarioModule { }
