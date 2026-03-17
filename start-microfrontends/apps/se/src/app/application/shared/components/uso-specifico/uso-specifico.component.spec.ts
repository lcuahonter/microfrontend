import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsoSpecificoComponent } from './uso-specifico.component';

describe('UsoSpecificoComponent', () => {
  let component: UsoSpecificoComponent;
  let fixture: ComponentFixture<UsoSpecificoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsoSpecificoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsoSpecificoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
