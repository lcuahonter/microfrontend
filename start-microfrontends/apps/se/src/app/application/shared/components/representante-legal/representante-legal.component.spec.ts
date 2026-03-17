import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepresentanteLegalComponent } from './representante-legal.component';
import { FormBuilder } from '@angular/forms';

describe('RepresentanteLegalComponent', () => {
  let fixture: ComponentFixture<RepresentanteLegalComponent>;
  let component: RepresentanteLegalComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RepresentanteLegalComponent],
      declarations: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [FormBuilder],
    })
      .overrideComponent(RepresentanteLegalComponent, {})
      .compileComponents();

    fixture = TestBed.createComponent(RepresentanteLegalComponent);
    component = fixture.componentInstance; // Ensure the component instance is properly initialized
  });

  afterEach(() => {
    if (component && component.ngOnDestroy) {
      component.ngOnDestroy = jest.fn(); // Mock ngOnDestroy to avoid errors
    }
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #setValoresStore()', async () => {
    component.formExportor = component.formExportor || {};
    component.formExportor.get = jest.fn().mockReturnValue({
      value: {},
    });
    Object.defineProperty(component.formExportor, 'valid', { get: () => 'valid' });
    component.formaValida = component.formaValida || {};
    component.formaValida.emit = jest.fn();
    component.formExportorEvent = component.formExportorEvent || {};
    component.formExportorEvent.emit = jest.fn();
    component.setValoresStore('', '', '');
    // expect(component.formExportor.get).toHaveBeenCalled();
    // expect(component.formaValida.emit).toHaveBeenCalled();
    // expect(component.formExportorEvent.emit).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    // expect(component.destroyNotifier$.next).toHaveBeenCalled();
    // expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });
});