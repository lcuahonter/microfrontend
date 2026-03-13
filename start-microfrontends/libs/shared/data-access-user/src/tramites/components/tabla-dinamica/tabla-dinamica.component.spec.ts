import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaDinamicaComponent } from './tabla-dinamica.component';
import { ESTADO_REGISTRO, TEXTO_FILA_REGISTRO } from '../../../tramites/constantes/constantes';

interface DatosPrueba {
  id: number;
  nombre: string;
  desEstatus?: string;
}

describe('TablaDinamicaComponent', () => {
  let component: TablaDinamicaComponent<DatosPrueba>;
  let fixture: ComponentFixture<TablaDinamicaComponent<DatosPrueba>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaDinamicaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TablaDinamicaComponent as any);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir "filaSeleccionada" y actualizar el ID seleccionado al ejecutar seleccionarFila()', () => {
    const datosPrueba : DatosPrueba = { id: 1, nombre: 'Test' };
    const espia = jest.spyOn(component.filaSeleccionada, 'emit');

    component.seleccionarFila(1, datosPrueba);

    expect(component.idFilaSeleccionada).toBe(1);
    expect(espia).toHaveBeenCalledWith(datosPrueba);
  });

  it('debería alternar la selección del checkbox', () => {
    component.datos = [
      { id: 1, nombre: 'Row 1' },
      { id: 2, nombre: 'Row 2' },
    ];

    const evento: any = { target: { checked: true } };

    const espiaEmitir  = jest.spyOn(component.listaDeFilaSeleccionada, 'emit');
    component.cambiarEstadoCheckbox(evento, 0);

    expect(component.filasSeleccionadas).toContain(0);
    expect(espiaEmitir).toHaveBeenCalledWith([component.datos[0]]);
  });

  it('debería seleccionar y deseleccionar todas las filas', () => {
    component.datos = [
      { id: 1, nombre: 'Row 1' },
      { id: 2, nombre: 'Row 2' },
    ];

    const espiaEmitir = jest.spyOn(component.listaDeFilaSeleccionada, 'emit');

    component.seleccionarDeseleccionarTodos({ target: { checked: true } } as any);
    expect(component.filasSeleccionadas).toEqual([0, 1]);
    expect(espiaEmitir).toHaveBeenCalledWith(component.datos);

    component.seleccionarDeseleccionarTodos({ target: { checked: false } } as any);
    expect(component.filasSeleccionadas).toEqual([]);
    expect(espiaEmitir).toHaveBeenCalledWith([]);
  });

  it('debería emitir filaClic si desactivarEmitirEvento es verdadero', () => {
    component.desactivarEmitirEvento = true;
    const espia = jest.spyOn(component.filaClic, 'emit');
    const datosPrueba = { id: 1, nombre: 'Row' };

    component.onFilaClic(datosPrueba);
    expect(espia).toHaveBeenCalledWith(datosPrueba);
  });

  it('debería emitir alternarValor cuando cambiarValor es llamado', () => {
    const espia = jest.spyOn(component.alternarValor, 'emit');
    const eventoFila  = { row: { id: 1, nombre: 'Row' }, column: 'nombre' };

    component.cambiarValor(eventoFila);
    expect(espia).toHaveBeenCalledWith(eventoFila);
  });

  it('debería retornar ACTIVAR si fila.desEstatus es BAJA en obtenerTextoBoton()', () => {
    const fila = { id: 1, nombre: 'Row', desEstatus: TEXTO_FILA_REGISTRO.BAJA };
    const resultado  = component.obtenerTextoBoton(fila);

    expect(resultado).toBe(ESTADO_REGISTRO.ACTIVAR);
  });

  it('debería retornar el valor por defecto de botonValor si fila.desEstatus no es BAJA', () => {
    const fila = { id: 1, nombre: 'Row', desEstatus: 'OTRO' };
    const resultado = component.obtenerTextoBoton(fila);

    expect(resultado).toBe(component.batonValor);
  });
});