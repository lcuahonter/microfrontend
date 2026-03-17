import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConsultaDetalleRequerimientoComponent } from "./consulta-detalle-requerimiento.component";


describe('ConsultaDetalleRequerimientoComponent', () => {
  let component: ConsultaDetalleRequerimientoComponent;
  let fixture: ComponentFixture<ConsultaDetalleRequerimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaDetalleRequerimientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultaDetalleRequerimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});