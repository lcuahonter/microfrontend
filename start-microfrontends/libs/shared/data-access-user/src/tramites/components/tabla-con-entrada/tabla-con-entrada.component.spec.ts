import { EventEmitter } from '@angular/core';
import { TablaConEntradaComponent } from './tabla-con-entrada.component';

fdescribe('TablaConEntradaComponent', () => {
  let component: TablaConEntradaComponent<any>;
  let mockFilaSeleccionada: jasmine.SpyObj<EventEmitter<any>>;

  beforeEach(() => {
    // Create a mock of EventEmitter with a spy on 'emit' method
    mockFilaSeleccionada = jasmine.createSpyObj('EventEmitter', ['emit']);
    component = new TablaConEntradaComponent();
    component.filaSeleccionada = mockFilaSeleccionada;
    component.configuracionTabla = [
      { encabezado: 'Columna 1', clave: (row: any) => row.col1, orden: 3 },
      { encabezado: 'Columna 2', clave: (row: any) => row.col2, orden: 1 },
      { encabezado: 'Columna 3', clave: (row: any) => row.col3, orden: 2 }
    ];
    spyOn(component.listaDeFilaSeleccionada, 'emit');
    component.filasSeleccionadas = [];
    component.datos = [
      { id: 1, nombre: 'Elemento 1' },
      { id: 2, nombre: 'Elemento 2' },
      { id: 3, nombre: 'Elemento 3' },
      { id: 4, nombre: 'Elemento 4' }
    ];

  });

  it('debería devolver las columnas ordenadas por "orden"', () => {
    const configOrdenada = component.obtenerConfiguracionOrdenada();

    // Comprobamos que las columnas estén ordenadas correctamente
    expect(configOrdenada[0].orden).toBe(1);
    expect(configOrdenada[1].orden).toBe(2);
    expect(configOrdenada[2].orden).toBe(3);
  });

  it('debería devolver un arreglo vacío si configuracionTabla está vacío', () => {
    component.configuracionTabla = [];
    const configOrdenada = component.obtenerConfiguracionOrdenada();
    expect(configOrdenada.length).toBe(0);
  });

  it('debería actualizar idFilaSeleccionada y emitir la fila seleccionada correctamente', () => {
    const filaSeleccionadaMock = { calle: 'Calle 123', numeroExterior: '456' };
    const idFila = 1;

    // Llamamos al método con los valores simulados
    component.seleccionarFila(idFila, filaSeleccionadaMock);

    // Verificamos que 'idFilaSeleccionada' se haya actualizado correctamente
    expect(component.idFilaSeleccionada).toBe(idFila);

    // Verificamos que el método 'emit' haya sido llamado con la fila seleccionada
    expect(mockFilaSeleccionada.emit).toHaveBeenCalledWith(filaSeleccionadaMock);
  });

  it('debería deseleccionar todos los elementos cuando se desmarca el checkbox "Seleccionar todo"', () => {
    const evento = { target: { checked: false } } as unknown as Event; // Simulamos el evento cuando el checkbox está desmarcado

    // Llamamos al método con el evento
    component.seleccionarDeseleccionarTodos(evento);

    // Comprobamos que el método emitió un array vacío
    expect(component.listaDeFilaSeleccionada.emit).toHaveBeenCalledWith([]);
  });

  it('debería actualizar el array de filas seleccionadas correctamente cuando se marca el checkbox "Seleccionar todo"', () => {
    const evento = { target: { checked: true } } as unknown as Event;

    // Llamamos al método
    component.seleccionarDeseleccionarTodos(evento);

    // Comprobamos que las filas seleccionadas contienen todos los índices
    expect(component.filasSeleccionadas).toEqual([0, 1, 2, 3]);
  });

  it('debería limpiar el array de filas seleccionadas cuando se desmarca el checkbox "Seleccionar todo"', () => {
    const evento = { target: { checked: false } } as unknown as Event;

    // Llamamos al método
    component.seleccionarDeseleccionarTodos(evento);

    // Comprobamos que el array de filas seleccionadas está vacío
    expect(component.filasSeleccionadas).toEqual([]);
  });

  it('debería agregar el índice al array filasSeleccionadas cuando el checkbox está seleccionado', () => {
    const evento = { target: { checked: true } } as unknown as Event; // Simulamos el evento cuando el checkbox está marcado
    const indice = 1;

    // Llamamos al método con el evento y el índice
    component.cambiarEstadoCheckbox(evento, indice);

    // Comprobamos que el índice se ha añadido al array de filasSeleccionadas
    expect(component.filasSeleccionadas).toContain(indice);
    // Verificamos que el emitter haya sido llamado con los datos correspondientes
    expect(component.listaDeFilaSeleccionada.emit).toHaveBeenCalledWith([
      { id: 1, nombre: 'Elemento 1' },
      { id: 2, nombre: 'Elemento 2' }
    ]);
  });

  it('debería eliminar el índice del array filasSeleccionadas cuando el checkbox está deseleccionado', () => {
    const evento = { target: { checked: false } } as unknown as Event; // Simulamos el evento cuando el checkbox está desmarcado
    const indice = 1;

    // Inicializamos las filas seleccionadas con un índice previamente agregado
    component.filasSeleccionadas = [1, 2];

    // Llamamos al método con el evento y el índice
    component.cambiarEstadoCheckbox(evento, indice);

    // Comprobamos que el índice ha sido eliminado del array de filasSeleccionadas
    expect(component.filasSeleccionadas).not.toContain(indice);
    // Verificamos que el emitter haya sido llamado con los datos correspondientes
    expect(component.listaDeFilaSeleccionada.emit).toHaveBeenCalledWith([
      { id: 2, nombre: 'Elemento 2' }
    ]);
  });

  it('no debería agregar el índice al array filasSeleccionadas si ya está presente cuando se selecciona el checkbox', () => {
    const evento = { target: { checked: true } } as unknown as Event;
    const indice = 1;

    // Inicializamos las filas seleccionadas con el índice ya presente
    component.filasSeleccionadas = [1];

    // Llamamos al método con el evento y el índice
    component.cambiarEstadoCheckbox(evento, indice);

    // Comprobamos que el índice no se añade nuevamente al array de filasSeleccionadas
    expect(component.filasSeleccionadas).toEqual([1]);
  });

  it('debería emitir un array vacío si todas las filas son deseleccionadas', () => {
    const evento = { target: { checked: false } } as unknown as Event;
    const indice = 1;

    // Inicializamos las filas seleccionadas con algunos índices
    component.filasSeleccionadas = [1, 2, 3];

    // Llamamos al método para deseleccionar todas las filas
    component.cambiarEstadoCheckbox(evento, indice);

    // Comprobamos que el array de filas seleccionadas se actualiza correctamente
    expect(component.filasSeleccionadas).toEqual([2, 3]);
    // Verificamos que el emitter haya sido llamado con los datos restantes
    expect(component.listaDeFilaSeleccionada.emit).toHaveBeenCalledWith([
      { id: 2, nombre: 'Elemento 2' },
      { id: 3, nombre: 'Elemento 3' }
    ]);
  });

});