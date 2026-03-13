import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConsultaDetalleDictamenCofeprisComponent } from "./consulta-detalle-dictamen-cofepris.component";

describe('ConsultaDetalleDictamenComponent', () => {
  let component: ConsultaDetalleDictamenCofeprisComponent;
  let fixture: ComponentFixture<ConsultaDetalleDictamenCofeprisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaDetalleDictamenCofeprisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultaDetalleDictamenCofeprisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});