import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movimientos-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [],
  template: `
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0"><i class="bi bi-arrow-left-right me-2"></i>{{ titulo }}</h4>
        </div>
        <div class="card-body">
          <p class="lead">Registro de {{ titulo }} de Carga - Manifiestos Maritimos</p>

          <div class="row mb-3">
            <div class="col-md-3">
              <label class="form-label">No. Contenedor</label>
              <input type="text" class="form-control" placeholder="MSKU1234567" />
            </div>
            <div class="col-md-2">
              <label class="form-label">Tipo Movimiento</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="descarga">Descarga</option>
                <option value="carga">Carga</option>
                <option value="transbordo">Transbordo</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Fecha Desde</label>
              <input type="date" class="form-control" />
            </div>
            <div class="col-md-2">
              <label class="form-label">Fecha Hasta</label>
              <input type="date" class="form-control" />
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button class="btn btn-primary me-2">Buscar</button>
              <button class="btn btn-success me-2">Nuevo</button>
              <button class="btn btn-secondary">Limpiar</button>
            </div>
          </div>

          <div class="table-container table-responsive">
            <table class="table table-striped table-bordered table-hover mb-0">
              <thead>
                <tr class="table-header">
                  <th>Fecha/Hora</th>
                  <th>Tipo</th>
                  <th>Contenedor</th>
                  <th>Buque</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Operador</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (item of datosMovimientos; track item.id) {
                  <tr class="table-row">
                    <td>{{ item.fechaHora }}</td>
                    <td><span class="badge" [class]="item.tipoBadge">{{ item.tipo }}</span></td>
                    <td><strong>{{ item.contenedor }}</strong></td>
                    <td>{{ item.buque }}</td>
                    <td>{{ item.origen }}</td>
                    <td>{{ item.destino }}</td>
                    <td>{{ item.operador }}</td>
                    <td><span class="badge" [class]="item.estadoBadge">{{ item.estado }}</span></td>
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
export class MovimientosPage {
  titulo = 'Movimientos';

  links = [
    { nombre: 'Bitacora', ruta: '../bitacora' },
    { nombre: 'House', ruta: '../house' },
    { nombre: 'Contenedores', ruta: '../contenedores' },
    { nombre: 'Master', ruta: '../master' },
    { nombre: 'Manifiesto', ruta: '../manifiesto' },
    { nombre: 'ISF10', ruta: '../isf10' },
    { nombre: 'Plus3', ruta: '../plus3' },
    { nombre: 'ISF5', ruta: '../isf5' }
  ];

  datosMovimientos = [
    { id: 1, fechaHora: '2024-12-30 08:30', tipo: 'Descarga', tipoBadge: 'bg-info', contenedor: 'MSKU1234567', buque: 'MAERSK SELETAR', origen: 'Buque', destino: 'Patio A-15', operador: 'Terminal Manzanillo', estado: 'Completado', estadoBadge: 'bg-success' },
    { id: 2, fechaHora: '2024-12-30 09:15', tipo: 'Descarga', tipoBadge: 'bg-info', contenedor: 'TCLU7654321', buque: 'MAERSK SELETAR', origen: 'Buque', destino: 'Patio B-22', operador: 'Terminal Manzanillo', estado: 'Completado', estadoBadge: 'bg-success' },
    { id: 3, fechaHora: '2024-12-30 10:00', tipo: 'Carga', tipoBadge: 'bg-primary', contenedor: 'CMAU9876543', buque: 'MSC GULSUN', origen: 'Patio C-08', destino: 'Buque', operador: 'SSA Mexico', estado: 'En Proceso', estadoBadge: 'bg-warning' },
    { id: 4, fechaHora: '2024-12-30 10:45', tipo: 'Transbordo', tipoBadge: 'bg-warning', contenedor: 'HLXU3456789', buque: 'COSCO LEO', origen: 'EVER GOLDEN', destino: 'COSCO LEO', operador: 'ICTSI', estado: 'Programado', estadoBadge: 'bg-secondary' },
    { id: 5, fechaHora: '2024-12-30 11:30', tipo: 'Reposicion', tipoBadge: 'bg-secondary', contenedor: 'OOLU5678901', buque: '-', origen: 'Patio D-01', destino: 'Patio A-30', operador: 'Terminal Manzanillo', estado: 'Completado', estadoBadge: 'bg-success' },
    { id: 6, fechaHora: '2024-12-30 12:00', tipo: 'Descarga', tipoBadge: 'bg-info', contenedor: 'EISU2345678', buque: 'BERLIN EXPRESS', origen: 'Buque', destino: 'Patio B-10', operador: 'Hutchison Ports', estado: 'En Proceso', estadoBadge: 'bg-warning' },
  ];
}
