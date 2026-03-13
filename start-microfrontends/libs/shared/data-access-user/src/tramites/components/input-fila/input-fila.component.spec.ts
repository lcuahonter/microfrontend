import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputFilaComponent } from './input-fila.component';

describe('InputFilaComponent', () => {
  let component: InputFilaComponent;
  let fixture: ComponentFixture<InputFilaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFilaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputFilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
