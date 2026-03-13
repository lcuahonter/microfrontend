import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComplementariaImmexComponent } from './complementaria-immex.component';

describe('ComplementariaImmexComponent', () => {
  let fixture: ComponentFixture<ComplementariaImmexComponent>;
  let component: { ngOnDestroy: () => void; seleccionaTab: (arg0: {}) => void };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ComplementariaImmexComponent],
      declarations: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [],
    })
      .overrideComponent(ComplementariaImmexComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(ComplementariaImmexComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function () {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab()', async () => {
    component.seleccionaTab({});
  });
});
