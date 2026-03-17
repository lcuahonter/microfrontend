import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProveedorClienteComponent } from './proveedor-cliente.component';

describe('ProveedorClienteComponent', () => {
  let component: ProveedorClienteComponent;
  let fixture: ComponentFixture<ProveedorClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedorClienteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProveedorClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
