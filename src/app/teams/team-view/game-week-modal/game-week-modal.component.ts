import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GameWeekService } from '../gameweek/gameweek-service';
import { PostService } from '../../post-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'game-week-modal',
  templateUrl: './game-week-modal.component.html',
  styleUrls: ['./game-week-modal.component.css'],
})
export class GameWeekModalComponent implements OnInit {
  @Input('teamId') teamId;
  @Output() popUpEmitter = new EventEmitter<any>();

  public addPlayerMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private gameweekService: GameWeekService,
    private postService: PostService
  ) {
    this.gameWeekForm = this.formBuilder.group({
      date: new FormControl(null, Validators.required),
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

  public subscription: Subscription;
  public gameWeekForm: FormGroup;
  private initialGameweek: any = [];
  public playersArray: any[] = [];

  ngOnInit(): void {
    this.gameweekService.getPlayers();
    this.postService.formEmiiter.subscribe((response) => {
      if (response !== null && response === 'addPlayers') {
        this.addPlayerMode = true;
        this.gameWeekForm.get('date').clearValidators();
        this.gameWeekForm.get('opponent').clearValidators();
        this.gameWeekForm.get('teamScore').clearValidators();
        this.gameWeekForm.get('opponentScore').clearValidators();

        this.gameWeekForm.get('date').updateValueAndValidity();
        this.gameWeekForm.get('opponent').updateValueAndValidity();
        this.gameWeekForm.get('teamScore').updateValueAndValidity();
        this.gameWeekForm.get('opponentScore').updateValueAndValidity();
        this.populateData();
      } else {
        this.addPlayerMode = false;
        const players = this.gameWeekForm.get('players') as FormArray;
        players.clear();
      }
    });
    this.gameweekService.getPlayers();
    this.gameweekService.playersUpdate.subscribe((response) => {
      if (response) {
        this.playersArray = response.filter(
          (team) => team.teamId === this.teamId
        );
      }
    });
    this.getGameweek();
    this.postService.getCreatorId().subscribe((response) => {
      if (response) {
        localStorage.setItem('creatorId', response);
      }
    });
  }

  getGameweek() {
    // this.gameweekService.getGameweek();
    this.subscription = this.gameweekService.sendGameweek.subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.initialGameweek = response.filter(
            (team) => team.teamId === this.teamId
          );
        }
      }
    );
  }

  get players(): FormArray {
    return this.gameWeekForm.get('players') as FormArray;
  }

  newPlayer(data?: any): FormGroup {
    data = data || { name: null, rating: null };
    return this.formBuilder.group({
      // player: data.name ? data.name : 'New Player',
      // rating: data.rating ? data.rating : null,
      player: new FormControl(data.name ? data.name : 'New Player', [
        Validators.required,
      ]),
      rating: new FormControl(data.rating ? data.rating : null, [
        Validators.min(1),
        Validators.max(10),
      ]),
    });
  }

  addPlayer() {
    console.log('here');
    this.players.push(this.newPlayer());
  }

  removePlayer(i: number) {
    this.players.removeAt(i);
  }

  populateData() {
    this.gameweekService.playersUpdate.subscribe((data) => {
      if (data) {
        let teamPlayers = data?.filter((team) => team.teamId === this.teamId);
        let playerData = teamPlayers[0]?.players;
        const players = this.gameWeekForm.get('players') as FormArray;
        players.clear();
        playerData?.forEach((b) => {
          const data = {
            name: b,
            rating: null,
          };
          players.push(this.newPlayer(data));
        });
      }
    });
  }

  onSubmit() {
    let data = {
      players: this.gameWeekForm.get('players').value,
    };

    let playersArray = [];
    let duplicates = [];
    const date = this.gameWeekForm.get('date').value;
    const opponent = this.gameWeekForm.get('opponent').value;
    const teamScore = this.gameWeekForm.get('teamScore').value;
    const opponentScore = this.gameWeekForm.get('opponentScore').value;

    if (this.addPlayerMode) {
      Object.keys(data).forEach((key) => {
        data[key].forEach((element) => playersArray.push(element['player']));
      });

      let playersArrayLoweredCase = playersArray.map((item: string) =>
        item.toLowerCase()
      );
      duplicates = playersArrayLoweredCase.filter(
        (item, index) => playersArrayLoweredCase.indexOf(item) !== index
      );

      if (duplicates.length > 0) {
        this.popUpEmitter.emit(duplicates);
        return;
      }

      this.gameweekService.playersUpdate.subscribe((response) => {
        let teamExist = response?.filter((team) => team.teamId === this.teamId);
        console.log(teamExist);
        if (teamExist.length !== 0) {
          console.log('here');
          let objectId = teamExist[0]._id;
          this.gameweekService.updatePlayers(
            this.teamId,
            objectId,
            playersArray
          );
        } else {
          this.gameweekService.addPlayersArray(this.teamId, playersArray);
        }
      });
    } else {
      Object.keys(data).forEach((key) => {
        data[key].forEach((element) => playersArray.push(element));
      });

      const creatorId = localStorage.getItem('creatorId');

      for (let i = 0; i < playersArray.length; i++) {
        let ratingFormat = {
          ratedBy: creatorId,
          rating: playersArray[i].rating,
        };
        playersArray[i].rating = ratingFormat;
      }

      const createFromScratch = this.initialGameweek.length == 0;

      if (createFromScratch) {
        let newGameWeek = {
          team_id: this.teamId,
          weeksArray: [
            {
              week: 1,
              players: playersArray,
              date: date,
              opponent: opponent,
              teamScore: teamScore,
              opponentScore: opponentScore,
            },
          ],
        };
        console.log(newGameWeek);

        this.gameweekService.addGameWeek(newGameWeek);
      } else {
        const copiedArray = Array.from(this.initialGameweek);

        let latestWeekNumber = copiedArray[0]['weeksArray']?.slice(-1)[0].week;

        let gameWeek = {
          week: latestWeekNumber + 1,
          players: playersArray,
          date: date,
          opponent: opponent,
          teamScore: teamScore,
          opponentScore: opponentScore,
        };

        this.initialGameweek[0].weeksArray.push(gameWeek);
        this.gameweekService.addSubsequentGameweek(this.initialGameweek[0]);
      }
    }

    this.gameweekService.getPlayers();
    this.gameweekService.playersUpdate.subscribe((response) => {
      if (response) {
        this.playersArray = response.filter(
          (team) => team.teamId === this.teamId
        );
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
