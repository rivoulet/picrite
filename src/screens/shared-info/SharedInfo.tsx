import "./SharedInfo.less";

import {
    Dispatch,
    SetStateAction,
    forwardRef,
    useContext,
    useState,
} from "react";

import { AppState, StateKind } from "src/AppState";
import { LevelCells, SavedLevelInfo } from "src/Level";
import { levelNumbers } from "src/algorithms/numbers";
import { packLevel } from "src/algorithms/pack";
import { LevelStoreContext } from "src/components/level-store/LevelStore";
import { ButtonGroup } from "src/components/ui/button-group/ButtonGroup";
import { IconButton } from "src/components/ui/button/Button";

export interface SharedInfoScreenProps {
    level: SavedLevelInfo & LevelCells;
    setState: Dispatch<SetStateAction<AppState>>;
    className?: string | undefined;
}

export const SharedInfoScreen = forwardRef<
    HTMLDivElement,
    SharedInfoScreenProps
>(({ level, setState, className }, ref) => {
    const { levels: savedLevels, setLevel: setSavedLevel } =
        useContext(LevelStoreContext)!;

    // Prevents rerendering with an "Already Saved" button after saving
    const [isSaved] = useState(() => level.id in savedLevels);

    const play = () => {
        setState({
            kind: StateKind.Play,
            level: {
                ...level,
                id: isSaved ? level.id : null,
                ...levelNumbers(level),
            },
        });
    };

    const canSave = !isSaved;
    const saveLabel = !canSave && "Already saved";
    const save = () => {
        setSavedLevel(level.id, packLevel(level, level.cells, true));
        setState({ kind: StateKind.LevelSelect });
    };

    const cancel = () => {
        setState({ kind: StateKind.LevelSelect });
    };

    return (
        <div className={className + " shared-info-screen"} ref={ref}>
            <div className="shared-info-screen__info">
                <div className="shared-info-screen__info__name">
                    {level.name}
                </div>
                <div className="shared-info-screen__info__size">
                    {level.width} &times; {level.height}
                </div>
            </div>
            <ButtonGroup className="shared-info-screen__actions">
                <IconButton
                    icon="fas fa-play"
                    title={isSaved ? "Play" : "Play without saving"}
                    alwaysShowTitle={true}
                    onClick={play}
                />
                <IconButton
                    icon="fas fa-save"
                    title="Save"
                    alwaysShowTitle={true}
                    appendLabelToTitle={true}
                    onClick={save}
                    disabled={!canSave}
                >
                    {saveLabel}
                </IconButton>
                <IconButton
                    icon="fas fa-xmark"
                    title="Cancel"
                    alwaysShowTitle={true}
                    onClick={cancel}
                />
            </ButtonGroup>
        </div>
    );
});
