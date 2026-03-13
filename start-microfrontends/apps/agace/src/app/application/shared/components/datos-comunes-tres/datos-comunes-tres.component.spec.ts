import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComunesTresComponent } from './datos-comunes-tres.component';

describe('DatosComunesTresComponent', () => {
  let component: DatosComunesTresComponent;
  let fixture: ComponentFixture<DatosComunesTresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosComunesTresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComunesTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
