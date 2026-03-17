import { AlertComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule} from '@angular/router';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';

import { TipoDeAvisoComponent } from './components/tipo-de-aviso/tipo-de-aviso.component';

import { ActaDeHechosRoutingModule } from './acta-de-hechos-routing.module';

/**
 * Módulo para el manejo del Acta de Hechos.
 * Este módulo incluye componentes, servicios y configuraciones necesarias
 * para gestionar el flujo del trámite de Acta de Hechos.
 */
@NgModule({
  /**
   * Declaraciones de los componentes utilizados en este módulo.
   * Incluye las páginas y componentes específicos del flujo del Acta de Hechos.
   */
  declarations: [
    PasoDosComponent,
    PasoTresComponent,  
    PasoUnoComponent,
    SolicitudPageComponent,
  ],

  /**
   * Módulos importados necesarios para el funcionamiento del módulo.
   * Incluye módulos compartidos, enrutamiento y componentes reutilizables.
   */
  imports: [
    CommonModule,
    ActaDeHechosRoutingModule,
    WizardComponent,
    SharedModule,
    BtnContinuarComponent,
    ReactiveFormsModule,
    TituloComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    SolicitanteComponent,
    TipoDeAvisoComponent,
  ],

  /**
   * Exportaciones del módulo.
   * Incluye el módulo de enrutamiento para que pueda ser utilizado en otros módulos.
   */
  exports:[RouterModule],

  /**
   * Proveedores de servicios utilizados en este módulo.
   * Incluye servicios como ToastrService para notificaciones.
   */
  providers: [ToastrService],
})
export class ActaDeHechosModule { }
