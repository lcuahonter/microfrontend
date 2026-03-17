import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarOpinionComponent801 } from './registrar-opinion-801.component';

describe('RegistrarOpinionComponent801', () => {
  let component: RegistrarOpinionComponent801;
  let fixture: ComponentFixture<RegistrarOpinionComponent801>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarOpinionComponent801],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarOpinionComponent801);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
