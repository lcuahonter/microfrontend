import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';
import { ModalComponent } from './modal.component';
import { ModalModule, ModalDirective } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  // Spy object for the ngx-bootstrap modal
  const mockModal = {
    show: jest.fn(),
    hide: jest.fn(),
  } as unknown as ModalDirective;

  // Spy container for ViewContainerRef
  const mockContainer = {
    clear: jest.fn(),
    createComponent: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ModalModule.forRoot(),
        ModalComponent, // standalone component
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;

    // Override the @ViewChild properties
    (component as any).modal = mockModal;
    (component as any).container = mockContainer;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loadComponent clears container and creates a component without inputs', () => {
    // Declare the dummy class here
    class TestComp {}

    const mockRef = { instance: {}, destroy: jest.fn() };
    mockContainer.createComponent.mockReturnValue(mockRef);

    component.loadComponent(TestComp);

    expect(mockContainer.clear).toHaveBeenCalled();
    expect(mockContainer.createComponent).toHaveBeenCalledWith(
      TestComp as Type<any>
    );
    // internal componentRef should be set
    expect((component as any).componentRef).toBe(mockRef);
  });

  it('loadComponent assigns inputs to the new instance', () => {
    // Dummy with a foo property
    class TestCompWithInput {
      public foo?: string;
    }

    const mockRef = { instance: new TestCompWithInput(), destroy: jest.fn() };
    mockContainer.createComponent.mockReturnValue(mockRef);

    component.loadComponent(TestCompWithInput, { foo: 'bar' });

    expect(mockContainer.clear).toHaveBeenCalled();
    expect(mockContainer.createComponent).toHaveBeenCalledWith(
      TestCompWithInput
    );
    expect(mockRef.instance.foo).toBe('bar');
  });

  it('abrir() clears, creates, assigns inputs, subscribes and shows modal', () => {
    // Dummy that exposes a cerrar EventEmitter-like API
    class TestCompWithCerrar {
      public foo?: string;
      public cerrar = { subscribe: (cb: () => void) => cb() };
    }

    const mockRef = { instance: new TestCompWithCerrar(), destroy: jest.fn() };
    mockContainer.createComponent.mockReturnValue(mockRef);

    component.abrir(TestCompWithCerrar, { foo: 'baz' });

    expect(mockContainer.clear).toHaveBeenCalled();
    expect(mockContainer.createComponent).toHaveBeenCalledWith(
      TestCompWithCerrar
    );
    expect((mockRef.instance as TestCompWithCerrar).foo).toBe('baz');
  });

  it('cerrar() hides modal, clears container, and destroys the componentRef', () => {
    const destroySpy = jest.fn();
    (component as any).componentRef = { destroy: destroySpy } as any;

    component.cerrar();

    expect(mockContainer.clear).toHaveBeenCalled();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('ngOnDestroy() calls destroy on componentRef if present', () => {
    const destroySpy = jest.fn();
    (component as any).componentRef = { destroy: destroySpy } as any;

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
  });
});
