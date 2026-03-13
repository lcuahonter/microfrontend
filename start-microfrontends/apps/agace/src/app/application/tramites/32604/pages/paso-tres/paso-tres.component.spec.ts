import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoTresComponent } from './paso-tres.component';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports: [require('@angular/common').CommonModule, require('@angular/forms').ReactiveFormsModule],
      schemas: [require('@angular/core').CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('obtieneFirma', () => {
    it('should navigate to acuse if obtieneFirma called with valid string', () => {
      const routerMock = { navigate: jest.fn() };
      const comp = new PasoTresComponent(routerMock as any);
      comp.obtieneFirma('valid-firma');
      expect(routerMock.navigate).toHaveBeenCalledWith(['temporal-contenedores/acuse']);
    });
    it('should not navigate if obtieneFirma called with empty string', () => {
      const routerMock = { navigate: jest.fn() };
      const comp = new PasoTresComponent(routerMock as any);
      comp.obtieneFirma('');
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });
});
