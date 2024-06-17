import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameWeekModalComponent } from './game-week-modal.component';

describe('GameWeekModalComponent', () => {
  let component: GameWeekModalComponent;
  let fixture: ComponentFixture<GameWeekModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameWeekModalComponent]
    });
    fixture = TestBed.createComponent(GameWeekModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
