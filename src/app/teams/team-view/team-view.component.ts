import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { initFlowbite } from 'flowbite';

import { Post } from '../post.model';

import { PostService } from '../post-service';
import { Gameweek } from './gameweek/gameweek.model';
import { GameWeekService } from './gameweek/gameweek-service';

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.css']
})
export class TeamViewComponent implements OnInit, AfterContentInit {
  constructor(private route: ActivatedRoute, private postService: PostService, private gameweekService: GameWeekService) { }

  public postId;
  public post: Post;

  public hideGameweek = false;
  public gameWeeks: Gameweek[] = [];
  public playersArray: any[] = [];

  ngOnInit(): void {
    initFlowbite();
    let teamId: string;
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
  };

  ngAfterContentInit(): void {
    this.getGameweekByTeam(this.postId);
    this.getPlayersArray(this.postId);
  }

  getPlayersArray(postId: any) {
    this.playersArray = [
      {
        team_id: '665b05f8941dee3b07d50970',
        players: ['Rashford', 'Tommy', 'Joshua', 'Farid']
      },
      {
        team_id: '66549a614774a068fda394f2',
        players: ['De Jong', 'Tommy', 'Joshua', 'Farid']
      },
    ].filter(team => team.team_id === postId)
  }

  getGameweekByTeam(postId: any) {
    this.gameWeeks = this.gameweekService.getGameWeek().filter(team => team.team_id === postId);
  }

  clickGameweek(gameweek: any) {
    this.hideGameweek = true;
    let specificWeek = { ...this.gameWeeks[0] };
    this.gameweekService.sendSpecificWeek.next(specificWeek.weeksArray[gameweek]);
  }

  deleteTeam(postId: string) {
    this.postService.deletePost(postId).subscribe(
      (response) => {
        console.log(response);
      }
    )
  }
}
