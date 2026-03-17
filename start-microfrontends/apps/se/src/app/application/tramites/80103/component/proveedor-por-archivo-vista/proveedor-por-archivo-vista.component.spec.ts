import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorPorArchivoVistaComponent } from './proveedor-por-archivo-vista.component';

describe('ProveedorPorArchivoVistaComponent', () => {
  let component: ProveedorPorArchivoVistaComponent;
  let fixture: ComponentFixture<ProveedorPorArchivoVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedorPorArchivoVistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProveedorPorArchivoVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});