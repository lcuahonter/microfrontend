import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mock the TEXTOS constant to avoid import issues
jest.mock('@libs/shared/data-access-user/src', () => ({
  TEXTOS: {
    mensaje: 'Test message',
    titulo: 'Test title',
    descripcion: 'Test description'
  }
}));

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize TEXTOS property', () => {
    expect(component.TEXTOS).toBeDefined();
    expect(typeof component.TEXTOS).toBe('object');
  });

  it('should have TEXTOS with expected structure', () => {
    expect(component.TEXTOS).toEqual({
      mensaje: 'Test message',
      titulo: 'Test title',
      descripcion: 'Test description'
    });
  });

  it('should maintain TEXTOS reference after component initialization', () => {
    const initialTextos = component.TEXTOS;
    fixture.detectChanges();
    expect(component.TEXTOS).toBe(initialTextos);
  });

  it('should render without errors', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
