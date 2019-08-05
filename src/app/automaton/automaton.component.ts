import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AutomatonService } from '../providers/automaton/automaton.service';
import { State } from '../models/state';
import { Link } from '../models/link';

@Component({
  selector: 'app-automaton',
  templateUrl: './automaton.component.html',
  styleUrls: ['./automaton.component.scss']
})
export class AutomatonComponent implements OnInit, OnChanges {
  private states: State[];

  private arrow_position = 3/5;
  private arrow_angle = 5/6;
  private arrow_size = 15;

  @Input() automaton: string;

  constructor(private service: AutomatonService) {}

  ngOnInit() {
    this.initialize();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['automaton']) {
      this.initialize();
    }
  }

  private initialize() {
    this.service.open(this.automaton).subscribe((states: State[]) => {
      for (let state of states) {
        state.rx = 20 + (state.name.length * 2.5);
        state.ry = 20 + (state.name.length);
      }

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

  private draw_links(context: CanvasRenderingContext2D) {
    for (let state of this.states) {
      for (let link of state.linksOut) {
        this.draw_link(context, link);
      }
    }
  }

  private draw_link(context: CanvasRenderingContext2D, link: Link) {
    // if (!link.source.equals(link.target)) {
    if (link.source.name !== link.target.name) {
      this.draw_source_to_target(link, context);
    } else {
      this.draw_source_to_source(link, context);
    }
  }

  private draw_source_to_source(link: Link, context: CanvasRenderingContext2D) {
    let radius = 20;
    let circle_center = link.source.y - radius;
    let circle_top = circle_center - radius;

    let start_arrow_x = link.source.x + this.arrow_size * Math.cos(Math.PI * this.arrow_angle);
    let start_arrow_y = circle_top + this.arrow_size * Math.sin(Math.PI * this.arrow_angle);
    let end_arrow_x = link.source.x + this.arrow_size * Math.cos(-Math.PI * this.arrow_angle);
    let end_arrow_y = circle_top + this.arrow_size * Math.sin(-Math.PI * this.arrow_angle);

    this.draw_self_curve(context, link, circle_center, radius);
    this.draw_arrow(context, start_arrow_x, start_arrow_y, link.source.x, circle_top, end_arrow_x, end_arrow_y);
    this.draw_transition(context, link.source.x, circle_top, link);
  }

  private draw_self_curve(context: CanvasRenderingContext2D, link: Link, circle_center: number, radius: number) {
    context.strokeStyle = "#FF0000";
    context.beginPath();
    context.arc(link.source.x, circle_center, radius, 0, Math.PI * 2);
    context.stroke();
  }

  private draw_source_to_target(link: Link, context: CanvasRenderingContext2D) {
    // Distance between source and target
    let d = Math.sqrt((link.target.x - link.source.x) ** 2 + (link.target.y - link.source.y) ** 2);

    // Radius of the angle source -> target according to origin vector
    let r = Math.atan2(link.target.y - link.source.y, link.target.x - link.source.x);

    // Mid position of the arrow
    let quarter_x = link.source.x + d * Math.cos(r) * this.arrow_position;
    let quarter_y = link.source.y + d * Math.sin(r) * this.arrow_position;

    // Position of the quadratic point
    let quadradic_x = quarter_x + link.curve * Math.cos(r + Math.PI / 2);
    let quadratic_y = quarter_y + link.curve * Math.sin(r + Math.PI / 2);

    // Final position of the arrow
    let quadratic_mid_x = quarter_x + link.curve / 2 * Math.cos(r + Math.PI / 2);
    let quadratic_mid_y = quarter_y + link.curve / 2 * Math.sin(r + Math.PI / 2);

    // First point of the arrow
    let start_arrow_x = quadratic_mid_x + this.arrow_size * Math.cos(r +  Math.PI * this.arrow_angle);
    let start_arrow_y = quadratic_mid_y + this.arrow_size * Math.sin(r + Math.PI * this.arrow_angle);

    // Opposite of the first point of the arrow
    let end_arrow_x = quadratic_mid_x + this.arrow_size * Math.cos(r - Math.PI * this.arrow_angle);
    let end_arrow_y = quadratic_mid_y + this.arrow_size * Math.sin(r - Math.PI * this.arrow_angle);

    this.draw_curve(context, link, quadradic_x, quadratic_y);
    this.draw_arrow(context, start_arrow_x, start_arrow_y, quadratic_mid_x, quadratic_mid_y, end_arrow_x, end_arrow_y);
    this.draw_transition(context, quadratic_mid_x, quadratic_mid_y, link);
  }

  private draw_curve(context: CanvasRenderingContext2D, link: Link, quadradic_x: number, quadratic_y: number) {
    context.strokeStyle = "#FF0000";
    context.beginPath();
    context.moveTo(link.source.x, link.source.y);
    context.quadraticCurveTo(quadradic_x, quadratic_y, link.target.x, link.target.y);
    context.stroke();
  }

  private draw_arrow(context: CanvasRenderingContext2D, start_arrow_x: number, start_arrow_y: number, quadratic_mid_x: number, quadratic_mid_y: number, end_arrow_x: number, end_arrow_y: number) {
    context.strokeStyle = "#FF0000";
    context.beginPath();
    context.moveTo(start_arrow_x, start_arrow_y);
    context.lineTo(quadratic_mid_x, quadratic_mid_y);
    context.lineTo(end_arrow_x, end_arrow_y);
    context.stroke();
  }

  private draw_transition(context: CanvasRenderingContext2D, x: number, y: number, link: Link) {
    context.fillStyle = "#000000";
    context.font = "15px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(link.transition.toString(), x, y - 20);
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
    context.strokeStyle = "#000000";
    context.stroke();
  }

  private draw_final_state(context: CanvasRenderingContext2D, state: State) {
    context.strokeStyle = "#000000";
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
