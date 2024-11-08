import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { initFlowbite } from 'flowbite';

import { Post } from '../post.model';

import { PostService } from '../post-service';
import { Gameweek } from './gameweek/gameweek.model';
import { GameWeekService } from './gameweek/gameweek-service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.css']
})
export class TeamViewComponent {

  constructor(private route: ActivatedRoute, private postService: PostService, private gameweekService: GameWeekService) { }
  public postId;
  public post: Post;

  public hideGameweek = false;
  public gameWeeks: Gameweek[] = [];
  public playersArray: any[] = [];
  public subscription: Subscription;

  public accessType: string = '';
  public tableData: any;

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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
