import { Component, OnInit } from '@angular/core';
import { AutomatonService } from '../providers/automaton/automaton.service';
import { State } from '../models/state';

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
      this.states = states;

      this.initialize_canvas();
    });
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

  private draw_states(context: CanvasRenderingContext2D) {
    for (let state of this.states) {
      let rx = 20 + (state.name.length * 2.5);
      let ry = 20 + (state.name.length);

      context.fillStyle = "#DDDDDD";
      context.beginPath();
      context.ellipse(state.x, state.y, rx, ry, 0, 0, 2 * Math.PI);
      context.fill();

      context.fillStyle = "#000000";
      context.stroke();

      if (state.finalState) {
        context.beginPath();
        context.ellipse(state.x, state.y, rx-3, ry-2, 0, 0, 2 * Math.PI)
        context.stroke();
      }

      context.fillStyle = "#000000";
      context.font = "15px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle"
      context.fillText(state.name, state.x, state.y)
    }
  }

  private draw_links(context: CanvasRenderingContext2D) {
    context.fillStyle = "#000000";

    for (let state of this.states) {
      for (let link of state.linksOut) {
        context.moveTo(link.source.x, link.source.y);
        context.lineTo(link.target.x, link.target.y);
        context.stroke();
      }
    }
  }
}
