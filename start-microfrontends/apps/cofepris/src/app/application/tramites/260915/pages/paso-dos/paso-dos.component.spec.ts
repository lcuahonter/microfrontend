import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService } from '@ng-mf/data-access-user';
import { provideHttpClient } from '@angular/common/http';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { AnexarDocumentosComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { of, ReplaySubject, Subject } from 'rxjs';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let catalogosServiceMock: any;

  beforeEach(async () => {
    catalogosServiceMock = {
      getCatalogo: jest.fn().mockReturnValue(
        of({ data: [{ id: 1, name: 'Document 1' }] }) 
      )
    };

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      imports: [TituloComponent, AlertComponent, AnexarDocumentosComponent, ToastrModule.forRoot()],
      providers: [provideHttpClient(), 
      { provide: CatalogosService, useValue: catalogosServiceMock }, 
        ToastrService ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    component['destroyed$'] = new ReplaySubject<void>(1);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTiposDocumentos on component initialization', () => {
    const spy = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
  
});