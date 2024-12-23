import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

import { initFlowbite } from 'flowbite';

import { Post } from '../post.model';

import { PostService } from '../post-service';
import { Gameweek } from './gameweek/gameweek.model';
import { GameWeekService } from './gameweek/gameweek-service';
import { TeamViewService } from './team-view.service';


@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.css']
})
export class TeamViewComponent {

  @ViewChild('actionPopUp',{static:false}) actionModal: HTMLElement;

  constructor(private route: ActivatedRoute, private postService: PostService, private gameweekService: GameWeekService, private teamviewService: TeamViewService) { }
  public postId;
  public post: Post;

  public hideGameweek = false;
  public gameWeeks: Gameweek[] = [];
  public playersArray: any[] = [];
  public subscription: Subscription;

  public accessType: string = '';
  public tableData: any;

  public actionForPopUp = '';
  public duplicates:any = [];

  private dashboardEmitter = new Subject<boolean>();


  ngOnInit(): void {
    initFlowbite();
    this.accessType = localStorage.getItem('accessType');
    this.route.paramMap.subscribe((params) => {
      if (params.has('postId')) {
        this.postId = params.get('postId');
        this.postService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
        });
      }
    });
    this.getGameweekByTeam(this.postId);
    this.getPlayersArray(this.postId);
    this.subscription = this.gameweekService.playersUpdate.subscribe(response => {
      if (response) {
        this.playersArray = response.filter(team => team.teamId === this.postId);
      }
    })
  };

  getPlayersArray(postId: any) {
    this.gameweekService.getPlayers();
    this.gameweekService.playersUpdate.subscribe(response => {
      if (response) {
        this.playersArray = response.filter(team => team.teamId === postId);
      }
    })
  }

  getGameweekByTeam(postId: any) {
    this.gameweekService.getGameweek();
    this.subscription = this.gameweekService.sendGameweek.subscribe(response => {
      if (response && response.length > 0) {
        this.gameWeeks = response?.filter(team => team.teamId === postId);
      }
    })
  }

  clickGameweek(gameweek: any) {
    this.hideGameweek = true;
    let specificWeek = { ...this.gameWeeks[0] };
    this.gameweekService.sendSpecificWeek.next(specificWeek.weeksArray[gameweek]);
    this.gameweekService.sendTeamId.next(this.postId);
  }

  deleteTeam(postId: string) {
    this.postService.deletePost(postId).subscribe(
      (response) => {
        console.log(response);
      }
    )
  }

  emitForm(action: string) {
    this.postService.formEmiiter.next(action);
  }

  popUpAction(action:string){
    this.actionForPopUp = action;
  }

  openNotification(duplicates:Event){
    this.duplicates = duplicates;
    document.getElementById('pop-up').click();
    this.actionForPopUp = 'duplicate';
  }

  dashboardTab(){
    this.teamviewService.dashboardClick();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
