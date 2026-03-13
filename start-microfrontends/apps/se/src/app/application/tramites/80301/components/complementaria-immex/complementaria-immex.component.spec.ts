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

  it('debe ejecutar #seleccionaTab()', () => {

    component.seleccionaTab(1);

  });

});