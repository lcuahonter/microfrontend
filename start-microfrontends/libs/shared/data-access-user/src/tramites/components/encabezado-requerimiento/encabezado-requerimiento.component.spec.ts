import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncabezadoRequerimientoComponent } from './encabezado-requerimiento.component';


describe('RequerimientoInformacionComponent', () => {
  let component: EncabezadoRequerimientoComponent;
  let fixture: ComponentFixture<EncabezadoRequerimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncabezadoRequerimientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EncabezadoRequerimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});