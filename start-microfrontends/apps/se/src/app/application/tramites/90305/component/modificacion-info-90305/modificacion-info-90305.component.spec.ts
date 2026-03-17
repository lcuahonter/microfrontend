import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificacionInfo90305Component } from './modificacion-info-90305.component';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { of } from 'rxjs';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';

describe('ModificacionInfo90305Component', () => {
  let component: ModificacionInfo90305Component;
  let fixture: ComponentFixture<ModificacionInfo90305Component>;
  let mockService: Partial<ProsecModificacionServiceTsService>;

  beforeEach(async () => {
    mockService = {
      getModoficacionInfo: () => of({
        registroFederalContribuyentes: 'RFC123',
        representacionFederal: 'Federal',
        tipoModificacion: 'Mod1',
        modificacionPrograma: 'Program1',
      }),
    };
    
    await TestBed.configureTestingModule({
      imports: [ModificacionInfo90305Component, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ProsecModificacionServiceTsService, useValue: mockService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificacionInfo90305Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    expect(component.modificationInfoForm).toBeDefined();
    expect(component.modificationInfoForm.controls['registroFederalContribuyentes']).toBeDefined();
  });

  it('should call loadInfo on ngOnInit', () => {
    jest.spyOn(component, 'loadInfo');
    component.ngOnInit();
    expect(component.loadInfo).toHaveBeenCalled();
  });

  it('should load modification info and update form', () => {
    jest.spyOn(mockService, 'getModoficacionInfo').mockImplementation(() => of({
      registroFederalContribuyentes: 'RFC123',
      representacionFederal: 'Federal',
      tipoModificacion: 'Mod1',
      modificacionPrograma: 'Program1',
    }));
    component.loadInfo();
    expect(mockService.getModoficacionInfo).toHaveBeenCalled();
    expect(component.modificationInfoForm.value).toEqual({
      registroFederalContribuyentes: 'RFC123',
      representacionFederal: 'Federal',
      tipoModificacion: 'Mod1',
      modificacionPrograma: 'Program1',
    });
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    // Mock the destroyed$ property as a Subject with spies on next and complete
    const nextSpy = jest.fn();
    const completeSpy = jest.fn();
    (component as any).destroyed$ = { next: nextSpy, complete: completeSpy };

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
  
});
