import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnexoUnoSeccionComponent } from './anexo-uno-seccion.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AnexoUnoSeccionComponent', () => {
  let component: AnexoUnoSeccionComponent;
  let fixture: ComponentFixture<AnexoUnoSeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnexoUnoSeccionComponent, ReactiveFormsModule, FormsModule],
      schemas: [NO_ERRORS_SCHEMA], // Ignores unknown components in the template
    }).compileComponents();

    fixture = TestBed.createComponent(AnexoUnoSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize all forms on init', () => {
    expect(component.anexoUnoFormGroup).toBeDefined();
    expect(component.anexoDosFormGroup).toBeDefined();
    expect(component.proyectoForm).toBeDefined();
    expect(component.formularioProveedorCliente).toBeDefined();
    expect(component.complimentarForm).toBeDefined();
  });

  it('should add item to anexoUnoTablaLista when form is valid', () => {
    component.anexoUnoFormGroup.setValue({
      fraccionArancelaria: '123',
      descripcion: 'test desc',
    });

    component.agregarAnexoUno();

    expect(component.anexoUnoTablaLista.length).toBe(1);
    expect(component.anexoUnoFormGroup.value.fraccionArancelaria).toBeFalsy(); // form is reset
  });

  it('should add item to anexoFraccionAnarelaria when form is valid', () => {
    component.anexoDosFormGroup.setValue({
      fraccionArancelaria: '999',
      descripcion: 'some desc',
    });

    component.agregarFraccionAnarelaria();

    expect(component.anexoFraccionAnarelaria.length).toBe(1);
  });

 

  it('should add transformed data to proyectoImmexTablaLista when form is valid', () => {
    component.proyectoForm.setValue({
      descripcion: 'ABC Project',
      tipoDeDocumente: 'Contrato',
      fechaDeFirma: '2024-01-01',
      fechaDeVigencia: '2025-01-01',
      rfcTaxId: 'XYZ123',
      razonSocial: 'Empresa XYZ',
    });

    component.agregarProyectoImmex();

    expect(component.proyectoImmexTablaLista.length).toBe(1);
    expect(component.proyectoImmexTablaLista[0].encabezadoFraccion).toBe('ABC Project');
  });

  it('should not add to proyectoImmexTablaLista if form is invalid', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    component.proyectoForm.reset();

    component.agregarProyectoImmex();

    expect(component.proyectoImmexTablaLista.length).toBe(0);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Form is invalid. Please fill all required fields.'
    );
  });

  it('should add item to proveedorTablaLista when form is valid', () => {
    component.formularioProveedorCliente.setValue({
      descripcionComercial: 'Test product',
      paisDestino: 'MX',
      rfc: 'RFC001',
      razonSocialCliente: 'Cliente SA',
    });

    component.agregarProveedorCliente();

    expect(component.proveedorTablaLista.length).toBe(1);
  });

  it('should not add to proveedorTablaLista if form is invalid', () => {
    component.formularioProveedorCliente.reset();

    component.agregarProveedorCliente();

    expect(component.proveedorTablaLista.length).toBe(0);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(
      component['destroyNotifier$'],
      'complete'
    );
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
