import { Component, Input, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GameWeekService } from '../gameweek-service';

@Component({
  selector: 'edit-ratings-modal',
  templateUrl: './edit-ratings-modal.component.html',
  styleUrls: ['./edit-ratings-modal.component.css']
})
export class EditRatingsModalComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private gameweekService: GameWeekService, private route: ActivatedRoute) {
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
    this.playersArray = this.gameweekService.getPlayersArray().filter(team => team.team_id === this.teamId);
  }

  get players(): FormArray {
    return this.gameWeekForm.get('players') as FormArray;
  }

  newPlayer(data?: any): FormGroup {
    data = data || { name: null, rating: null }
    return this.formBuilder.group({
      name: data ? data.name : '',
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
      playerData?.forEach(b => {
        players.push(this.newPlayer(b))
      });
    });
  }

  onSubmit(formData: FormGroup) {
    let week = this.week;
    this.gameweekService.sendGameweek.next(formData.value);
    this.gameweekService.updateGameweek(this.teamId, +week);
  }

}
