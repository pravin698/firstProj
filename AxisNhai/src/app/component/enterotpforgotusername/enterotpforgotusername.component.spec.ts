import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterotpforgotusernameComponent } from './enterotpforgotusername.component';

describe('EnterotpforgotusernameComponent', () => {
  let component: EnterotpforgotusernameComponent;
  let fixture: ComponentFixture<EnterotpforgotusernameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterotpforgotusernameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterotpforgotusernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
