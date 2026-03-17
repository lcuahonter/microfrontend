import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectoresYMercanciasComponent } from './sectores-y-mercancias.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SectoresYMercanciasComponent', () => {
  let component: SectoresYMercanciasComponent;
  let fixture: ComponentFixture<SectoresYMercanciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectoresYMercanciasComponent,HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SectoresYMercanciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.sectoresForm.value).toEqual({ sector: '', fraccion: '' });
  });

  it('should have a valid form when fraccion is less than or equal to 8 characters', () => {
    component.sectoresForm.controls['fraccion'].setValue('12345678');
    expect(component.sectoresForm.valid).toBe(true);
  });

  it('should have an invalid form when fraccion is more than 8 characters', () => {
    component.sectoresForm.controls['fraccion'].setValue('123456789');
    expect(component.sectoresForm.invalid).toBe(true);
  });
});
