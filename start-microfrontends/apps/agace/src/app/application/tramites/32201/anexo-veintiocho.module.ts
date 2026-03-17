import { AnexoVeintiochoRoutingModule } from './anexo-veintiocho-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    AnexoVeintiochoRoutingModule,
    SolicitudPageComponent,
    PasoUnoComponent,
    PasoTresComponent,
    PasoDosComponent,
  ],
})
export class AnexoVeintiochoModule { }
