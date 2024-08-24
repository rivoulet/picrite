import { Button } from "../../components/ui/button/Button";
import "./Win.less";
import { Time } from "../../components/time/Time";

export interface WinScreenProps {
    elapsed: number;
    quit: (winTime: number) => void;
    className?: string | undefined;
}

export function WinScreen({ elapsed, quit, className }: WinScreenProps) {
    return (
        <div className={className + " win-screen"}>
            <div className="win-screen__message">You won!</div>
            <Time seconds={elapsed} className="win-screen__time" />
            <Button title="Quit" onClick={() => quit(elapsed)}>
                Quit
            </Button>
        </div>
    );
}
