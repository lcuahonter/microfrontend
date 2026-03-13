import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mock Router
const mockRouter = {
  navigate: jest.fn()
};

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    mockRouter.navigate.mockClear();
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  describe('obtieneFirma', () => {
    it('debe navegar a servicios-extraordinarios/acuse cuando FIRMA sea válida', () => {
      const firma = 'valid-firma-string';
      
      component.obtieneFirma(firma);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
    });

    it('No debe navegar cuando FIRMA esté vacía', () => {
      const firma = '';
      
      component.obtieneFirma(firma);
      
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});