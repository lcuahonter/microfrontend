import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bitacora-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [],
  template: `
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0"><i class="bi bi-journal-text me-2"></i>{{ titulo }}</h4>
        </div>
        <div class="card-body">
          <p class="lead">Consulta de {{ titulo }} - Manifiestos Maritimos</p>

          <div class="row mb-3">
            <div class="col-md-3">
              <label class="form-label">Fecha Inicio</label>
              <input type="date" class="form-control" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Fecha Fin</label>
              <input type="date" class="form-control" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Usuario</label>
              <input type="text" class="form-control" placeholder="Buscar usuario..." />
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button class="btn btn-primary me-2">Buscar</button>
              <button class="btn btn-secondary">Limpiar</button>
            </div>
          </div>

          <div class="table-container table-responsive">
            <table class="table table-striped table-bordered table-hover mb-0">
              <thead>
                <tr class="table-header">
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Accion</th>
                  <th>Modulo</th>
                  <th>Descripcion</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                @for (item of datosBitacora; track item.id) {
                  <tr class="table-row">
                    <td>{{ item.fecha }}</td>
                    <td>{{ item.usuario }}</td>
                    <td><span class="badge" [class]="item.badgeClass">{{ item.accion }}</span></td>
                    <td>{{ item.modulo }}</td>
                    <td>{{ item.descripcion }}</td>
                    <td>{{ item.ip }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <hr>
          <h6>Navegacion del modulo:</h6>
          <div class="d-flex flex-wrap gap-2">
            @for (link of links; track link.ruta) {
              <a [routerLink]="link.ruta" class="btn btn-outline-primary btn-sm">
                {{ link.nombre }}
              </a>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class BitacoraPage {
  titulo = 'Bitacora';

  links = [
    { nombre: 'House', ruta: '../house' },
    { nombre: 'Contenedores', ruta: '../contenedores' },
    { nombre: 'Master', ruta: '../master' },
    { nombre: 'Manifiesto', ruta: '../manifiesto' },
    { nombre: 'Movimientos', ruta: '../movimientos' },
    { nombre: 'ISF10', ruta: '../isf10' },
    { nombre: 'Plus3', ruta: '../plus3' },
    { nombre: 'ISF5', ruta: '../isf5' }
  ];

  datosBitacora = [
    { id: 1, fecha: '2024-12-30 10:15:23', usuario: 'JPEREZ', accion: 'Consulta', badgeClass: 'bg-info', modulo: 'Manifiesto', descripcion: 'Consulta de manifiesto MAR-2024-001234', ip: '192.168.1.100' },
    { id: 2, fecha: '2024-12-30 09:45:12', usuario: 'MGARCIA', accion: 'Creacion', badgeClass: 'bg-success', modulo: 'House', descripcion: 'Alta de documento House HSE-2024-005678', ip: '192.168.1.105' },
    { id: 3, fecha: '2024-12-30 09:30:45', usuario: 'ALOPEZ', accion: 'Modificacion', badgeClass: 'bg-warning', modulo: 'Contenedor', descripcion: 'Actualizacion de contenedor MSKU1234567', ip: '192.168.1.110' },
    { id: 4, fecha: '2024-12-29 16:20:33', usuario: 'JPEREZ', accion: 'Eliminacion', badgeClass: 'bg-danger', modulo: 'Master', descripcion: 'Eliminacion de master MST-2024-000999', ip: '192.168.1.100' },
    { id: 5, fecha: '2024-12-29 14:10:55', usuario: 'RMARTINEZ', accion: 'Consulta', badgeClass: 'bg-info', modulo: 'ISF10', descripcion: 'Consulta de ISF10 documento 2024ISF001234', ip: '192.168.1.115' },
    { id: 6, fecha: '2024-12-29 11:05:18', usuario: 'MGARCIA', accion: 'Creacion', badgeClass: 'bg-success', modulo: 'Movimientos', descripcion: 'Registro de movimiento de descarga', ip: '192.168.1.105' },
  ];
}
