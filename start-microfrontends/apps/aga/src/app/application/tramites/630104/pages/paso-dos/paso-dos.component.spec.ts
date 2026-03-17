import 'reflect-metadata';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CommonModule } from '@angular/common';
import { TEXTOS } from '@ng-mf/data-access-user';
import { AlertComponent, AnexarDocumentosComponent, TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService, TOAST_CONFIG } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';


describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

  // Mock ToastrService
  const mockToastrService = {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoDosComponent],
      providers: [
        { provide: ToastrService, useValue: mockToastrService },
        { provide: TOAST_CONFIG, useValue: {} }, 
        provideHttpClient()// Provide a mock configuration
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize TEXTOS correctly', () => {
    expect(component.TEXTOS).toBe(TEXTOS);
  });
});