import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CancelacionDeCupoComponent } from './cancelacion-de-cupo.component';

describe('CancelacionDeCupoComponent', () => {
  let component: CancelacionDeCupoComponent;
  let fixture: ComponentFixture<CancelacionDeCupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelacionDeCupoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelacionDeCupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests here to verify component behavior
});