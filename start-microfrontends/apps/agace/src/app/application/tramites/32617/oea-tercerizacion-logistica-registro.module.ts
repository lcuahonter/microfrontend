import { AlertComponent, AnexarDocumentosComponent, NotificacionesComponent } from '@ng-mf/data-access-user';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CTPATComponent } from './components/c-tpat/c-tpat.component';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosComunesComponent } from './components/datos-comunes/datos-comunes.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FormsModule } from '@angular/forms';
import { ImportadorExportadorComponent } from './components/importador-exportador/importador-exportador.component';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { OeaTercerizacionLogisticaRegistroComponent } from './pages/oea-textil-registro/oea-tercerizacion-logistica-registro.component';
import { OeaTercerizacionLogisticaRegistroRoutingModule } from './oea-tercerizacion-logistica-registro-routing.module';
import { OeaTercerizacionLogisticaRegistroService } from './services/oea-tercerizacion-logistica-registro.service';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PerfilesComponent } from './components/perfiles/perfiles.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TableComponent } from '@ng-mf/data-access-user';
import { TercerosRelacionadosComponent } from './components/terceros-relacionados/terceros-relacionados.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';

@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    OeaTercerizacionLogisticaRegistroComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OeaTercerizacionLogisticaRegistroRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    FirmaElectronicaComponent,
    TituloComponent,
    FormsModule,
    TableComponent,
    AnexarDocumentosComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
    TablaDinamicaComponent,
    DatosComunesComponent,
    TercerosRelacionadosComponent,
    ImportadorExportadorComponent,
    AlertComponent,
    CTPATComponent,
    PerfilesComponent,
    NotificacionesComponent,
    ToastrModule.forRoot()
  ],
  exports: [
    PasoUnoComponent, 
    PasoDosComponent, 
    PasoTresComponent,
  ],
  providers: [OeaTercerizacionLogisticaRegistroService, ToastrService],
})
export class OeaTercerizacionLogisticaRegistroModule {}
