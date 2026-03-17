import { AlertComponent, TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FormsModule } from '@angular/forms';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { JuntaTecnicaRoutingModule } from './junta-tecnica-routing.module';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { SolicitudJuntaTecnicaComponent } from './pages/solicitud-junta-tecnica/solicitud-junta-tecnica.component';
import { TableComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';

@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    SolicitudJuntaTecnicaComponent,
    SolicitudComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    JuntaTecnicaRoutingModule,
    ToastrModule.forRoot()
  ],
  exports: [],
  providers: [ToastrService],
})
export class JuntaTecnicaModule {}
