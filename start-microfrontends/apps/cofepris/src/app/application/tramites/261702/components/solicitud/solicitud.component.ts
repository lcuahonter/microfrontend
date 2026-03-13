import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { ManifiestosDeclaracionesComponent } from '../manifiestosDeclaraciones/manifiestosDeclaraciones.component';
import { PermisoDesistirComponent } from '../permisoDesistir/permisoDesistir.component';
import { RepresentanteLegalComponent } from '../representanteLegal/representanteLegal/representanteLegal.component';

/**
 * SolicitudComponent es un componente que integra varios subcomponentes 
 * para gestionar diferentes secciones relacionadas con la solicitud 
 * en el contexto de trámites.
 * 
 * @component
 */
@Component({
  selector: 'solicitud',
  standalone: true,
  imports: [
    CommonModule,
    PermisoDesistirComponent,
    ManifiestosDeclaracionesComponent,
    RepresentanteLegalComponent
  ],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})
export class SolicitudComponent {

/**
    * @property consultaState
    * @description
    * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
    */
    @Input() consultaState!: ConsultaioState;

}
