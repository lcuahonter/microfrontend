import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportacionVehiculosNuevosPageComponent } from './importacion-vehiculos-nuevos-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PageComponent', () => {
  let component: ImportacionVehiculosNuevosPageComponent;
  let fixture: ComponentFixture<ImportacionVehiculosNuevosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportacionVehiculosNuevosPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportacionVehiculosNuevosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
