import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { GameWeekService } from '../gameweek/gameweek-service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'table-ranking',
  templateUrl: './table-ranking.component.html',
  styleUrls: ['./table-ranking.component.css']
})
export class TableRankingComponent {

  public chartOptions: Partial<ChartOptions>;
  @ViewChild("chart") chart: ChartComponent;

  constructor() { }

  @Input() teamId;
  @Input() tableData;

  private sortOrder = 1;
  private sortProperty: string = 'overallRating';

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

    this.optimizeDataForChart(playerWeeklyData, gameData);
    this.tableRawData = playerData;
  }

  removeusingSet(arr) {
    let outputArray = Array.from(new Set(arr))
    return outputArray
  }

  average(array) {
    return array.reduce((a, b) => a + b) / array.length;
  }


  sortBy(property: any) {
    this.sortOrder = property === this.sortProperty ? (this.sortOrder * -1) : 1;
    this.sortProperty = property;
    this.tableRawData = [...this.tableRawData.sort((a: any, b: any) => {
      // sort comparison function
      let result = 0;
      if (a[property] < b[property]) {
        result = -1;
      }
      if (a[property] > b[property]) {
        result = 1;
      }
      return result * this.sortOrder;
    })];
  }


  optimizeDataForChart(data: any, gameData: any) {
    data.forEach(element => {
      let data1 = element.weeklyData
      const weeklyData = data1.reduce((a, b) => {
        const found = a.find(e => e.week == b.week);
        return found ? found.rating.push(b.rating) : a.push({ ...b, rating: [b.rating] }), a;
      }, [])
      weeklyData.map((element) => {
        element.rating = this.average(element.rating);
      })
      element.weeklyData = weeklyData;
    })

    let xAxisLabels = [];
    let weeklyRating = [];

    gameData.forEach(element => {
      xAxisLabels.push(`Week ${element.week}`);
      weeklyRating.push(0);
    });

    data.forEach(element => {
      let weeklyRatingCopy = [...weeklyRating];
      for (let i = 0; i < element.weeklyData.length; i++) {
        let weekIndex = element.weeklyData[i].week - 1;
        let rating = element.weeklyData[i].rating;
        weeklyRatingCopy[weekIndex] = rating;
        element['data'] = weeklyRatingCopy;
      }
      delete element.weeklyData;
    })

    const seriesData = [...data];

    console.log(seriesData);


    this.chartOptions = {
      series: seriesData,
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ["#77B6EA", "#545454"],
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Gameweek Ratings",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: xAxisLabels,
        title: {
          text: "Gameweek"
        }
      },
      yaxis: {
        title: {
          text: "Rating"
        },
        min: 0,
        max: 10
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };

  }

}
