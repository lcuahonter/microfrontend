import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contenedores-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [],
  template: `
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0"><i class="bi bi-box-seam me-2"></i>{{ titulo }}</h4>
        </div>
        <div class="card-body">
          <p class="lead">Gestion de {{ titulo }} - Manifiestos pedimentos</p>

          <div class="row mb-3">
            <div class="col-md-3">
              <label class="form-label">No. Contenedor</label>
              <input type="text" class="form-control" placeholder="Ej: MSKU1234567" />
            </div>
            <div class="col-md-2">
              <label class="form-label">Tipo</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="20GP">20' GP</option>
                <option value="40GP">40' GP</option>
                <option value="40HC">40' HC</option>
                <option value="20RF">20' RF</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Estado</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="lleno">Lleno</option>
                <option value="vacio">Vacio</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Situacion</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="puerto">En Puerto</option>
                <option value="transito">En Transito</option>
                <option value="entregado">Entregado</option>
              </select>
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
                  <th>No. Contenedor</th>
                  <th>Tipo</th>
                  <th>Tamano</th>
                  <th>Peso Bruto (Kg)</th>
                  <th>Sello</th>
                  <th>Estado</th>
                  <th>Situacion</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of datosContenedores; track item.id) {
                  <tr class="table-row">
                    <td><strong>{{ item.numero }}</strong></td>
                    <td>{{ item.tipo }}</td>
                    <td>{{ item.tamano }}</td>
                    <td class="text-end">{{ item.peso | number }}</td>
                    <td>{{ item.sello }}</td>
                    <td><span class="badge" [class]="item.estadoBadge">{{ item.estado }}</span></td>
                    <td><span class="badge" [class]="item.situacionBadge">{{ item.situacion }}</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-1" title="Ver"><i class="bi bi-eye"></i></button>
                      <button class="btn btn-sm btn-outline-info" title="Rastrear"><i class="bi bi-geo-alt"></i></button>
                    </td>
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
export class ContenedoresPage {
  titulo = 'Contenedores';

  links = [
    { nombre: 'Bitacora', ruta: '../bitacora' },
    { nombre: 'House', ruta: '../house' },
    { nombre: 'Master', ruta: '../master' },
    { nombre: 'Manifiesto', ruta: '../manifiesto' },
    { nombre: 'Movimientos', ruta: '../movimientos' },
    { nombre: 'ISF10', ruta: '../isf10' },
    { nombre: 'Plus3', ruta: '../plus3' },
    { nombre: 'ISF5', ruta: '../isf5' }
  ];

  datosContenedores = [
    { id: 1, numero: 'MSKU1234567', tipo: 'Dry', tamano: '40\' HC', peso: 28500, sello: 'SL-2024-001', estado: 'Lleno', estadoBadge: 'bg-primary', situacion: 'En Puerto', situacionBadge: 'bg-info' },
    { id: 2, numero: 'TCLU7654321', tipo: 'Dry', tamano: '20\' GP', peso: 15200, sello: 'SL-2024-002', estado: 'Lleno', estadoBadge: 'bg-primary', situacion: 'En Transito', situacionBadge: 'bg-warning' },
    { id: 3, numero: 'CMAU9876543', tipo: 'Reefer', tamano: '40\' RF', peso: 22100, sello: 'SL-2024-003', estado: 'Lleno', estadoBadge: 'bg-primary', situacion: 'Entregado', situacionBadge: 'bg-success' },
    { id: 4, numero: 'HLXU3456789', tipo: 'Dry', tamano: '40\' GP', peso: 0, sello: '-', estado: 'Vacio', estadoBadge: 'bg-secondary', situacion: 'En Puerto', situacionBadge: 'bg-info' },
    { id: 5, numero: 'OOLU5678901', tipo: 'Open Top', tamano: '40\' OT', peso: 31500, sello: 'SL-2024-005', estado: 'Lleno', estadoBadge: 'bg-primary', situacion: 'En Transito', situacionBadge: 'bg-warning' },
    { id: 6, numero: 'EISU2345678', tipo: 'Dry', tamano: '20\' GP', peso: 12800, sello: 'SL-2024-006', estado: 'Lleno', estadoBadge: 'bg-primary', situacion: 'En Puerto', situacionBadge: 'bg-info' },
  ];
}
