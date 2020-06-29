import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpforgotyourusernameComponent } from './otpforgotyourusername.component';

describe('OtpforgotyourusernameComponent', () => {
  let component: OtpforgotyourusernameComponent;
  let fixture: ComponentFixture<OtpforgotyourusernameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpforgotyourusernameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpforgotyourusernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
