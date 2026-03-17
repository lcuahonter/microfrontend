import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-isf10-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [],
  template: `
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0"><i class="bi bi-file-earmark-binary me-2"></i>{{ titulo }}</h4>
        </div>
        <div class="card-body">
          <p class="lead">Importer Security Filing ({{ titulo }}) - Manifiestos Maritimos</p>

          <div class="row mb-3">
            <div class="col-md-3">
              <label class="form-label">No. ISF</label>
              <input type="text" class="form-control" placeholder="Numero ISF..." />
            </div>
            <div class="col-md-3">
              <label class="form-label">Importador</label>
              <input type="text" class="form-control" placeholder="Buscar importador..." />
            </div>
            <div class="col-md-2">
              <label class="form-label">Estado</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="aceptado">Aceptado</option>
                <option value="pendiente">Pendiente</option>
                <option value="rechazado">Rechazado</option>
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
                  <th>No. ISF</th>
                  <th>Importador</th>
                  <th>Vendedor</th>
                  <th>Pais Origen</th>
                  <th>Puerto Descarga</th>
                  <th>Fecha Envio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of datosIsf10; track item.id) {
                  <tr class="table-row">
                    <td><strong>{{ item.numero }}</strong></td>
                    <td>{{ item.importador }}</td>
                    <td>{{ item.vendedor }}</td>
                    <td>{{ item.paisOrigen }}</td>
                    <td>{{ item.puertoDescarga }}</td>
                    <td>{{ item.fechaEnvio }}</td>
                    <td><span class="badge" [class]="item.badgeClass">{{ item.estado }}</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-1" title="Ver"><i class="bi bi-eye"></i></button>
                      <button class="btn btn-sm btn-outline-warning me-1" title="Editar"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-sm btn-outline-info" title="Descargar"><i class="bi bi-download"></i></button>
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
export class Isf10Page {
  titulo = 'ISF10';

  links = [
    { nombre: 'Bitacora', ruta: '../bitacora' },
    { nombre: 'House', ruta: '../house' },
    { nombre: 'Contenedores', ruta: '../contenedores' },
    { nombre: 'Master', ruta: '../master' },
    { nombre: 'Manifiesto', ruta: '../manifiesto' },
    { nombre: 'Movimientos', ruta: '../movimientos' },
    { nombre: 'Plus3', ruta: '../plus3' },
    { nombre: 'ISF5', ruta: '../isf5' }
  ];

  datosIsf10 = [
    { id: 1, numero: 'ISF-2024-100001', importador: 'Comercializadora del Norte SA', vendedor: 'Shanghai Trading Co', paisOrigen: 'China', puertoDescarga: 'Manzanillo', fechaEnvio: '2024-12-25', estado: 'Aceptado', badgeClass: 'bg-success' },
    { id: 2, numero: 'ISF-2024-100002', importador: 'Importadora Pacific SA', vendedor: 'Korea Electronics Ltd', paisOrigen: 'Corea del Sur', puertoDescarga: 'Lazaro Cardenas', fechaEnvio: '2024-12-26', estado: 'Aceptado', badgeClass: 'bg-success' },
    { id: 3, numero: 'ISF-2024-100003', importador: 'Distribuidora Centro SA', vendedor: 'Ningbo Manufacturing', paisOrigen: 'China', puertoDescarga: 'Veracruz', fechaEnvio: '2024-12-27', estado: 'Pendiente', badgeClass: 'bg-warning' },
    { id: 4, numero: 'ISF-2024-100004', importador: 'Logistica Internacional SA', vendedor: 'Hamburg Exports GmbH', paisOrigen: 'Alemania', puertoDescarga: 'Altamira', fechaEnvio: '2024-12-28', estado: 'Rechazado', badgeClass: 'bg-danger' },
    { id: 5, numero: 'ISF-2024-100005', importador: 'Grupo Comercial Azteca', vendedor: 'Taiwan Components Inc', paisOrigen: 'Taiwan', puertoDescarga: 'Manzanillo', fechaEnvio: '2024-12-29', estado: 'Aceptado', badgeClass: 'bg-success' },
    { id: 6, numero: 'ISF-2024-100006', importador: 'Importaciones del Sur SA', vendedor: 'Tokyo Industries JP', paisOrigen: 'Japon', puertoDescarga: 'Veracruz', fechaEnvio: '2024-12-30', estado: 'Pendiente', badgeClass: 'bg-warning' },
  ];
}
