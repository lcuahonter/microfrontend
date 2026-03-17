// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockCatalogosService: jest.Mocked<CatalogosService>;

  const mockCatalogo = [
    { id: '1', descripcion: 'Documento 1' },
    { id: '2', descripcion: 'Documento 2' },
  ];

  beforeEach(async () => {
    mockCatalogosService = {
      getCatalogo: jest.fn().mockReturnValue(of(mockCatalogo)),
    } as unknown as jest.Mocked<CatalogosService>;

    await TestBed.configureTestingModule({
      imports: [CommonModule, PasoDosComponent, HttpClientTestingModule], // PasoDosComponent is standalone
      providers: [
        { provide: CatalogosService, useValue: mockCatalogosService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCatalogo and set catalogoDocumentos', () => {
    expect(mockCatalogosService.getCatalogo).toHaveBeenCalled();
    expect(component.catalogoDocumentos).toEqual(mockCatalogo);
  });

  it('should unsubscribe on destroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
