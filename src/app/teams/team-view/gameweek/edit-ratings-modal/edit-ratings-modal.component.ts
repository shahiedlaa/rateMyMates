import { Component, Input, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GameWeekService } from '../gameweek-service';
import { PostService } from 'src/app/teams/post-service';

@Component({
  selector: 'edit-ratings-modal',
  templateUrl: './edit-ratings-modal.component.html',
  styleUrls: ['./edit-ratings-modal.component.css']
})
export class EditRatingsModalComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private gameweekService: GameWeekService, private postService: PostService, private route: ActivatedRoute) {
    this.gameWeekForm = this.formBuilder.group({
      players: this.formBuilder.array([], { validators: [Validators.required] })
    })
  }

  @Input('gameWeekData') gameWeekdata;

  public gameWeekForm: FormGroup;
  public playersArray = [];
  private teamId;
  private week;

  ngOnInit(): void {
    this.populateData();
    this.teamId = window.location.pathname.split('/')[2];
    this.week = window.location.pathname.split('/')[4];
    this.gameweekService.playersUpdate.subscribe(response => {
      if (response) {
        this.playersArray = response.filter(team => team.teamId === this.teamId);
      }
    });
    this.postService.getCreatorId().subscribe(response => {
      if (response) {
        localStorage.setItem('creatorId', response);
      }
    });
  }

  get players(): FormArray {
    return this.gameWeekForm.get('players') as FormArray;
  }

  newPlayer(data?: any): FormGroup {
    data = data || { name: null, rating: null }
    return this.formBuilder.group({
      player: data ? data.name : '',
      rating: data ? data.rating : null,
    });
  }

  addPlayer() {
    this.players.push(this.newPlayer());
  }

  removePlayer(i: number) {
    this.players.removeAt(i);
  }

  populateData() {
    this.gameweekService.sendGameweek.subscribe(data => {
      let playerData = data?.players;
      this.week = data?.week;
      const players = this.gameWeekForm.get('players') as FormArray;
      players.clear();
      let creatorId = localStorage.getItem('creatorId');
      playerData?.forEach(element => {
        const data = {
          name: element.player,
          rating: element.rating.filter(e => e.ratedBy === creatorId)[0]['rating']
        }
        players.push(this.newPlayer(data));
      });
    });
  }

  onSubmit(formData: FormGroup) {
    const data = this.gameWeekForm.value;
    const playersArray = [];

    Object.keys(data).forEach(key => {
      data[key].forEach(element =>
        playersArray.push(element)
      );
    });

    const creatorId = localStorage.getItem('creatorId');

    for (let i = 0; i < playersArray.length; i++) {
      let ratingFormat = {
        ratedBy: creatorId,
        rating: playersArray[i].rating
      };
      playersArray[i].rating = ratingFormat;
    }

    this.gameweekService.editGameweek(playersArray, this.week, this.teamId);


  }

}
