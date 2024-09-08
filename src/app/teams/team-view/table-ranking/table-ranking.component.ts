import { Component, Input, SimpleChanges } from '@angular/core';
import { GameWeekService } from '../gameweek/gameweek-service';
import { generate, Subscription } from 'rxjs';

@Component({
  selector: 'table-ranking',
  templateUrl: './table-ranking.component.html',
  styleUrls: ['./table-ranking.component.css']
})
export class TableRankingComponent {

  constructor(private gameweekService: GameWeekService) { }

  @Input() teamId;
  @Input() tableData;

  public tableRawData = [];

  ngOnChanges(changes: SimpleChanges) {
    this.tableData = changes['tableData'].currentValue[0]
    if (this.tableData) {
      this.generateTableData(this.tableData);
    };
  }

  generateTableData(data: any) {
    let players = [];
    let uniquePlayers = [];
    let gameData = data.weeksArray;

    gameData.forEach(temp => {
      temp.players.forEach(temp => {
        players.push(temp.player);
        uniquePlayers = this.removeusingSet(players);
      })
    })

    uniquePlayers.forEach(temp => {
      this.tableRawData.push({
        player: temp,
        rating: 5
      })
    });
    console.log(this.tableRawData);
  }

  removeusingSet(arr) {
    let outputArray = Array.from(new Set(arr))
    return outputArray
  }

}
