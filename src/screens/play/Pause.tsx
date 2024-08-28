import "./Pause.less";

import { useRef } from "react";

import { LevelInfo } from "src/Level";
import { Time } from "src/components/time/Time";
import { IconButton } from "src/components/ui/button/Button";

export interface PauseScreenProps {
    elapsed: number;
    level: LevelInfo;
    hasClear: boolean;
    clear: () => void;
    quit: () => void;
    resume: () => void;
    className?: string | undefined;
}

export function PauseScreen({
    elapsed,
    level,
    hasClear,
    clear,
    quit,
    resume,
    className,
}: PauseScreenProps) {
    // Prevent from updating during fade-out transition
    const elapsedRef = useRef(elapsed);

    return (
        <div className={className + " pause-screen"}>
            <div className="pause-screen__level-name">{level.name}</div>
            <Time seconds={elapsedRef.current} className="pause-screen__time" />
            <div className="pause-screen__controls">
                <IconButton
                    icon="fas fa-trash"
                    title="Clear"
                    alwaysShowTitle={true}
                    onClick={() => {
                        if (
                            !confirm(
                                "Do you want to clear the board? Your progress will be lost.",
                            )
                        )
                            return;
                        clear();
                        resume();
                    }}
                    disabled={!hasClear}
                />
                <IconButton
                    icon="fas fa-xmark"
                    title="Quit"
                    alwaysShowTitle={true}
                    isDestructive={true}
                    onClick={() => {
                        if (
                            !confirm(
                                "Do you want to quit? Your progress will be lost.",
                            )
                        )
                            return;
                        quit();
                    }}
                />
                <IconButton
                    icon="fas fa-play"
                    title="Resume"
                    alwaysShowTitle={true}
                    className="pause-screen__controls__resume"
                    onClick={resume}
                />
                <div className="pause-screen__info">
                    Picrite v{__APP_VERSION__}
                </div>
            </div>
        </div>
    );
}
