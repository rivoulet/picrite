import "./Time.less";

export interface TimeProps {
    seconds: number | null;
    className?: string | undefined;
}

export function Time({ seconds, className }: TimeProps) {
    const mins = seconds === null ? "-" : Math.floor(seconds / 60);
    const secs =
        seconds === null
            ? "--"
            : Math.floor(seconds % 60)
                  .toString()
                  .padStart(2, "0");
    const millis =
        seconds === null
            ? "---"
            : Math.floor((seconds % 1) * 1000)
                  .toString()
                  .padStart(3, "0");

    return (
        <div className={className + " time"}>
            {mins}
            <span className="time__separator">:</span>
            {secs}
            <span className="time__separator">.</span>
            {millis}
        </div>
    );
}
