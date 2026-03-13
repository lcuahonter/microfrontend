import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-isf5-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [],
  template: `
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0"><i class="bi bi-file-earmark-check me-2"></i>{{ titulo }}</h4>
        </div>
        <div class="card-body">
          <p class="lead">Importer Security Filing ({{ titulo }}) - Manifiestos manifestacionvalor</p>

          <div class="row mb-3">
            <div class="col-md-3">
              <label class="form-label">No. ISF5</label>
              <input type="text" class="form-control" placeholder="Numero ISF5..." />
            </div>
            <div class="col-md-3">
              <label class="form-label">Agente Aduanal</label>
              <input type="text" class="form-control" placeholder="Buscar agente..." />
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
                  <th>No. ISF5</th>
                  <th>Agente Aduanal</th>
                  <th>Importador</th>
                  <th>Puerto Descarga</th>
                  <th>Contenedores</th>
                  <th>Fecha Envio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of datosIsf5; track item.id) {
                  <tr class="table-row">
                    <td><strong>{{ item.numero }}</strong></td>
                    <td>{{ item.agenteAduanal }}</td>
                    <td>{{ item.importador }}</td>
                    <td>{{ item.puertoDescarga }}</td>
                    <td class="text-center">{{ item.contenedores }}</td>
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
export class Isf5Page {
  titulo = 'ISF5';

  links = [
    { nombre: 'Bitacora', ruta: '../bitacora' },
    { nombre: 'House', ruta: '../house' },
    { nombre: 'Contenedores', ruta: '../contenedores' },
    { nombre: 'Master', ruta: '../master' },
    { nombre: 'Manifiesto', ruta: '../manifiesto' },
    { nombre: 'Movimientos', ruta: '../movimientos' },
    { nombre: 'ISF10', ruta: '../isf10' },
    { nombre: 'Plus3', ruta: '../plus3' }
  ];

  datosIsf5 = [
    { id: 1, numero: 'ISF5-2024-050001', agenteAduanal: 'Agencia Aduanal Martinez', importador: 'Comercializadora del Norte SA', puertoDescarga: 'Manzanillo', contenedores: 3, fechaEnvio: '2024-12-25', estado: 'Aceptado', badgeClass: 'bg-success' },
    { id: 2, numero: 'ISF5-2024-050002', agenteAduanal: 'Despachos Integrales SA', importador: 'Importadora Pacific SA', puertoDescarga: 'Lazaro Cardenas', contenedores: 2, fechaEnvio: '2024-12-26', estado: 'Aceptado', badgeClass: 'bg-success' },
    { id: 3, numero: 'ISF5-2024-050003', agenteAduanal: 'Grupo Aduanero del Centro', importador: 'Distribuidora Centro SA', puertoDescarga: 'Veracruz', contenedores: 5, fechaEnvio: '2024-12-27', estado: 'Pendiente', badgeClass: 'bg-warning' },
    { id: 4, numero: 'ISF5-2024-050004', agenteAduanal: 'Servicios Aduanales Premium', importador: 'Logistica Internacional SA', puertoDescarga: 'Altamira', contenedores: 1, fechaEnvio: '2024-12-28', estado: 'Rechazado', badgeClass: 'bg-danger' },
    { id: 5, numero: 'ISF5-2024-050005', agenteAduanal: 'Consultoria Aduanera Global', importador: 'Grupo Comercial Azteca', puertoDescarga: 'Manzanillo', contenedores: 4, fechaEnvio: '2024-12-29', estado: 'Aceptado', badgeClass: 'bg-success' },
    { id: 6, numero: 'ISF5-2024-050006', agenteAduanal: 'Agencia Aduanal Martinez', importador: 'Importaciones del Sur SA', puertoDescarga: 'Veracruz', contenedores: 2, fechaEnvio: '2024-12-30', estado: 'Pendiente', badgeClass: 'bg-warning' },
  ];
}
