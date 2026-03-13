
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDeLaSolicitudContenedoraComponent } from './datos-de-la-solicitud.contenedora';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs';

describe('DatosDeLaSolicitudContenedoraComponent', () => {
  let component: DatosDeLaSolicitudContenedoraComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudContenedoraComponent>;
  let mockConsultaQuery: any;
  let mockTramiteQuery: any;
  let mockTramiteStore: any;
  let mockCdr: any;

  const consultaStateMock = {
    readonly: true,
    other: 'value'
  };

  beforeEach(async () => {
    mockConsultaQuery = {
      selectConsultaioState$: of(consultaStateMock)
    };
    mockTramiteQuery = {};
    mockTramiteStore = {};
    mockCdr = { detectChanges: jest.fn() };

    await TestBed.configureTestingModule({
      providers: [
        { provide: ChangeDetectorRef, useValue: mockCdr }
      ],
      imports: [HttpClientTestingModule, DatosDeLaSolicitudContenedoraComponent]
    }).overrideComponent(DatosDeLaSolicitudContenedoraComponent, {
      set: {
        providers: [
          { provide: ChangeDetectorRef, useValue: mockCdr }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudContenedoraComponent);
    component = fixture.componentInstance;

    (component as any).consultaQuery = mockConsultaQuery;
    (component as any).tramite260302Query = mockTramiteQuery;
    (component as any).tramite260302Store = mockTramiteStore;
    (component as any).cdr = mockCdr;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle ngOnDestroy called multiple times gracefully', () => {
    component.ngOnDestroy();
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
