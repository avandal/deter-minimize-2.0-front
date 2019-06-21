import { Component, OnInit } from '@angular/core';
import { AutomatonService } from '../providers/automaton/automaton.service';
import { State } from '../models/state';
import { Link } from '../models/link';

@Component({
  selector: 'app-automaton',
  templateUrl: './automaton.component.html',
  styleUrls: ['./automaton.component.scss']
})
export class AutomatonComponent implements OnInit {
  private states: State[];

  constructor(private service: AutomatonService) {}

  ngOnInit() {
    this.service.getStates().subscribe((states: State[]) => {
      console.log(states);
      this.initializeStates(states);
      this.initialize_canvas();
    });
  }

  private initializeStates(states: State[]) {
    for (let state of states) {
      state.rx = 20 + (state.name.length * 2.5);
      state.ry = 20 + (state.name.length);
    }

    this.states = states;
  }

  private initialize_canvas(): void {
    let canvas = <HTMLCanvasElement> document.getElementById("canvas");

    this.service.getMaxDimension().subscribe(d => {
      canvas.width = d.width;
      canvas.height = d.height;

      let context = canvas.getContext("2d");
  
      this.draw_links(context);
      this.draw_states(context);
    });
  }

  private draw_links(context: CanvasRenderingContext2D) {
    context.fillStyle = "#000000";

    for (let state of this.states) {
      for (let link of state.linksOut) {
        this.draw_link(context, link);
      }
    }
  }

  private draw_link(context: CanvasRenderingContext2D, link: Link) {
    let x1 = link.source.x;
    let y1 = link.source.y;
    let x2 = link.target.x;
    let y2 = link.target.y;

    let d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    let r = Math.atan2(y2 - y1, x2 - x1)

    let quarterx = x1 + d * 3 * Math.cos(r) / 4;
    let quartery = y1 + d * 3 * Math.sin(r) / 4;

    context.fillStyle = "#FF0000";
    context.fillRect(quarterx - 2, quartery - 2, 4, 4);

    context.fillStyle = "#000000";
    context.beginPath();
    context.moveTo(link.source.x, link.source.y);
    context.lineTo(link.target.x, link.target.y);
    context.stroke();
  }

  private draw_states(context: CanvasRenderingContext2D) {
    for (let state of this.states) {
      this.draw_state(context, state);

      if (state.finalState) {
        this.draw_final_state(context, state);
      }

      if (state.initialState) {
        this.draw_initial_state(context, state);
      }

      this.draw_state_name(context, state);
    }
  }

  private draw_state(context: CanvasRenderingContext2D, state: State) {
    context.fillStyle = "#DDDDDD";
    context.beginPath();
    context.ellipse(state.x, state.y, state.rx, state.ry, 0, 0, 2 * Math.PI);
    context.fill();
    context.fillStyle = "#000000";
    context.stroke();
  }

  private draw_final_state(context: CanvasRenderingContext2D, state: State) {
    context.beginPath();
    context.ellipse(state.x, state.y, state.rx - 3, state.ry - 2, 0, 0, 2 * Math.PI);
    context.stroke();
  }

  private draw_initial_state(context: CanvasRenderingContext2D, state: State) {
    context.fillStyle = "#FF0000";
    context.fillRect(state.x - state.rx - 20, state.y - 1, 20, 2);

    context.beginPath();
    context.moveTo(state.x - state.rx - 10, state.y - 5);
    context.lineTo(state.x - state.rx, state.y);
    context.lineTo(state.x - state.rx - 10, state.y + 5);
    context.fill();
  }

  private draw_state_name(context: CanvasRenderingContext2D, state: State) {
    context.fillStyle = "#000000";
    context.font = "15px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(state.name, state.x, state.y);
  }
}
