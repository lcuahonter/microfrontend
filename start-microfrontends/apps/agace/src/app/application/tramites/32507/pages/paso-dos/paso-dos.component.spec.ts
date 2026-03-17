import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let catalogosServiceMock: any;

  beforeEach(async () => {
    catalogosServiceMock = {
      getCatalogo: jest.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [PasoDosComponent],
      providers: [
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        provideHttpClient(),
        { provide: CatalogosService, useValue: catalogosServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize TEXTOS', () => {
    expect(component.TEXTOS).toBeDefined();
  });

  it('should call getTiposDocumentos on component initialization', () => {
    const spy = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should update catalogoDocumentos when getTiposDocumentos is called', () => {
    const mockCatalogo: Catalogo[] = [
      { id: 1, descripcion: 'Tipo Documento 1' },
      { id: 2, descripcion: 'Tipo Documento 2' }
    ];
    catalogosServiceMock.getCatalogo.mockReturnValue(of(mockCatalogo));
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual(mockCatalogo);
  });

  it('should handle empty response in getTiposDocumentos', () => {
    catalogosServiceMock.getCatalogo.mockReturnValue(of([]));
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual([]);
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});