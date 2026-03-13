import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CargaDocumentoComponent,
  CatalogoSelectComponent,
  FirmaElectronicaComponent,
  SharedModule,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { NgModule, forwardRef } from '@angular/core';
import { PasoCargaDocumentoComponent, PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { AggregarComplimentosComponent } from './component/aggregar-complimentos/aggregar-complimentos.component';
import { AnexoVistaDosYTresComponent } from './component/anexo-vista-dos-y-tres/anexo-vista-dos-y-tres.component';
import { AnexoVistaUnoComponent } from './component/anexo-vista-uno/anexo-vista-uno.component';
import { CommonModule } from '@angular/common';
import { EmpleadosComponent } from '../../shared/components/empleados/empleados.component';
import { EmpresasSubfabricanteComponent } from './component/empresas-subfabricante/empresas-subfabricante.component';

import { CapacidadInstaladaComponent } from '../../shared/components/capacidad-instalada/capacidad-instalada.component';
import { ComplementarPlantaComponent } from '../../shared/components/complementar-planta/complementar-planta.component';
import { FederatariosYPlantasComponent } from '../../shared/components/federatarios-y-plantas/federatarios-y-plantas.component';
import { FederatariosYPlantasVistaComponent } from './component/federatarios-y-plantas-vista/federatarios-y-plantas-vista.component';
import { MontosDeInversionComponent } from '../../shared/components/montos-de-inversion/montos-de-inversion.component';

import { PasoCapturarSolicitudComponent } from './pages/paso-capturar-solicitud/paso-capturar-solicitud.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmarSolicitudComponent } from './pages/paso-firmar-solicitud/paso-firmar-solicitud.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoCsComponent } from './pages/paso-uno-cs/paso-uno-cs.component';
import { ReactiveFormsModule } from '@angular/forms';

import { ModalidadAlbergueRoutingModule } from './modalidad-albergue-routing.module';

import { ComplementosSeccionComponent } from '../../shared/components/complementos-seccion/complementos-seccion.component';

import { AnexoUnoSeccionComponent } from '../../shared/components/anexo-uno-seccion/anexo-uno-seccion.component';

import { AnexoTresComponent } from '../../shared/components/anexo-tres/anexo-tres.component';
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
   ModalidadAlbergueRoutingModule,
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
    AggregarComplimentosComponent,
    EmpresasSubfabricanteComponent,
    ComplementosSeccionComponent,
    AnexoUnoSeccionComponent,
    AnexoTresComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    forwardRef(() => CargaDocumentoComponent),
  ],
})
export class ModalidadAlbergueModule {}
