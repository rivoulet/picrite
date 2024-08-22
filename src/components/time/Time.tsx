import "./Time.less";

export interface TimeProps {
    seconds: number;
    className?: string | undefined;
}

export function Time({ seconds, className }: TimeProps) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.floor((seconds % 1) * 1000);

    return (
        <div className={className + " time"}>
            {mins}
            <span className="time__separator">:</span>
            {secs.toString().padStart(2, "0")}
            <span className="time__separator">.</span>
            {millis.toString().padStart(3, "0")}
        </div>
    );
}
