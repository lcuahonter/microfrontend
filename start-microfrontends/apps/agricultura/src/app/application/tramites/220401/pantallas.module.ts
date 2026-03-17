import { BtnContinuarComponent, CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgregarDestinatoriaComponent } from './components/agregar-destinatoria/agregar-destinatoria.component';
import { CombinacionRequeridaComponent } from './components/combinacion-requerida/combinacion-requerida.component';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosDelCertificadoComponent } from './components/datos-del-certificado/datos-del-certificado.component';
import { DatosGeneralesAnimalesComponent } from './components/datos-generales-animales/datos-generales-animales.component';
import { NavComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { PagoDeDerechoComponent } from './components/pago-de-derecho/pago-de-derecho.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PantallasRoutingModule } from './pantallas-routing.module';
import { PasoDosComponent } from './components/paso-dos/paso-dos.component';
import { PasoTresComponent } from './components/paso-tres/paso-tres.component';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { SolicitudPantallasComponent } from './components/solicitud/solicitud.component';
import { TercerosRelacionadosComponent } from './components/terceros-relacionados/terceros-relacionados.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { TransporteComponent } from './pages/transporte/transporte.component';
import { WizardComponent } from '@ng-mf/data-access-user';

import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';


@NgModule({
  declarations: [ 
    PantallasComponent,
    DatosComponent,
    TransporteComponent,
    ],
  imports: [
    CatalogoSelectComponent,
    CommonModule,
    PagoDeDerechoComponent,
    PantallasRoutingModule,    
    NavComponent,
    WizardComponent,
    TituloComponent,
    BtnContinuarComponent,
    SolicitudPantallasComponent,   
    FormsModule,
    ReactiveFormsModule,
    CombinacionRequeridaComponent,
    TercerosRelacionadosComponent,
    AgregarDestinatoriaComponent,
    DatosGeneralesAnimalesComponent,    
    DatosDelCertificadoComponent,
   SolicitanteComponent,
   PasoDosComponent,
   PasoTresComponent
  ],
  
  providers: [
      provideHttpClient(),
      ToastrService
      
    ],
})
/**
 * Este módulo se utiliza para configurar los componentes del módulo 220401.
 * Importar los componentes del módulo.
 */
export class PantallasModule { }
