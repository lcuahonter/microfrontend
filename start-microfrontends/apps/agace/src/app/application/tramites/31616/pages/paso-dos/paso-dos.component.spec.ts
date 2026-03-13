import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService } from '@ng-mf/data-access-user';
import { of, throwError } from 'rxjs';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: any;
  let catalogosServiceMock: any;

  beforeEach(async () => {
    catalogosServiceMock = {
      getCatalogo: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      imports: [HttpClientTestingModule],
      providers: [{ provide: CatalogosService, useValue: catalogosServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTiposDocumentos on ngOnInit', () => {
    const spy = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should populate catalogoDocumentos when getCatalogo returns data', () => {
    const mockData = [{ id: 1, name: 'Document 1' }];
    catalogosServiceMock.getCatalogo.mockReturnValue(of(mockData));

    component.getTiposDocumentos();

    expect(component.catalogoDocumentos).toEqual(mockData);
  });

  it('should handle error when getCatalogo fails', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    catalogosServiceMock.getCatalogo.mockReturnValue(throwError(() => new Error('Error fetching data')));

    component.getTiposDocumentos();

    expect(component.catalogoDocumentos).toEqual([]);
    consoleSpy.mockRestore();
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
