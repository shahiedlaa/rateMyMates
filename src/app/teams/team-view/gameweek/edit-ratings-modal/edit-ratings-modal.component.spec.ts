import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRatingsModalComponent } from './edit-ratings-modal.component';

describe('EditRatingsModalComponent', () => {
  let component: EditRatingsModalComponent;
  let fixture: ComponentFixture<EditRatingsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditRatingsModalComponent]
    });
    fixture = TestBed.createComponent(EditRatingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
