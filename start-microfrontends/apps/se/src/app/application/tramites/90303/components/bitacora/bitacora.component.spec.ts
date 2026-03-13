import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BitacoraComponent } from './bitacora.component';
import { CatalogosService } from '../../service/catalogos.service';
import { of } from 'rxjs';
import { BitacoraTablaComponent } from '../../../../shared/components/bitacora/bitacora.component';

describe('BitacoraComponent', () => {
  let component: BitacoraComponent;
  let fixture: ComponentFixture<BitacoraComponent>;
  let mockCatalogosService: jest.Mocked<CatalogosService>;

  beforeEach(async () => {
    mockCatalogosService = {
      obtenerTablaBitacora: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<CatalogosService>;

    await TestBed.configureTestingModule({
      imports: [
        BitacoraComponent,
        BitacoraTablaComponent,
      ],
      providers: [{ provide: CatalogosService, useValue: mockCatalogosService }],
    }).compileComponents();

    fixture = TestBed.createComponent(BitacoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clean up subscriptions on destroy', () => {
    const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});