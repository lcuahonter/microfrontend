import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenedorProveedorClienteComponent } from './contenedor-proveedor-cliente.component';

describe('ContenedorProveedorClienteComponent', () => {
  let component: ContenedorProveedorClienteComponent;
  let fixture: ComponentFixture<ContenedorProveedorClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenedorProveedorClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenedorProveedorClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});