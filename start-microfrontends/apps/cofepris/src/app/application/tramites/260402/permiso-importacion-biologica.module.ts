import { CommonModule } from '@angular/common';

import { BtnContinuarComponent, NotificacionesComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';

import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

import { NgModule } from '@angular/core';

import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';

import { EntradaHumanaRoutingModule } from './permiso-importacion-biologica-routing.module';

import { Datos260402Component } from './pages/datos-260402/datos-260402.component';
import { PermisoImportacionBiologicaComponent } from './pages/permiso-importacion-biologica/permiso-importacion-biologica.component';
import { TercerosRelacionadosProcedenciaComponent } from '../../shared/components/terceros-relacionados-procedencia/terceros-relacionados-procedencia.component';



import { DatosGeneralesComponent } from '../../shared/components/datos-generales/datos-generales.component';
import { PasoDosComponent } from './components/paso-dos/paso-dos.component';
import { PasoTresComponent } from './components/paso-tres/paso-tres.component';
import { TercerosProcedenciaService } from '../../shared/services/terceros-procedencia.service';

import { PagoDeDerechosEntradaService } from '../../shared/services/pago-de-derechos-entrada.service';

import { PagoDeDerechosBancoComponent } from "../../shared/components/pago-de-derechos-banco/pago-de-derechos-banco.component";
import { PagoDeDerechosEntradaComponent } from '../../shared/components/pago-de-derechos-entrada/pago-de-derechos-entrada.component';
import { PropietarioComponent } from '../../shared/components/propietario/propietario.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';

import { PasoCargaDocumentoComponent } from '@libs/shared/data-access-user/src';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';

@NgModule({
  declarations: [Datos260402Component,PermisoImportacionBiologicaComponent
  ],
  imports: [
    CommonModule,
    EntradaHumanaRoutingModule,
    WizardComponent,
    TituloComponent,
    SolicitanteComponent,
    PasoDosComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    TercerosRelacionadosProcedenciaComponent,
    DatosGeneralesComponent,
    PagoDeDerechosEntradaComponent,
    PropietarioComponent,
    PagoDeDerechosBancoComponent,
    SolicitanteComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    NotificacionesComponent
],
  providers: [provideHttpClient(), ToastrService,PagoDeDerechosEntradaService,TercerosProcedenciaService,InicioSesionService,SubirDocumentoService ],
})
export class EntradaHumanaModule { }
