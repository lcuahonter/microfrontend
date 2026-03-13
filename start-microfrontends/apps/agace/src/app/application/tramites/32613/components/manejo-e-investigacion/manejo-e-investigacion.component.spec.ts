import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManejoEInvestigacionComponent } from './manejo-e-investigacion.component';

describe('ManejoEInvestigacionComponent', () => {
  let component: ManejoEInvestigacionComponent;
  let fixture: ComponentFixture<ManejoEInvestigacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManejoEInvestigacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManejoEInvestigacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
