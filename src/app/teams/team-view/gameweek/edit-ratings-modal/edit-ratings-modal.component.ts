import { Component, Input, OnInit } from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GameWeekService } from '../gameweek-service';
import { PostService } from 'src/app/teams/post-service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'edit-ratings-modal',
  templateUrl: './edit-ratings-modal.component.html',
  styleUrls: ['./edit-ratings-modal.component.css'],
})
export class EditRatingsModalComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private gameweekService: GameWeekService,
    private postService: PostService,
    private route: ActivatedRoute
  ) {
    this.gameWeekForm = this.formBuilder.group({
      date: new FormControl(
        formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        Validators.required
      ),
      opponent: new FormControl(null, Validators.required),
      teamScore: new FormControl(null, [
        Validators.required,
        Validators.min(1),
      ]),
      opponentScore: new FormControl(null, [
        Validators.required,
        Validators.min(1),
      ]),
      players: this.formBuilder.array([], {
        validators: [Validators.required],
      }),
    });
  }

  @Input('gameWeekData') gameWeekdata;

  public gameWeekForm: FormGroup;
  public playersArray = [];
  public playersArrayClone = [];
  private teamId;
  private week;
  public accessType = '';

  ngOnInit(): void {
    this.populateData();
    this.gameWeekForm.get('players').disable();
    this.accessType = localStorage.getItem('accessType');
    this.teamId = window.location.pathname.split('/')[2];
    this.week = window.location.pathname.split('/')[4];
    this.gameweekService.playersUpdate.subscribe((response) => {
      if (response) {
        this.playersArray = response.filter(
          (team) => team.teamId === this.teamId
        );
      }
    });
    this.gameweekService.sendGameweek.subscribe((response) => {
      this.playersArrayClone = response.players;
    });
    this.postService.getCreatorId().subscribe((response) => {
      if (response) {
        localStorage.setItem('creatorId', response);
      }
    });
  }

  get players(): FormArray {
    return this.gameWeekForm.get('players') as FormArray;
  }

  newPlayer(data?: any): FormGroup {
    data = data || { name: null, rating: null };
    return new FormGroup({
      player: new FormControl({
        value: data.name,
        disabled: this.accessType !== 'admin',
      }),
      rating: new FormControl(data.rating, [
        Validators.min(1),
        Validators.max(10),
      ]),
    });
  }

  addPlayer() {
    this.players.push(this.newPlayer());
  }

  removePlayer(i: number) {
    this.players.removeAt(i);
  }

  populateData() {
    let date: any;
    this.gameweekService.sendGameweek.subscribe((data) => {
      if (data) {
        date = new Date(data.date);
      }
      let playerData = data?.players;
      this.week = data?.week;
      const players = this.gameWeekForm.get('players') as FormArray;
      players.clear();
      let userId = localStorage.getItem('userId');
      playerData?.forEach((element) => {
        const data = {
          name: element.player,
          rating:
            element.rating.filter((e) => e.ratedBy === userId)[0] !== undefined
              ? element.rating.filter((e) => e.ratedBy === userId)[0]['rating']
              : null,
        };
        players.push(this.newPlayer(data));
      });
      this.gameWeekForm
        .get('date')
        .patchValue(formatDate(date, 'yyyy-MM-dd', 'en'));
      this.gameWeekForm.get('opponent').patchValue(data.opponent);
      this.gameWeekForm.get('teamScore').patchValue(data.teamScore);
      this.gameWeekForm.get('opponentScore').patchValue(data.opponentScore);

      if (this.accessType !== 'admin') {
        this.gameWeekForm.get('date').disable();
        this.gameWeekForm.get('opponent').disable();
        this.gameWeekForm.get('teamScore').disable();
        this.gameWeekForm.get('opponentScore').disable();
      }
    });
  }

  onSubmit(formData: FormGroup) {
    // const data = this.gameWeekForm.getRawValue();
    const data = {
      players: this.gameWeekForm.get('players').getRawValue(),
    };
    const playersArray = [];
    let gameweekStats = {
      date: this.gameWeekForm.get('date').value,
      opponent: this.gameWeekForm.get('opponent').value,
      teamScore: this.gameWeekForm.get('teamScore').value,
      opponentScore: this.gameWeekForm.get('opponentScore').value,
    };

    Object.keys(data).forEach((key) => {
      data[key].forEach((element) => playersArray.push(element));
    });

    const creatorId = localStorage.getItem(
      this.accessType === 'admin' ? 'creatorId' : 'userId'
    );

    const startFromScratch = this.playersArrayClone.length === 0;

    if (startFromScratch) {
      for (let i = 0; i < playersArray.length; i++) {
        let ratingFormat = {
          ratedBy: creatorId,
          rating: playersArray[i].rating,
        };
        playersArray[i].rating = ratingFormat;
      }
    } else {
      playersArray.forEach((key) => {
        let data = this.playersArrayClone.find(
          (temp) => temp.player === key.player
        )?.rating;
        const exist = data?.find((temp) => temp.ratedBy === creatorId);
        if (exist === undefined && data !== undefined) {
          data.push({
            ratedBy: creatorId,
            rating: key.rating,
          });
        } else if (data === undefined) {
          let ratingFormat = {
            ratedBy: creatorId,
            rating: key.rating,
          };
          let data = {
            player: key.player,
            rating: [ratingFormat],
          };
          this.playersArrayClone.push(data);
        } else {
          exist.rating = key.rating;
        }
      });
    }

    const players = [];
    const newData = [];

    playersArray.forEach((key) => {
      players.push(key.player);
    });

    players.forEach((temp) => {
      newData.push(this.playersArrayClone.filter((x) => x.player === temp)[0]);
    });

    this.gameweekService.editGameweek(
      newData,
      gameweekStats,
      this.week,
      this.teamId
    );
  }
}
