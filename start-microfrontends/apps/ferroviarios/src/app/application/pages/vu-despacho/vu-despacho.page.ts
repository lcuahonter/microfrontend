import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vu-despacho-page',
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
          <h4 class="mb-0"><i class="bi bi-send me-2"></i>{{ titulo }}</h4>
        </div>
        <div class="card-body">
          <p class="lead">Gestion de {{ titulo }} - Servicios Ferroviarios</p>

          <div class="row mb-3">
            <div class="col-md-2">
              <label class="form-label">Folio Despacho</label>
              <input type="text" class="form-control" placeholder="Folio..." />
            </div>
            <div class="col-md-2">
              <label class="form-label">Aduana</label>
              <select class="form-select">
                <option value="">Todas</option>
                <option value="240">Nuevo Laredo (240)</option>
                <option value="190">Ciudad Juarez (190)</option>
                <option value="160">Piedras Negras (160)</option>
                <option value="640">Nogales (640)</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Tipo Operacion</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="importacion">Importacion</option>
                <option value="exportacion">Exportacion</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Estado</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="liberado">Liberado</option>
                <option value="revision">En Revision</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Fecha</label>
              <input type="date" class="form-control" />
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <button class="btn btn-primary me-2">Buscar</button>
              <button class="btn btn-secondary">Limpiar</button>
            </div>
          </div>

          <div class="table-container table-responsive">
            <table class="table table-striped table-bordered table-hover mb-0">
              <thead>
                <tr class="table-header">
                  <th>Folio</th>
                  <th>Tipo</th>
                  <th>Aduana</th>
                  <th>Ferrocarril</th>
                  <th>Pedimento</th>
                  <th>Carros</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of datosDespacho; track item.id) {
                  <tr class="table-row">
                    <td><strong>{{ item.folio }}</strong></td>
                    <td><span class="badge" [class]="item.tipoBadge">{{ item.tipo }}</span></td>
                    <td>{{ item.aduana }}</td>
                    <td>{{ item.ferrocarril }}</td>
                    <td>{{ item.pedimento }}</td>
                    <td class="text-center">{{ item.carros }}</td>
                    <td>{{ item.fecha }}</td>
                    <td><span class="badge" [class]="item.estadoBadge">{{ item.estado }}</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-1" title="Ver"><i class="bi bi-eye"></i></button>
                      <button class="btn btn-sm btn-outline-warning me-1" title="Editar"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-sm btn-outline-success" title="Liberar"><i class="bi bi-check-lg"></i></button>
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
export class VuDespachoPage {
  titulo = 'VU Despacho';

  links = [
    { nombre: 'VU Consist', ruta: '../vu-consist' },
    { nombre: 'VU Documento Transporte', ruta: '../vu-documento-transporte' },
    { nombre: 'Operaciones Contingencia', ruta: '../operaciones-contingencia' },
    { nombre: 'Lista Detallada', ruta: '../lista-detallada' }
  ];

  datosDespacho = [
    { id: 1, folio: 'DSP-2024-00567', tipo: 'Importacion', tipoBadge: 'bg-primary', aduana: 'Nuevo Laredo (240)', ferrocarril: 'KCSM', pedimento: '24-240-3145-0012345', carros: 25, fecha: '2024-12-28', estado: 'Liberado', estadoBadge: 'bg-success' },
    { id: 2, folio: 'DSP-2024-00568', tipo: 'Exportacion', tipoBadge: 'bg-info', aduana: 'Ciudad Juarez (190)', ferrocarril: 'Ferromex', pedimento: '24-190-3145-0012678', carros: 18, fecha: '2024-12-28', estado: 'En Revision', estadoBadge: 'bg-warning' },
    { id: 3, folio: 'DSP-2024-00569', tipo: 'Importacion', tipoBadge: 'bg-primary', aduana: 'Piedras Negras (160)', ferrocarril: 'KCSM', pedimento: '24-160-3145-0012890', carros: 32, fecha: '2024-12-29', estado: 'Liberado', estadoBadge: 'bg-success' },
    { id: 4, folio: 'DSP-2024-00570', tipo: 'Importacion', tipoBadge: 'bg-primary', aduana: 'Nuevo Laredo (240)', ferrocarril: 'KCSM', pedimento: '24-240-3145-0013001', carros: 15, fecha: '2024-12-29', estado: 'Pendiente', estadoBadge: 'bg-secondary' },
    { id: 5, folio: 'DSP-2024-00571', tipo: 'Exportacion', tipoBadge: 'bg-info', aduana: 'Nogales (640)', ferrocarril: 'Ferromex', pedimento: '24-640-3145-0013234', carros: 22, fecha: '2024-12-30', estado: 'En Revision', estadoBadge: 'bg-warning' },
    { id: 6, folio: 'DSP-2024-00572', tipo: 'Importacion', tipoBadge: 'bg-primary', aduana: 'Ciudad Juarez (190)', ferrocarril: 'Ferromex', pedimento: '24-190-3145-0013456', carros: 28, fecha: '2024-12-30', estado: 'Liberado', estadoBadge: 'bg-success' },
  ];
}
