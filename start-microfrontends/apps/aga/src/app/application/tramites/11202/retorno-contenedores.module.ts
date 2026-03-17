import { AlertComponent,CargaDocumentoComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogoSelectComponent, CatalogosService, CrosslistComponent, FirmaElectronicaComponent, InputCheckComponent, InputFechaComponent, InputHoraComponent, InputRadioComponent, RepresentanteFiscalComponent, SelectPaisesComponent, SharedModule, SolicitanteComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContenedorComponent } from './components/contenedor/contenedor.component';
import { NgModule,forwardRef } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RetornoContenedoresRoutingModule } from './retorno-contenedores-routing.module';
import { RouterModule } from '@angular/router';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { ToastrService } from 'ngx-toastr';
import { NotificacionesComponent } from '@ng-mf/data-access-user';

@NgModule({
  declarations: [
    ContenedorComponent,
    PasoUnoComponent,
    SolicitantePageComponent,
    PasoDosComponent
  ],
  imports: [
    CommonModule,
    RetornoContenedoresRoutingModule,
    SharedModule,
    RouterModule,
    WizardComponent,
    ReactiveFormsModule,
    FormsModule,
    TituloComponent,
    BtnContinuarComponent,
    FirmaElectronicaComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    InputFechaComponent,
    InputCheckComponent,
    InputHoraComponent,
    CrosslistComponent,
    SelectPaisesComponent,
    RepresentanteFiscalComponent,
    CatalogoSelectComponent,
    InputRadioComponent,
    PasoTresComponent,
    TablaDinamicaComponent,
    SolicitanteComponent,
    NotificacionesComponent,
    forwardRef(() => CargaDocumentoComponent),
  ],
  exports: [ContenedorComponent, PasoUnoComponent],
  providers: [CatalogosService, ToastrService],
})
export class RetornoContenedoresModule { }
