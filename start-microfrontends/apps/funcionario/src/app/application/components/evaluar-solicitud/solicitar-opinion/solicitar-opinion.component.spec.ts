import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitarOpinionComponent } from './solicitar-opinion.component';

describe('SolicitarOpinionComponent', () => {
  let component: SolicitarOpinionComponent;
  let fixture: ComponentFixture<SolicitarOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarOpinionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitarOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
