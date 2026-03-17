import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConsultaDetalleDictamenComponent } from "./consulta-detalle-dictamen.component";

describe('ConsultaDetalleDictamenComponent', () => {
  let component: ConsultaDetalleDictamenComponent;
  let fixture: ComponentFixture<ConsultaDetalleDictamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaDetalleDictamenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultaDetalleDictamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});