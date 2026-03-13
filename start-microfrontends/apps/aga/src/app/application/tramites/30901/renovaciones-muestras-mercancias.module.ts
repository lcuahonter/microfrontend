import { AlertComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosProrrogaMuestrasMercanciasComponent } from './components/datos-prorroga-muestras-mercancias/datos-prorroga-muestras-mercancias.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FormsModule } from '@angular/forms';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { NotificacionesComponent } from '@ng-mf/data-access-user';
import { PagoLineaDeCapturaComponent } from './components/pago-linea-de-captura/pago-linea-de-captura.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroRenovacionesMuestrasMercanciasComponent } from './components/registro-renovaciones-muestras-mercancias/registro-renovaciones-muestras-mercancias.component';
import { RenovacionesComponent } from './pages/renovaciones/renovaciones.component';
import { RenovacionesMuestrasMercanciasRoutingModule } from './renovaciones-muestras-mercancias-routing.module';
import { RenovacionesMuestrasMercanciasService } from './services/renovaciones-muestras-mercancias/renovaciones-muestras-mercancias.service';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TableComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RenovacionesMuestrasMercanciasRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    FirmaElectronicaComponent,
    TituloComponent,
    FormsModule,
    TableComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
    TablaDinamicaComponent,
    ToastrModule.forRoot(),
    NotificacionesComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    RenovacionesComponent,
    RegistroRenovacionesMuestrasMercanciasComponent,
    PagoLineaDeCapturaComponent,
    DatosProrrogaMuestrasMercanciasComponent,
  ],
  exports: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    RegistroRenovacionesMuestrasMercanciasComponent,
    PagoLineaDeCapturaComponent,
    DatosProrrogaMuestrasMercanciasComponent,
  ],
  providers: [
    RenovacionesMuestrasMercanciasService,
    ToastrService,
    BsModalService,
  ],
})
export class RenovacionesMuestrasMercanciasModule {}
