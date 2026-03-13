import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaDetalleDictamenCofepris501511Component } from './consulta-detalle-dictamen-cofepris-501-511.component';

describe('ConsultaDetalleDictamenCofepris501511Component', () => {
  let component: ConsultaDetalleDictamenCofepris501511Component;
  let fixture: ComponentFixture<ConsultaDetalleDictamenCofepris501511Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaDetalleDictamenCofepris501511Component],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ConsultaDetalleDictamenCofepris501511Component
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
