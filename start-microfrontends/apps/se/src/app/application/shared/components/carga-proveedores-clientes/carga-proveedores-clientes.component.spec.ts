import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaProveedoresClientesComponent } from './carga-proveedores-clientes.component';

describe('CargaProveedoresClientesComponent', () => {
  let component: CargaProveedoresClientesComponent;
  let fixture: ComponentFixture<CargaProveedoresClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaProveedoresClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaProveedoresClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
