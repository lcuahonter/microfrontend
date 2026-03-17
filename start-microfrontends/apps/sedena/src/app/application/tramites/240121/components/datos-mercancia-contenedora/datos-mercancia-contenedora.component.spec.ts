// @ts-nocheck
import { TestBed } from '@angular/core/testing';
import { DatosMercanciaContenedoraComponent } from './datos-mercancia-contenedora.component';
import { Tramite240121Store } from '../../estados/tramite240121Store.store';
import { of } from 'rxjs';

const mockTramiteStore = {
  updateMercanciaTablaDatos: jest.fn(),
};

describe('DatosMercanciaContenedoraComponent (Jest)', () => {
  let component: DatosMercanciaContenedoraComponent;

  const mockMercancia = [
    {
      nombre: 'Producto Ejemplo',
      cantidad: 100,
      descripcion: 'Producto de ejemplo',
      unidad: 'Kg',
      precio: 150,
      total: 15000,
      rfc: 'RFC123456',
      proveedor: 'Proveedor Ejemplo',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Tramite240121Store, useValue: mockTramiteStore },
      ],
    });

    component = new DatosMercanciaContenedoraComponent(
      mockTramiteStore as any,
    );
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateMercanciaDetalle() with given mock data', () => {
    const spy = jest.spyOn(mockTramiteStore, 'updateMercanciaTablaDatos');

    component.updateMercanciaDetalle(mockMercancia);
    expect(spy).toHaveBeenCalledWith(mockMercancia);
  });
});
