import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the modal when active is false', () => {
    component.active = false;
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(By.css('div[hidden]'));
    expect(modalElement).toBeTruthy();
  });

  it('should show the modal when active is true', () => {
    component.active = true;
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(By.css('div[hidden]'));
    expect(modalElement).toBeFalsy();
  });

  it('should render content inside the modal', () => {
    component.active = true;
    fixture.detectChanges();

    const popupBody = fixture.debugElement.query(By.css('.popup-body'));
    expect(popupBody).toBeTruthy();
  });
});