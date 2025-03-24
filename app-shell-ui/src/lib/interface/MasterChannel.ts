import { Effect } from "./";

export interface MasterChannel {
    volume: number;
    muted: boolean;
    effects: Effect[];
}