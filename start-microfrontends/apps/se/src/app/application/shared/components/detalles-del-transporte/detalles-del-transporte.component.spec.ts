import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesDelTransporteComponent } from './detalles-del-transporte.component';

describe('DetallesDelTransporteComponent', () => {
  let component: DetallesDelTransporteComponent;
  let fixture: ComponentFixture<DetallesDelTransporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesDelTransporteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesDelTransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
