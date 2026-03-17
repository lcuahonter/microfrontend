import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manifiesto-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [],
  template: `
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0"><i class="bi bi-file-earmark-richtext me-2"></i>{{ titulo }}</h4>
        </div>
        <div class="card-body">
          <p class="lead">Consulta de {{ titulo }}s manifestacionvalor</p>

          <div class="row mb-3">
            <div class="col-md-2">
              <label class="form-label">Folio</label>
              <input type="text" class="form-control" placeholder="Folio..." />
            </div>
            <div class="col-md-2">
              <label class="form-label">Aduana</label>
              <select class="form-select">
                <option value="">Todas</option>
                <option value="470">Manzanillo</option>
                <option value="480">Lazaro Cardenas</option>
                <option value="300">Veracruz</option>
                <option value="430">Altamira</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Tipo</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="importacion">Importacion</option>
                <option value="exportacion">Exportacion</option>
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
                  <th>Buque</th>
                  <th>Fecha Arribo</th>
                  <th>Masters</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of datosManifiesto; track item.id) {
                  <tr class="table-row">
                    <td><strong>{{ item.folio }}</strong></td>
                    <td>{{ item.tipo }}</td>
                    <td>{{ item.aduana }}</td>
                    <td>{{ item.buque }}</td>
                    <td>{{ item.fechaArribo }}</td>
                    <td class="text-center">{{ item.masters }}</td>
                    <td><span class="badge" [class]="item.badgeClass">{{ item.estado }}</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-1" title="Ver"><i class="bi bi-eye"></i></button>
                      <button class="btn btn-sm btn-outline-warning me-1" title="Editar"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-sm btn-outline-info" title="PDF"><i class="bi bi-file-pdf"></i></button>
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
export class ManifiestoPage {
  titulo = 'Manifiesto';

  links = [
    { nombre: 'Bitacora', ruta: '../bitacora' },
    { nombre: 'House', ruta: '../house' },
    { nombre: 'Contenedores', ruta: '../contenedores' },
    { nombre: 'Master', ruta: '../master' },
    { nombre: 'Movimientos', ruta: '../movimientos' },
    { nombre: 'ISF10', ruta: '../isf10' },
    { nombre: 'Plus3', ruta: '../plus3' },
    { nombre: 'ISF5', ruta: '../isf5' }
  ];

  datosManifiesto = [
    { id: 1, folio: 'MAN-2024-001234', tipo: 'Importacion', aduana: 'Manzanillo (470)', buque: 'MAERSK SELETAR', fechaArribo: '2024-12-28', masters: 5, estado: 'Validado', badgeClass: 'bg-success' },
    { id: 2, folio: 'MAN-2024-001235', tipo: 'Importacion', aduana: 'Lazaro Cardenas (480)', buque: 'MSC GULSUN', fechaArribo: '2024-12-29', masters: 3, estado: 'En Revision', badgeClass: 'bg-warning' },
    { id: 3, folio: 'MAN-2024-001236', tipo: 'Exportacion', aduana: 'Veracruz (300)', buque: 'COSCO LEO', fechaArribo: '2024-12-30', masters: 8, estado: 'Validado', badgeClass: 'bg-success' },
    { id: 4, folio: 'MAN-2024-001237', tipo: 'Importacion', aduana: 'Altamira (430)', buque: 'BERLIN EXPRESS', fechaArribo: '2024-12-31', masters: 2, estado: 'Pendiente', badgeClass: 'bg-secondary' },
    { id: 5, folio: 'MAN-2024-001238', tipo: 'Exportacion', aduana: 'Manzanillo (470)', buque: 'EVER GOLDEN', fechaArribo: '2025-01-02', masters: 6, estado: 'Rechazado', badgeClass: 'bg-danger' },
    { id: 6, folio: 'MAN-2024-001239', tipo: 'Importacion', aduana: 'Veracruz (300)', buque: 'YM WARMTH', fechaArribo: '2025-01-03', masters: 4, estado: 'En Revision', badgeClass: 'bg-warning' },
  ];
}
