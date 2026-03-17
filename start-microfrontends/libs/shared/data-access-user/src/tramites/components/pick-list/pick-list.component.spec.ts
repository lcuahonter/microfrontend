import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PickListComponent } from './pick-list.component';

interface ItemMock {
  id: number;
  nombre: string;
}

describe('PickListComponent', () => {
  let component: PickListComponent<ItemMock>;
  let fixture: ComponentFixture<PickListComponent<ItemMock>>;

  const itemMock: ItemMock = { id: 1, nombre: 'Item 1' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PickListComponent<ItemMock>);
    component = fixture.componentInstance;

    // ✅ Inputs signals correctamente asignados
    fixture.componentRef.setInput(
      'displayWith',
      (item: ItemMock) => item.nombre
    );
    fixture.componentRef.setInput(
      'trackBy',
      (item: ItemMock) => item.id
    );

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit agregar event when Agregar is called', () => {
    const spy = jest.spyOn(component.agregar, 'emit');

    component.itemDisponibleSeleccionado = itemMock;
    component.Agregar();

    expect(spy).toHaveBeenCalledWith(itemMock);
    expect(component.itemDisponibleSeleccionado).toBeUndefined();
  });

  it('should not emit agregar if no item is selected', () => {
    const spy = jest.spyOn(component.agregar, 'emit');

    component.itemDisponibleSeleccionado = undefined;
    component.Agregar();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit eliminar event when Eliminar is called', () => {
    const spy = jest.spyOn(component.eliminar, 'emit');

    component.itemAEliminarSeleccionado = itemMock;
    component.Eliminar();

    expect(spy).toHaveBeenCalledWith(itemMock);
    expect(component.itemAEliminarSeleccionado).toBeUndefined();
  });

  it('should display item using displayWith input', () => {
    const result = component.display(itemMock);
    expect(result).toBe('Item 1');
  });

  it('should track item using trackBy input', () => {
    const result = component.track(itemMock);
    expect(result).toBe(1 as unknown as ItemMock);
  });
});
