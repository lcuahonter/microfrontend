import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarOpinionComponent } from './registrar-opinion.component';

describe('RegistrarOpinionComponent', () => {
  let component: RegistrarOpinionComponent;
  let fixture: ComponentFixture<RegistrarOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarOpinionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
