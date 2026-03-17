import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorRequeridoComponent } from './error-requerido.component';

describe('ErrorRequeridoComponent', () => {
  let component: ErrorRequeridoComponent;
  let fixture: ComponentFixture<ErrorRequeridoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorRequeridoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorRequeridoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
