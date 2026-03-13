import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CargaDocumentoComponent, FirmaElectronicaComponent, InputFechaComponent, InputRadioComponent, SolicitanteComponent, TableComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AcuseReciboComponent } from "../../shared/components/acuse-recibo/acuse-recibo.component";
import { AgregarMercanciaComponent } from './components/agregar-mercancia/agregar-mercancia.component';
import { CarrosDeFerrocarrilComponent } from '../220502/shared/carros-de-ferrocarril/carros-de-ferrocarril.component';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteARealizarComponent } from '../220502/shared/datos-del-tramite-a-realizar/datos-del-tramite-a-realizar.component';
import { DatosGeneralesComponent } from './components/datos-generales/datos-generales.component';
import { FrecuenciaInspeccionComponent } from './components/frecuencia-inspeccion/frecuencia-inspeccion.component';
import { HistorialInspeccionFisicaComponent } from '../220502/shared/historial-inspeccion-fisica/historial-inspeccion-fisica.component';
import { MedioTransporteComponent } from './components/medio-transporte/medio-transporte.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechosComponent } from './components/pago-de-derechos/pago-de-derechos.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ResponsableInspeccionEnPuntoComponent } from '../220502/shared/responsable-inspeccion-en-punto/responsable-inspeccion-en-punto.component';
import { RevisionDocumentalComponent } from './components/revision-documental/revision-documental.component';
import { RevisionService } from './services/revision.service';
import { RouterModule } from '@angular/router';
import { SagarpaRoutingModule } from './sagarpa-routing.module';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { SolicitudDatosComponent } from '../220502/shared/solicitud-datos/solicitud-datos.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TercerosRelacionadosComponent } from './components/terceros-relacionados/terceros-relacionados.component';
import { forwardRef } from '@angular/core';

@NgModule({
  declarations: [
    SolicitudPageComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    SagarpaRoutingModule,
    WizardComponent,
    TituloComponent,
    BtnContinuarComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    SolicitanteComponent,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    InputFechaComponent,
    SolicitudDatosComponent,
    DatosDelTramiteARealizarComponent,
    ResponsableInspeccionEnPuntoComponent,
    CarrosDeFerrocarrilComponent,
    HistorialInspeccionFisicaComponent,
    CatalogoSelectComponent,
    TableComponent,
    InputRadioComponent,
    SolicitudComponent,
    RevisionDocumentalComponent,
    MedioTransporteComponent,
    AgregarMercanciaComponent,
    DatosGeneralesComponent,
    TercerosRelacionadosComponent,
    PagoDeDerechosComponent,
    ToastrModule.forRoot(),
    FrecuenciaInspeccionComponent,
    forwardRef(() => CargaDocumentoComponent),
    AcuseReciboComponent
],
  exports: [SolicitudPageComponent],
  providers:[
    ToastrService,RevisionService
  ]
})
export class SagarpaModule {}
