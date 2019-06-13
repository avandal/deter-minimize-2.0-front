import { Component, OnInit } from '@angular/core';
import { AutomatonService } from '../providers/automaton/automaton.service';

@Component({
  selector: 'app-automaton',
  templateUrl: './automaton.component.html',
  styleUrls: ['./automaton.component.scss']
})
export class AutomatonComponent implements OnInit {
  private test: string;

  constructor(private service: AutomatonService) {}

  ngOnInit() {
    this.service.getTest().subscribe(s => {
      this.test = s;
    })
  }

}
