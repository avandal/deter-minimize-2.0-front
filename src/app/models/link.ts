import { State } from "./state";

export class Link {
    source: State;
    target: State;
    transition: string[];
    curve: number;
}