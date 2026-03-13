import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConsultaDetalleObservacionDictamenComponent } from "./consulta-detalle-observacion-dictamen.component";

describe('ConsultaDetalleObservacionDictamenComponent', () => {
  let component: ConsultaDetalleObservacionDictamenComponent;
  let fixture: ComponentFixture<ConsultaDetalleObservacionDictamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaDetalleObservacionDictamenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultaDetalleObservacionDictamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});