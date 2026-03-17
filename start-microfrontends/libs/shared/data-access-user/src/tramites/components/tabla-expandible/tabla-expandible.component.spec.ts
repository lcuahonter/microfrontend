import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaExpandibleComponent } from './tabla-expandible.component';
import { TablaSeleccion } from '@ng-mf/data-access-user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

// Interfaces de prueba
interface ItemPrueba {
  id: number;
  nombre: string;
}

interface DetalleItemPrueba {
  id: number;
  descripcion: string;
}

// Componente de prueba para poder probar el componente con un host
@Component({
  template: `
    <app-tabla-expandible
      [datos]="datos"
      [configuracionTabla]="configuracionTabla"
      [configuracionTablaAnidada]="configuracionTablaAnidada"
      [obtenerDatosAnidados]="obtenerDatosAnidados"
      [tipoSeleccionTabla]="tipoSeleccionTabla"
      [tableId]="'tabla-prueba'"
      (filaClic)="onFilaClic($event)"
      (filaSeleccionada)="onFilaSeleccionada($event)"
      (listaDeFilaSeleccionada)="onListaDeFilaSeleccionada($event)"
      (alternarValor)="onAlternarValor($event)"
    ></app-tabla-expandible>
  `
})
class ComponenteHostPrueba {
  @ViewChild(TablaExpandibleComponent) tablaExpandible!: TablaExpandibleComponent<ItemPrueba, DetalleItemPrueba>;
  
  datos: ItemPrueba[] = [
    { id: 1, nombre: 'Item 1' },
    { id: 2, nombre: 'Item 2' },
    { id: 3, nombre: 'Item 3' }
  ];
  
  configuracionTabla = [
    { encabezado: 'ID', clave: (item: ItemPrueba) => item.id, orden: 1 },
    { encabezado: 'Nombre', clave: (item: ItemPrueba) => item.nombre, orden: 0, hiperenlace: true }
  ];
  
  configuracionTablaAnidada = [
    { encabezado: 'ID', clave: (item: DetalleItemPrueba) => item.id, orden: 1 },
    { encabezado: 'Descripción', clave: (item: DetalleItemPrueba) => item.descripcion, orden: 0 }
  ];
  
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;
  
  detalles: Map<number, DetalleItemPrueba[]> = new Map([
    [1, [{ id: 101, descripcion: 'Detalle 1.1' }, { id: 102, descripcion: 'Detalle 1.2' }]],
    [2, [{ id: 201, descripcion: 'Detalle 2.1' }]],
    [3, []]
  ]);
  
  obtenerDatosAnidados = (item: ItemPrueba): DetalleItemPrueba[] => {
    return this.detalles.get(item.id) || [];
  };
  
  onFilaClic = jest.fn();
  onFilaSeleccionada = jest.fn();
  onListaDeFilaSeleccionada = jest.fn();
  onAlternarValor = jest.fn();
}

