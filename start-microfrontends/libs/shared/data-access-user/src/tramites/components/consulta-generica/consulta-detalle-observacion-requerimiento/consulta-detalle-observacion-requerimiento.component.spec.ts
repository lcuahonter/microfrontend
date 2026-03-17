import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConsultaDetalleObservacionRequerimientoComponent } from "./consulta-detalle-observacion-requerimiento.component";


describe('ConsultaDetalleObservacionRequerimientoComponent', () => {
  let component: ConsultaDetalleObservacionRequerimientoComponent;
  let fixture: ComponentFixture<ConsultaDetalleObservacionRequerimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaDetalleObservacionRequerimientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultaDetalleObservacionRequerimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});