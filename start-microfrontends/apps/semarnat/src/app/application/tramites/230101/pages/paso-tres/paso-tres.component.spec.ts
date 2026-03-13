import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PasoTresComponent } from './paso-tres.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let mockRouter: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports: [RouterTestingModule], 
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);

    jest.spyOn(mockRouter, 'navigate'); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the correct route when obtieneFirma is called with a valid FIRMA', () => {
    const testFirma = 'VALID_FIRMA';
    component.obtieneFirma(testFirma);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should not navigate if FIRMA is not provided', () => {
    component.obtieneFirma('');

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
