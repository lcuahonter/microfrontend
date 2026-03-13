import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidadoresDeFormulariosComponent } from './validadores-de-formularios.component';

describe('ValidadoresDeFormulariosComponent', () => {
  let component: ValidadoresDeFormulariosComponent;
  let fixture: ComponentFixture<ValidadoresDeFormulariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidadoresDeFormulariosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidadoresDeFormulariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
