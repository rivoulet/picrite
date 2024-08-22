import "./Timer.less";

export interface TimerProps {
    elapsed: number;
    className?: string | undefined;
}

export function Timer({ elapsed, className }: TimerProps) {
    const mins = Math.floor(elapsed / 60);
    const secs = Math.floor(elapsed % 60);
    const millis = Math.floor((elapsed % 1) * 1000);

    return (
        <div className={className + " timer"}>
            {mins}
            <span className="timer__separator">:</span>
            {secs.toString().padStart(2, "0")}
            <span className="timer__separator">.</span>
            {millis.toString().padStart(3, "0")}
        </div>
    );
}
