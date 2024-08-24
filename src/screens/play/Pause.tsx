import "./Pause.less";

import { useCallback } from "react";
import { Button } from "../../components/ui/button/Button";

export interface PauseScreenProps {
    clear: () => void;
    quit: () => void;
    resume: () => void;
    className?: string | undefined;
}

export function PauseScreen({
    clear,
    quit,
    resume,
    className,
}: PauseScreenProps) {
    return (
        <div className={className + " pause-screen"}>
            <div className="pause-screen__controls">
                <Button
                    onClick={useCallback(() => {
                        if (
                            !confirm(
                                "Do you want to clear the board? Your progress will be lost."
                            )
                        )
                            return;
                        clear();
                        resume();
                    }, [clear, resume])}
                >
                    <i className="pause-screen__controls__icon fas fa-trash" />
                    Clear
                </Button>
                <Button
                    isDestructive={true}
                    onClick={useCallback(() => {
                        if (
                            !confirm(
                                "Do you want to quit? Your progress will be lost."
                            )
                        )
                            return;
                        quit();
                    }, [quit])}
                >
                    <i className="pause-screen__controls__icon fas fa-xmark" />
                    Quit
                </Button>
                <Button
                    className="pause-screen__controls__resume"
                    onClick={useCallback(() => {
                        resume();
                    }, [resume])}
                >
                    <i className="pause-screen__controls__icon fas fa-play" />
                    Resume
                </Button>
                <div className="pause-screen__info">
                    Picrite v{__APP_VERSION__}
                </div>
            </div>
        </div>
    );
}
