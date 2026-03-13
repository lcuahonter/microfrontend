import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConsultaDetalleDictamenCofepris512516Component } from "./consulta-detalle-dictamen-cofepris-512-516.component";

describe('ConsultaDetalleDictamenComponent', () => {
  let component: ConsultaDetalleDictamenCofepris512516Component;
  let fixture: ComponentFixture<ConsultaDetalleDictamenCofepris512516Component>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaDetalleDictamenCofepris512516Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultaDetalleDictamenCofepris512516Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});