import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaDetalleRequerimientoCofepris501511Component } from './consulta-detalle-requerimiento-cofepris-501-511.component';

describe('ConsultaDetalleRequerimientoCofepris501511Component', () => {
  let component: ConsultaDetalleRequerimientoCofepris501511Component;
  let fixture: ComponentFixture<ConsultaDetalleRequerimientoCofepris501511Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaDetalleRequerimientoCofepris501511Component],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ConsultaDetalleRequerimientoCofepris501511Component
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
