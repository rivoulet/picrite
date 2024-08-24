import "./Pause.less";

import { LevelInfo } from "src/Level";
import { Button } from "src/components/ui/button/Button";

export interface PauseScreenProps {
    level: LevelInfo;
    hasClear: boolean;
    clear: () => void;
    quit: () => void;
    resume: () => void;
    className?: string | undefined;
}

export function PauseScreen({
    level,
    hasClear,
    clear,
    quit,
    resume,
    className,
}: PauseScreenProps) {
    return (
        <div className={className + " pause-screen"}>
            <div className="pause-screen__level-name">{level.name}</div>
            <div className="pause-screen__controls">
                <Button
                    icon="fas fa-trash"
                    title={null}
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
                >
                    Clear
                </Button>
                <Button
                    icon="fas fa-xmark"
                    title={null}
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
                >
                    Quit
                </Button>
                <Button
                    icon="fas fa-play"
                    title={null}
                    className="pause-screen__controls__resume"
                    onClick={resume}
                >
                    Resume
                </Button>
                <div className="pause-screen__info">
                    Picrite v{__APP_VERSION__}
                </div>
            </div>
        </div>
    );
}
