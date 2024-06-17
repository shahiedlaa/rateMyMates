import { Component, Input, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { GameWeekService } from '../gameweek-service';
import { response } from 'express';

@Component({
  selector: 'edit-ratings-modal',
  templateUrl: './edit-ratings-modal.component.html',
  styleUrls: ['./edit-ratings-modal.component.css']
})
export class EditRatingsModalComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private gameweekService: GameWeekService) {
    this.gameWeekForm = this.formBuilder.group({
      players: this.formBuilder.array([], { validators: [Validators.required] })
    })
  }

  @Input('gameWeekData') gameWeekdata;

  gameWeekForm: FormGroup;
  initialGameweek: any = [];

  ngOnInit(): void {
    this.populateData();
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
      const players = this.gameWeekForm.get('players') as FormArray;
      players.clear();
      playerData?.forEach(b => {
        players.push(this.newPlayer(b))
      });
    });
  }

}
