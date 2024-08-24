import "./Win.less";

import { LevelInfo } from "src/Level";
import { Time } from "src/components/time/Time";
import { Button } from "src/components/ui/button/Button";

export interface WinScreenProps {
    level: LevelInfo;
    elapsed: number;
    quit: (winTime: number) => void;
    className?: string | undefined;
}

export function WinScreen({ level, elapsed, quit, className }: WinScreenProps) {
    return (
        <div className={className + " win-screen"}>
            <div className="win-screen__level-name">{level.name}</div>
            <div className="win-screen__message">You won!</div>
            <Time seconds={elapsed} className="win-screen__time" />
            <Button
                title="Quit"
                className="win-screen__quit"
                onClick={() => quit(elapsed)}
            >
                Quit
            </Button>
        </div>
    );
}
