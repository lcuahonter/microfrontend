import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultarequerimientosComponent } from './consulta-requerimientos.component';

describe('ConsultarequerimientosComponent', () => {
  let component: ConsultarequerimientosComponent;
  let fixture: ComponentFixture<ConsultarequerimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarequerimientosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarequerimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize encabezadoTablaRequerimiento correctly', () => {
    expect(component.encabezadoTablaRequerimiento).toBeDefined();
    expect(component.encabezadoTablaRequerimiento.length).toBeGreaterThan(0);
  });
  it('should initialize datosTablaRequerimiento correctly', () => {
    expect(component.datosTablaRequerimiento).toBeDefined();
    expect(component.datosTablaRequerimiento.length).toBeGreaterThanOrEqual(0);
  });
});
