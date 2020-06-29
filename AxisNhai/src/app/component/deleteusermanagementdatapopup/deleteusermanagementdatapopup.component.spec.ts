import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteusermanagementdatapopupComponent } from './deleteusermanagementdatapopup.component';

describe('DeleteusermanagementdatapopupComponent', () => {
  let component: DeleteusermanagementdatapopupComponent;
  let fixture: ComponentFixture<DeleteusermanagementdatapopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteusermanagementdatapopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteusermanagementdatapopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
