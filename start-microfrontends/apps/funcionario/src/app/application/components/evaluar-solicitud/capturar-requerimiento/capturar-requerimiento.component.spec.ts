import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapturarRequerimientoComponent } from './capturar-requerimiento.component';

describe('CapturarRequerimientoComponent', () => {
  let component: CapturarRequerimientoComponent;
  let fixture: ComponentFixture<CapturarRequerimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapturarRequerimientoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapturarRequerimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
