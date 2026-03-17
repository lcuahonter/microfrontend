import { CommonModule } from '@angular/common';
import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  const MOCK_MODAL = {
    show: jest.fn(),
    hide: jest.fn(),
  } as unknown as ModalDirective;
  const MOCK_CONTAINER = {
    clear: jest.fn(),
    createComponent: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ModalModule.forRoot(),
        ModalComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    (component as any).modal = MOCK_MODAL;
    (component as any).container = MOCK_CONTAINER;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loadComponent clears container and creates a component without inputs', () => {
    class TestComp { }

    const MOCK_REF = { instance: {}, destroy: jest.fn() };
    MOCK_CONTAINER.createComponent.mockReturnValue(MOCK_REF);

    component.loadComponent(TestComp);

    expect(MOCK_CONTAINER.clear).toHaveBeenCalled();
    expect(MOCK_CONTAINER.createComponent).toHaveBeenCalledWith(
      TestComp as Type<any>
    );
    expect((component as any).componentRef).toBe(MOCK_REF);
  });

  it('loadComponent assigns inputs to the new instance', () => {
    class TestCompWithInput {
      public foo?: string;
    }

    const MOCK_REF = { instance: new TestCompWithInput(), destroy: jest.fn() };
    MOCK_CONTAINER.createComponent.mockReturnValue(MOCK_REF);

    component.loadComponent(TestCompWithInput, { foo: 'bar' });

    expect(MOCK_CONTAINER.clear).toHaveBeenCalled();
    expect(MOCK_CONTAINER.createComponent).toHaveBeenCalledWith(
      TestCompWithInput
    );
    expect(MOCK_REF.instance.foo).toBe('bar');
  });

  it('abrir() clears, creates, assigns inputs, subscribes and shows modal', () => {
    class TestCompWithCerrar {
      public foo?: string;
      public cerrar = { subscribe: (cb: () => void) => cb() };
    }

    const MOCK_REF = { instance: new TestCompWithCerrar(), destroy: jest.fn() };
    MOCK_CONTAINER.createComponent.mockReturnValue(MOCK_REF);

    component.abrir(TestCompWithCerrar, { foo: 'baz' });

    expect(MOCK_CONTAINER.clear).toHaveBeenCalled();
    expect(MOCK_CONTAINER.createComponent).toHaveBeenCalledWith(
      TestCompWithCerrar
    );
    expect((MOCK_REF.instance as TestCompWithCerrar).foo).toBe('baz');
  });

  it('cerrar() hides modal, clears container, and destroys the componentRef', () => {
    const DESTROY_SPY = jest.fn();
    (component as any).componentRef = { destroy: DESTROY_SPY } as any;

    component.cerrar();

    expect(MOCK_CONTAINER.clear).toHaveBeenCalled();
    expect(DESTROY_SPY).toHaveBeenCalled();
  });

  it('ngOnDestroy() calls destroy on componentRef if present', () => {
    const DESTROY_SPY = jest.fn();
    (component as any).componentRef = { destroy: DESTROY_SPY } as any;

    component.ngOnDestroy();

    expect(DESTROY_SPY).toHaveBeenCalled();
  });
});
