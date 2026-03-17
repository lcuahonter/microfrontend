import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Evaluar26030Component } from './evaluar-26030.component';

describe('Evaluar26030Component', () => {
  let component: Evaluar26030Component;
  let fixture: ComponentFixture<Evaluar26030Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Evaluar26030Component],
    }).compileComponents();

    fixture = TestBed.createComponent(Evaluar26030Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