describe('TablaExpandibleComponent', () => {
  let component: TablaExpandibleComponent<ItemPrueba, DetalleItemPrueba>;
  let hostComponent: ComponenteHostPrueba;
  let fixture: ComponentFixture<ComponenteHostPrueba>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponenteHostPrueba],
      imports: [
        CommonModule,
        FormsModule,
        TablaExpandibleComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteHostPrueba);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
    component = hostComponent.tablaExpandible;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Inicialización', () => {
    it('debería inicializar con los valores correctos', () => {
      expect(component.datos.length).toBe(3);
      expect(component.configuracionTabla.length).toBe(2);
      expect(component.configuracionTablaAnidada.length).toBe(2);
      expect(component.tipoSeleccionTabla).toBe(TablaSeleccion.CHECKBOX);
      expect(component.filasSeleccionadas).toEqual([]);
      expect(component.filasExpandidas.size).toBe(0);
    });
  });

  describe('Métodos de ordenación', () => {
    it('debería ordenar la configuración de columnas', () => {
      const configuracionOrdenada = component.obtenerConfiguracionOrdenada();
      expect(configuracionOrdenada[0].encabezado).toBe('Nombre');
      expect(configuracionOrdenada[1].encabezado).toBe('ID');
    });

    it('debería ordenar la configuración de columnas anidadas', () => {
      const configuracionAnidadaOrdenada = component.obtenerConfiguracionAnidadaOrdenada();
      expect(configuracionAnidadaOrdenada[0].encabezado).toBe('Descripción');
      expect(configuracionAnidadaOrdenada[1].encabezado).toBe('ID');
    });
  });

  describe('Selección de filas', () => {
    it('debería seleccionar una fila y emitir el evento', () => {
      const fila = hostComponent.datos[1];
      component.seleccionarFila(1, fila);
      
      expect(component.idFilaSeleccionada).toBe(1);
      expect(hostComponent.onFilaSeleccionada).toHaveBeenCalledWith(fila);
    });

    it('debería manejar el cambio de estado del checkbox (seleccionar)', () => {
      const mockEvent = { target: { checked: true } } as unknown as Event;
      component.cambiarEstadoCheckbox(mockEvent, 0);
      
      expect(component.filasSeleccionadas).toContain(0);
      expect(hostComponent.onFilaSeleccionada).toHaveBeenCalledWith(hostComponent.datos[0]);
      expect(hostComponent.onListaDeFilaSeleccionada).toHaveBeenCalledWith([hostComponent.datos[0]]);
    });

    it('debería manejar el cambio de estado del checkbox (deseleccionar)', () => {
      // Primero seleccionamos
      component.filasSeleccionadas = [0, 1];
      
      // Luego deseleccionamos el índice 0
      const mockEvent = { target: { checked: false } } as unknown as Event;
      component.cambiarEstadoCheckbox(mockEvent, 0);
      
      expect(component.filasSeleccionadas).not.toContain(0);
      expect(component.filasSeleccionadas).toContain(1);
      expect(hostComponent.onListaDeFilaSeleccionada).toHaveBeenCalledWith([hostComponent.datos[1]]);
    });

    it('debería seleccionar todas las filas', () => {
      const mockEvent = { target: { checked: true } } as unknown as Event;
      component.seleccionarDeseleccionarTodos(mockEvent);
      
      expect(component.filasSeleccionadas.length).toBe(3);
      expect(hostComponent.onListaDeFilaSeleccionada).toHaveBeenCalledWith(hostComponent.datos);
    });

    it('debería deseleccionar todas las filas', () => {
      // Primero seleccionamos todas
      component.filasSeleccionadas = [0, 1, 2];
      
      // Luego deseleccionamos todas
      const mockEvent = { target: { checked: false } } as unknown as Event;
      component.seleccionarDeseleccionarTodos(mockEvent);
      
      expect(component.filasSeleccionadas.length).toBe(0);
      expect(hostComponent.onListaDeFilaSeleccionada).toHaveBeenCalledWith([]);
    });
  });

  describe('Eventos de clic', () => {
    it('debería emitir el evento filaClic', () => {
      const fila = hostComponent.datos[0];
      component.onFilaClic(fila);
      
      expect(hostComponent.onFilaClic).toHaveBeenCalledWith(fila);
    });

    it('debería emitir el evento alternarValor', () => {
      const fila = hostComponent.datos[0];
      component.cambiarValor(fila);
      
      expect(hostComponent.onAlternarValor).toHaveBeenCalledWith(fila);
    });
  });

  describe('Expansión de filas', () => {
    it('debería expandir una fila', () => {
      const mockEvent = { stopPropagation: jest.fn() } as unknown as Event;
      component.alternarExpandirFila(1, mockEvent);
      
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(component.estaFilaExpandida(1)).toBe(true);
    });

    it('debería contraer una fila expandida', () => {
      // Primero expandimos
      component.filasExpandidas.add(1);
      
      // Luego contraemos
      const mockEvent = { stopPropagation: jest.fn() } as unknown as Event;
      component.alternarExpandirFila(1, mockEvent);
      
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(component.estaFilaExpandida(1)).toBe(false);
    });

    it('debería verificar correctamente si una fila está expandida', () => {
      component.filasExpandidas.add(2);
      
      expect(component.estaFilaExpandida(2)).toBe(true);
      expect(component.estaFilaExpandida(1)).toBe(false);
    });
  });

  describe('Setter de inputSelection', () => {
    it('debería actualizar idFilaSeleccionada cuando se establece inputSelection', () => {
      component.inputSelection = 2;
      
      expect(component.idFilaSeleccionada).toBe(2);
    });
  });

  // Pruebas para diferentes tipos de selección
  describe('Tipos de selección', () => {
    it('debería funcionar con TablaSeleccion.RADIO', () => {
      hostComponent.tipoSeleccionTabla = TablaSeleccion.RADIO;
      fixture.detectChanges();
      
      expect(component.tipoSeleccionTabla).toBe(TablaSeleccion.RADIO);
    });

    it('debería funcionar con TablaSeleccion.BUTTON', () => {
      hostComponent.tipoSeleccionTabla = TablaSeleccion.BUTTON;
      fixture.detectChanges();
      
      expect(component.tipoSeleccionTabla).toBe(TablaSeleccion.BUTTON);
    });
  });
});
