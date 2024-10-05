import { Component, Input, SimpleChanges } from '@angular/core';
import { GameWeekService } from '../gameweek/gameweek-service';
import { generate, Subscription } from 'rxjs';
import * as e from 'express';

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
    let playerData = [];
    let playerWeeklyData = [];

    gameData.forEach(temp => {
      temp.players.forEach(temp => {
        players.push(temp.player);
        uniquePlayers = this.removeusingSet(players);
      })
    })

    uniquePlayers.forEach(element => {
      let data = {
        name: element,
        weeklyData: []
      }
      playerWeeklyData.push(data);
    })

    uniquePlayers.forEach(value => {
      let data = {
        player: value,
        overallRating: []
      }
      gameData.forEach(temp => {
        let week = temp.week;
        let weekData = {
          week: week,
          rating: 0
        }
        let averageRating = [];
        let averageWeekRating = [];
        let weekRating: number;
        let playerIsInWeek = false;

        temp.players.filter(x => x.player === value)[0] ? playerIsInWeek = true : playerIsInWeek = false;

        if (playerIsInWeek) {
          const length = temp.players.filter(x => x.player === value)[0].rating?.length;
          temp.players.filter(x => x.player === value)[0].rating.forEach(x => {
            averageRating.push(x.rating);
            let data1 = playerWeeklyData.find((element) => element.name === value);
            let weekData = {
              week: temp.week,
              rating: x.rating
            }

            data1.weeklyData.push(weekData)

            if (averageRating.length === length) {
              weekRating = this.average(averageRating);
              data.overallRating.push(weekRating);
            };
          });
        }

      })
      playerData.push(data);
    })
    playerData.map((x) => {
      x.overallRating = this.average(x.overallRating);
    });

    this.optimizeDataForChart(playerWeeklyData);
    this.tableRawData = playerData;
  }

  removeusingSet(arr) {
    let outputArray = Array.from(new Set(arr))
    return outputArray
  }

  average(array) {
    return array.reduce((a, b) => a + b) / array.length;
  }

  optimizeDataForChart(data: any) {

    data.forEach(element => {
      let data1 = element.weeklyData
      const weeklyData = data1.reduce((a, b) => {
        const found = a.find(e => e.week == b.week);
        return found ? found.rating.push(b.rating) : a.push({ ...b, rating: [b.rating] }), a;
      }, [])
      weeklyData.map((element) => {
        element.rating = this.average(element.rating);
      })
      // console.log(weeklyData);

      element.weeklyData = weeklyData;
    })

    console.log(data);

    // let data1 = data[0].weeklyData
    // const res = data1.reduce((a, b) => {
    //   const found = a.find(e => e.week == b.week);
    //   return found ? found.rating.push(b.rating) : a.push({ ...b, rating: [b.rating] }), a;
    // }, [])
    // res.map((element) => {
    //   element.rating = this.average(element.rating);
    // })
    // console.log(res);

  }
}
