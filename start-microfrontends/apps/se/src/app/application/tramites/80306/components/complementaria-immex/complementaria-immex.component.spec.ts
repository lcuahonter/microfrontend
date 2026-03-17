import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComplementariaImmexComponent } from './complementaria-immex.component';
import { TestBed } from '@angular/core/testing';

describe('ComplementariaImmexComponent', () => {
  let fixture;
  let component!: ComplementariaImmexComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [

      ]
    }).overrideComponent(ComplementariaImmexComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ComplementariaImmexComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('debería ejecutar #constructor()', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener indice inicial en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debe actualizar indice con #seleccionaTab()', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
    component.seleccionaTab(0);
    expect(component.indice).toBe(0);
    component.seleccionaTab(-2);
    expect(component.indice).toBe(-2);
    component.seleccionaTab(999);
    expect(component.indice).toBe(999);
  });

  it('debe ser standalone y tener el selector correcto', () => {
    const metadata = (ComplementariaImmexComponent as any).ɵcmp;
    expect(metadata.standalone).toBe(true);
    expect(metadata.selectors[0][0]).toBe('app-complementaria-immex');
  });

});