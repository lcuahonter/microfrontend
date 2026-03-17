import { CommonModule } from '@angular/common';

import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { ImportarSuministrosMedicosComponent } from './pages/importar-suministros-medicos/importar-suministros-medicos.component';

import { Datos260916Component } from './pages/datos-260916/datos-260916.component';

import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

import { NgModule } from '@angular/core';

import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';

import { ImportarSuministrosMedicosRoutingModule } from './importar-suministros-medicos-routing.module';
import { PagoDeDerechosBancoComponent } from '../../shared/components/pago-de-derechos-banco/pago-de-derechos-banco.component';

import { DatosDelSolicitudModificacionComponent } from '../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

import { TercerosRelacionadosFabricanteComponent } from '../../shared/components/terceros-relacionados-fabricante/terceros-relacionados-fabricante.component';

import { PagoDeDerechosEntradaComponent } from '../../shared/components/pago-de-derechos-entrada/pago-de-derechos-entrada.component';


@NgModule({
  declarations: [ImportarSuministrosMedicosComponent,
    Datos260916Component,
    PasoDosComponent,
    PasoTresComponent,
  ],
  imports: [
    CommonModule,
    ImportarSuministrosMedicosRoutingModule,
    WizardComponent,
    TituloComponent,
    SolicitanteComponent,
    BtnContinuarComponent,
    PagoDeDerechosBancoComponent,
    DatosDelSolicitudModificacionComponent,
    TramitesAsociadosSeccionComponent,
    TercerosRelacionadosFabricanteComponent,
    PagoDeDerechosEntradaComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent, 
    AlertComponent,
  ],
  providers: [provideHttpClient(), ToastrService,InicioSesionService,SubirDocumentoService ],
})
export class ImportarSuministrosMedicosModule { }
