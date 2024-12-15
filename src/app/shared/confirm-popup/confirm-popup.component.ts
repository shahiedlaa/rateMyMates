import { Component, Input, OnChanges} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { PostService } from 'src/app/teams/post-service';
import { GameWeekService } from 'src/app/teams/team-view/gameweek/gameweek-service';

@Component({
  selector: 'confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.css']
})
export class ConfirmPopupComponent {

  constructor(private postService:PostService, private router: Router, private gameweekService: GameWeekService){}

  @Input() action;
  @Input() postId;
  @Input() duplicates;

  public actionText = '';
  public gameWeekData;
  public week;
  public teamId;

  private sub: Subscription;

  ngOnInit(){
    this.sub = this.gameweekService.deleteGameweekListener.subscribe((element) => {
      if(element){
        this.action = this.actionText = 'delete gameweek';
      }
    });
    this.sub = this.gameweekService.sendTeamId.subscribe(response => {
      this.teamId = response;
    });
    this.sub = this.gameweekService.sendSpecificWeek.subscribe(response => {
      this.gameWeekData = response;
      this.week = response?.week;
    });
    this.sub = this.gameweekService.updatedGameweeks.subscribe((response: any[]) => {
      if (response !== null) {
        let newGameweekData = response;
        let gameweeks;
        gameweeks = newGameweekData?.filter(team => team.team_id === this.teamId)[0];
        let updatedGameweek = gameweeks.weeksArray[gameweeks.weeksArray.findIndex(el => el.week === this.week)];
        this.gameWeekData = updatedGameweek;
      }
    });
  }

  ngOnChanges(){
    this.actionText = this.action;
  }

  confirmAction() {
    switch(this.action){
      case 'delete':
        this.postService.deletePost(this.postId).subscribe(
          (response) => {
            console.log(response);
            this.router.navigate(['../']);
          }
        );
        break;
      case 'delete gameweek':
        let unmodifiedGameweek;
        let onlyOneGameweek;

        this.gameweekService.getGameweek();

        this.gameweekService.sendGameweek.subscribe(response => {
          unmodifiedGameweek = response?.filter(e => e.teamId === this.teamId);
          onlyOneGameweek = unmodifiedGameweek[0].weeksArray.length === 1;
        });

        if (onlyOneGameweek) {
          this.gameweekService.deleteOnlyGameweek(this.teamId);
        }
        else {
          let modifiedGameweek = unmodifiedGameweek[0].weeksArray.filter(e => e.week !== this.gameWeekData.week);
          unmodifiedGameweek[0].weeksArray = modifiedGameweek;
          this.gameweekService.deleteGameweek(unmodifiedGameweek[0]);
          }
        break;
    }
  }

  deleteTeam(postId: string) {

  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }
}
