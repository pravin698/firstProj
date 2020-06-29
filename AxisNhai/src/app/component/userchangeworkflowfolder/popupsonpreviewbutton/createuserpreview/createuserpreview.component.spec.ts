import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateuserpreviewComponent } from './createuserpreview.component';

describe('CreateuserpreviewComponent', () => {
  let component: CreateuserpreviewComponent;
  let fixture: ComponentFixture<CreateuserpreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateuserpreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateuserpreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
