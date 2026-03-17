import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleOpinionComponent } from './detalle-opinion.component';

describe('DetalleOpinionComponent', () => {
  let component: DetalleOpinionComponent;
  let fixture: ComponentFixture<DetalleOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleOpinionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
