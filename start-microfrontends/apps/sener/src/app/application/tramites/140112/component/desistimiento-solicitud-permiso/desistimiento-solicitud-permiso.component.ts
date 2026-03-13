import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PermisosCancelarComponent } from '../permisos-cancelar/permisos-cancelar.component';

@Component({
  selector: 'app-desistimiento-solicitud-permiso',
  standalone: true,
  imports: [CommonModule, PermisosCancelarComponent],
  templateUrl: './desistimiento-solicitud-permiso.component.html',
  styleUrls: ['./desistimiento-solicitud-permiso.component.scss']})
export class DesistimientoSolicitudPermisoComponent {}