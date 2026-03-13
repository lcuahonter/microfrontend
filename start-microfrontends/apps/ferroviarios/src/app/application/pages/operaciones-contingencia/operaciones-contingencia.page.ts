import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-operaciones-contingencia-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [`
    .table-container {
      background-color: #f9f9f9;
      border: 1px solid #e0e0e0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      font-family: 'Roboto', sans-serif;
      font-size: 14px;
      color: #404041;
    }
    .table-header {
      background-color: #dce0e0 !important;
      color: #6f7271 !important;
      font-weight: bold;
      text-align: center;
      font-size: 14px;
    }
    .table-header th {
      background-color: #dce0e0 !important;
      color: #6f7271 !important;
      border-color: #c0c0c0 !important;
    }
    .table-row {
      background-color: #ffffff;
    }
  `],
  template: `
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0"><i class="bi bi-exclamation-triangle me-2"></i>{{ titulo }}</h4>
        </div>
        <div class="card-body">
          <p class="lead">Gestion de {{ titulo }} - Servicios Ferroviarios</p>

          <div class="row mb-3">
            <div class="col-md-2">
              <label class="form-label">No. Operacion</label>
              <input type="text" class="form-control" placeholder="Numero..." />
            </div>
            <div class="col-md-2">
              <label class="form-label">Tipo</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="accidente">Accidente</option>
                <option value="descarrilamiento">Descarrilamiento</option>
                <option value="demora">Demora</option>
                <option value="inspeccion">Inspeccion</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Prioridad</label>
              <select class="form-select">
                <option value="">Todas</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Estado</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="activa">Activa</option>
                <option value="resuelta">Resuelta</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Fecha</label>
              <input type="date" class="form-control" />
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <button class="btn btn-primary me-2">Buscar</button>
              <button class="btn btn-danger">Nueva</button>
            </div>
          </div>

          <div class="table-container table-responsive">
            <table class="table table-striped table-bordered table-hover mb-0">
              <thead>
                <tr class="table-header">
                  <th>No. Operacion</th>
                  <th>Tipo</th>
                  <th>Prioridad</th>
                  <th>Ubicacion</th>
                  <th>Ferrocarril</th>
                  <th>Fecha/Hora</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of datosContingencia; track item.id) {
                  <tr class="table-row">
                    <td><strong>{{ item.numero }}</strong></td>
                    <td><span class="badge" [class]="item.tipoBadge">{{ item.tipo }}</span></td>
                    <td><span class="badge" [class]="item.prioridadBadge">{{ item.prioridad }}</span></td>
                    <td>{{ item.ubicacion }}</td>
                    <td>{{ item.ferrocarril }}</td>
                    <td>{{ item.fechaHora }}</td>
                    <td>{{ item.responsable }}</td>
                    <td><span class="badge" [class]="item.estadoBadge">{{ item.estado }}</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-1" title="Ver"><i class="bi bi-eye"></i></button>
                      <button class="btn btn-sm btn-outline-warning me-1" title="Actualizar"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-sm btn-outline-success" title="Resolver"><i class="bi bi-check-circle"></i></button>
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
export class OperacionesContingenciaPage {
  titulo = 'Operaciones Contingencia';

  links = [
    { nombre: 'VU Consist', ruta: '../vu-consist' },
    { nombre: 'VU Despacho', ruta: '../vu-despacho' },
    { nombre: 'VU Documento Transporte', ruta: '../vu-documento-transporte' },
    { nombre: 'Lista Detallada', ruta: '../lista-detallada' }
  ];

  datosContingencia = [
    { id: 1, numero: 'CTG-2024-00123', tipo: 'Demora', tipoBadge: 'bg-warning', prioridad: 'Media', prioridadBadge: 'bg-warning', ubicacion: 'Km 245 Monterrey-Laredo', ferrocarril: 'KCSM', fechaHora: '2024-12-30 14:30', responsable: 'Ing. Martinez', estado: 'Activa', estadoBadge: 'bg-danger' },
    { id: 2, numero: 'CTG-2024-00122', tipo: 'Inspeccion', tipoBadge: 'bg-info', prioridad: 'Baja', prioridadBadge: 'bg-secondary', ubicacion: 'Patio Guadalajara', ferrocarril: 'Ferromex', fechaHora: '2024-12-30 10:15', responsable: 'Ing. Lopez', estado: 'Activa', estadoBadge: 'bg-danger' },
    { id: 3, numero: 'CTG-2024-00121', tipo: 'Accidente', tipoBadge: 'bg-danger', prioridad: 'Alta', prioridadBadge: 'bg-danger', ubicacion: 'Cruce Autopista Qro', ferrocarril: 'KCSM', fechaHora: '2024-12-29 22:45', responsable: 'Ing. Garcia', estado: 'Resuelta', estadoBadge: 'bg-success' },
    { id: 4, numero: 'CTG-2024-00120', tipo: 'Descarrilamiento', tipoBadge: 'bg-dark', prioridad: 'Alta', prioridadBadge: 'bg-danger', ubicacion: 'Km 89 Veracruz-Coatza', ferrocarril: 'Ferrosur', fechaHora: '2024-12-29 08:20', responsable: 'Ing. Hernandez', estado: 'Resuelta', estadoBadge: 'bg-success' },
    { id: 5, numero: 'CTG-2024-00119', tipo: 'Demora', tipoBadge: 'bg-warning', prioridad: 'Media', prioridadBadge: 'bg-warning', ubicacion: 'Aduana Nuevo Laredo', ferrocarril: 'KCSM', fechaHora: '2024-12-28 16:00', responsable: 'Ing. Rodriguez', estado: 'Pendiente', estadoBadge: 'bg-secondary' },
    { id: 6, numero: 'CTG-2024-00118', tipo: 'Inspeccion', tipoBadge: 'bg-info', prioridad: 'Baja', prioridadBadge: 'bg-secondary', ubicacion: 'Terminal Manzanillo', ferrocarril: 'Ferromex', fechaHora: '2024-12-28 09:30', responsable: 'Ing. Sanchez', estado: 'Resuelta', estadoBadge: 'bg-success' },
  ];
}
