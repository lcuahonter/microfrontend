import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DatosGeneralesComponent } from './datos-generales.component';

describe('DatosGeneralesComponent', () => {
  let component: DatosGeneralesComponent;
  let fixture: ComponentFixture<DatosGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosGeneralesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario reactivo en ngOnInit', () => {
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.datosGeneralesFormulario).toBeDefined();
  });

  it('debería inicializar el formulario con valores predeterminados', () => {
    component.inicializarFormulario();
    expect(component.datosGeneralesFormulario).toBeDefined();
    expect(component.datosGeneralesFormulario.controls).toBeDefined();
  });

  it('debería tener la estructura correcta del formulario', () => {
    component.inicializarFormulario();
    expect(component.datosGeneralesFormulario instanceof FormGroup).toBe(true);
  });
});