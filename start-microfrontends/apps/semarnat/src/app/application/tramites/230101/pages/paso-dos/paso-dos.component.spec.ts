import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { ReplaySubject } from 'rxjs';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockCatalogosService: any;

  beforeEach(() => {
    mockCatalogosService = {
      getCatalogo: jest.fn(), 
    };

    TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      providers: [{ provide: CatalogosService, useValue: mockCatalogosService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should complete ReplaySubject on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(completeSpy).toHaveBeenCalled();
  });
});
