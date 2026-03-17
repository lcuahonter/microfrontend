import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent, WizardComponent } from '@ng-mf/data-access-user';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AduaneroComponent } from '../components/aduanero/aduanero.component';
import { AnexarRequisitosComponent } from '../components/anexar-requisitos/anexar-requisitos.component';
import { AntecesorRoutingModule } from './antecesor-routing.module';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CapturarIvaeiepsComponent } from '../components/capturar-ivaeieps/capturar-ivaeieps.component';
import { CommonModule } from '@angular/common';
import { DatosComponent } from '../pages/datos/datos.component';
import { DatosPorRegimenComponent } from '../components/datos-por-regimen/datos-por-regimen.component';
import { EnlaceComponent } from '../components/enlace/enlace.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FirmarSolicitudComponent } from '../pages/firmar-solicitud/firmar-solicitud.component';
import { NavComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { PantallasComponent } from '../pages/pantallas/pantallas.component';
import { PersonaComponent } from '../components/persona/persona.component';
import { ReprestantanteComponent } from '../components/represtantante/represtantante.component';
import { RequisitosComponent } from '../components/requisitos/requisitos.component';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { Solocitud31601Service } from '../services/service31601.service';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [DatosComponent, PantallasComponent, FirmarSolicitudComponent],
  imports: [
    CommonModule,
    AntecesorRoutingModule,
    WizardComponent,
    NavComponent,
    ReprestantanteComponent,
    EnlaceComponent,
    PersonaComponent,
    SolicitanteComponent,
    NavComponent,
    AduaneroComponent,
    FormsModule,
    ReactiveFormsModule,
    CapturarIvaeiepsComponent,
    AnexarRequisitosComponent,
    DatosPorRegimenComponent,
    ReactiveFormsModule,
    FormsModule,
    FirmaElectronicaComponent,
    BtnContinuarComponent,
    RequisitosComponent,
    ToastrModule.forRoot(),
  ],
  providers: [
    Solocitud31601Service,
    ServiciosPantallaService,
    provideHttpClient(),
    ToastrService,
    BsModalService
    
  ]
})

/**
 * Este módulo se utiliza para configurar los componentes del módulo 31601.
 * Importar los componentes del módulo.
 */
export class AntecesorModule {}
