import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})

export class PaginationComponent implements OnInit {

  @Input() currentPage;
  @Input() limit;
  @Input() total;
  @Output() changePage = new EventEmitter<number>();

  pages: number[] = [];

  ngOnInit(): void {

  }
}
