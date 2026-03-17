import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComposicionComponent } from './composicion.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ComposicionComponent', () => {
  let component: ComposicionComponent;
  let fixture: ComponentFixture<ComposicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComposicionComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ComposicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have defined the form composicionForm', () => {
    expect(component.composicionForm).toBeTruthy();
  });

  it('should have initialize the form composicionForm', () => {
    expect(component.composicionForm).toBeDefined();
  });

  it('should add a new item to composicionTablaDatos and reset the form when agregar is called with valid form', () => {
    const mockStoreUpdate = jest.spyOn(component['tramite230501Store'], 'update');
    const mockBack = jest.spyOn(component['ubicaccion'], 'back');

    component.composicionForm.setValue({
      componenteMaterial: 'Material A',
      porcentajeConcentracion: 50,
    });
    component.agregar();
    expect(mockStoreUpdate).toHaveBeenCalledWith(expect.any(Function));
    expect(mockStoreUpdate).toHaveBeenCalledTimes(2);
    expect(mockBack).toHaveBeenCalled();
    expect(component.composicionForm.valid).toBe(false);
  });

  it('should not add a new item or reset the form when agregar is called with invalid form', () => {
    const mockStoreUpdate = jest.spyOn(component['tramite230501Store'], 'update');
    const mockBack = jest.spyOn(component['ubicaccion'], 'back');

    component.composicionForm.setValue({
      componenteMaterial: '',
      porcentajeConcentracion: 150,
    });
    component.agregar();
    expect(mockStoreUpdate).not.toHaveBeenCalled();
    expect(mockBack).not.toHaveBeenCalled();
    expect(component.composicionForm.valid).toBe(false);
  });

  it('should reset the form and navigate back when cancelar is called', () => {
    const mockBack = jest.spyOn(component['ubicaccion'], 'back');
    const mockReset = jest.spyOn(component.composicionForm, 'reset');
    component.cancelar();
    expect(mockReset).toHaveBeenCalled();
    expect(mockBack).toHaveBeenCalled();
  });

  it('should reset the form when limpiarComposicion is called', () => {
    const mockReset = jest.spyOn(component.composicionForm, 'reset');
    component.limpiarComposicion();
    expect(mockReset).toHaveBeenCalled();
  });
});
