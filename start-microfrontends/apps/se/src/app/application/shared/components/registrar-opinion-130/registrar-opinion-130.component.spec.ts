import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarOpinion130Component } from './registrar-opinion-130.component';

describe('RegistrarOpinion130Component', () => {
  let component: RegistrarOpinion130Component;
  let fixture: ComponentFixture<RegistrarOpinion130Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarOpinion130Component],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarOpinion130Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
