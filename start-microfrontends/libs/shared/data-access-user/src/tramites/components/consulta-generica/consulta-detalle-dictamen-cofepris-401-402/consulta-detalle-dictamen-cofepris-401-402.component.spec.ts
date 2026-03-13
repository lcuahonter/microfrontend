import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaDetalleDictamenCofepris401402Component } from './consulta-detalle-dictamen-cofepris-401-402.component';

describe('ConsultaDetalleDictamenCofepris401402Component', () => {
  let component: ConsultaDetalleDictamenCofepris401402Component;
  let fixture: ComponentFixture<ConsultaDetalleDictamenCofepris401402Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaDetalleDictamenCofepris401402Component],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ConsultaDetalleDictamenCofepris401402Component
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
