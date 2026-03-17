import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoDosComponent } from './paso-dos.component';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let catalogosServiceMock: any;

  beforeEach(async () => {
    catalogosServiceMock = {
      getCatalogo: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;

    component.cargaArchivosEvento = new EventEmitter<void>();

    fixture.detectChanges();
  });

  it('should create', () => {
    component.cargaArchivosEvento.emit();
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

});