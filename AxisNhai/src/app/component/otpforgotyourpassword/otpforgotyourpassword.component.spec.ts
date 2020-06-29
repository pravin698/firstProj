import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpforgotyourpasswordComponent } from './otpforgotyourpassword.component';

describe('OtpforgotyourpasswordComponent', () => {
  let component: OtpforgotyourpasswordComponent;
  let fixture: ComponentFixture<OtpforgotyourpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpforgotyourpasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpforgotyourpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
