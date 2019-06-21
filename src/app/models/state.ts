import { Link } from "./link";

export class State {
    x: number;
    y: number;

    rx: number;
    ry: number;

    name: string;
    linksOut: Link[];
    linksIn: Link[];

    initialState: boolean;
    finalState: boolean;
}
