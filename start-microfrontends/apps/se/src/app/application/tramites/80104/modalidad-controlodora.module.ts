import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogoSelectComponent, FirmaElectronicaComponent, PasoFirmaComponent, SharedModule, SolicitanteComponent, TituloComponent, WizardComponent, PasoCargaDocumentoComponent } from '@ng-mf/data-access-user';
import { AgregarComplimentosComponent } from './component/agregar-complimentos/agregar-complimentos.component';
import { AnexoVistaDosYTresComponent } from './component/anexo-vista-dos-y-tres/anexo-vista-dos-y-tres.component';
import { AnexoVistaUnoComponent } from './component/anexo-vista-uno/anexo-vista-uno.component';
import { CommonModule } from '@angular/common';
import { EmpleadosComponent } from '../../shared/components/empleados/empleados.component';
import { EmpresasSubfabricanteComponent } from './component/empresas-subfabricante/empresas-subfabricante.component';
import { NgModule } from '@angular/core';

import { CapacidadInstaladaComponent } from '../../shared/components/capacidad-instalada/capacidad-instalada.component';
import { CargaDocumentoComponent } from '@ng-mf/data-access-user'
import { ComplementarPlantaComponent } from '../../shared/components/complementar-planta/complementar-planta.component';
import { FederatariosYPlantasVistaComponent } from './component/federatarios-y-plantas-vista/federatarios-y-plantas-vista.component';
import { MontosDeInversionComponent } from '../../shared/components/montos-de-inversion/montos-de-inversion.component';

import { PasoCapturarSolicitudComponent } from './pages/paso-capturar-solicitud/paso-capturar-solicitud.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmarSolicitudComponent } from './pages/paso-firmar-solicitud/paso-firmar-solicitud.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoCsComponent } from './pages/paso-uno-cs/paso-uno-cs.component';
import { ReactiveFormsModule } from '@angular/forms';

import { ComplementosSeccionComponent } from '../../shared/components/complementos-seccion/complementos-seccion.component';

import { AnexoTresComponent } from '../../shared/components/anexo-tres/anexo-tres.component';
import { AnexoUnoSeccionComponent } from '../../shared/components/anexo-uno-seccion/anexo-uno-seccion.component';
import { EmpresasControladasComponent } from './component/empresas-controladas/empresas-controladas.component';

import { FederatariosYPlantasComponent } from '../../shared/components/federatarios-y-planta/federatarios-y-plantas.component';
import { ModalidadControlodoraRoutingModule } from './modalidad-controlodora-routing.module';
@NgModule({
  declarations: [
    PasoCapturarSolicitudComponent,
    PasoDosComponent,
    PasoFirmarSolicitudComponent,
    PasoTresComponent,
    PasoUnoCsComponent,
  
  ],
  imports: [
    CommonModule,
    ModalidadControlodoraRoutingModule,
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    CatalogoSelectComponent,
    FirmaElectronicaComponent,
    ReactiveFormsModule,
    SharedModule,
    SolicitanteComponent,
    TituloComponent,
    WizardComponent,
    AnexoVistaDosYTresComponent,
    FederatariosYPlantasComponent,
    AnexoVistaUnoComponent,
    FederatariosYPlantasVistaComponent,
    ComplementarPlantaComponent,
    MontosDeInversionComponent,
    EmpleadosComponent,
    CapacidadInstaladaComponent,
    AgregarComplimentosComponent,
    EmpresasSubfabricanteComponent,
    ComplementosSeccionComponent,
    AnexoUnoSeccionComponent,
    AnexoTresComponent,
    EmpresasControladasComponent,
    PasoFirmaComponent,
    CargaDocumentoComponent,
    PasoCargaDocumentoComponent
],
})
export class ModalidadControlodoraModule {}
