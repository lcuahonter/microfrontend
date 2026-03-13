import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosPorGarantiaComponent } from './datos-por-garantia.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosPorGarantiaComponent', () => {
  let component: DatosPorGarantiaComponent;
  let fixture: ComponentFixture<DatosPorGarantiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosPorGarantiaComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPorGarantiaComponent);
    component = fixture.componentInstance;
    component.consultaState = {
      readonly: false,
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
