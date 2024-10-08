import "./List.less";

import { Dispatch, SetStateAction, useContext, useMemo, useState } from "react";

import { AppState, StateKind } from "src/AppState";
import { SolvedState } from "src/Level";
import { levelNumbers } from "src/algorithms/numbers";
import { packLevel, unpackLevel, unpackLevelCells } from "src/algorithms/pack";
import { LevelStoreContext } from "src/components/level-store/LevelStore";
import { Time } from "src/components/time/Time";
import {
    ButtonGrid,
    ButtonGridButton,
} from "src/components/ui/button-grid/ButtonGrid";
import { IconButton } from "src/components/ui/button/Button";
import { shareURL } from "src/utils/shareURL";

interface ItemProps {
    setState: Dispatch<SetStateAction<AppState>>;
    id: string;
    level: string;
    isActive: boolean;
    setIsActive: (selected: boolean) => void;
}

function Item({
    setState,
    id,
    level: packedLevel,
    isActive,
    setIsActive,
}: ItemProps) {
    const [levelInfo, cells] = useMemo(
        () => unpackLevel(packedLevel, id, true),
        [id, packedLevel],
    );
    const [hasCopied, setHasCopied] = useState(false);
    if (hasCopied && !isActive) {
        setHasCopied(false);
    }

    const { setLevel: setSavedLevel } = useContext(LevelStoreContext)!;

    const name = (
        <div className="saved-level-list__item__name">{levelInfo.name}</div>
    );

    if (isActive) {
        const play = () => {
            const level = {
                ...levelInfo,
                cells: unpackLevelCells(cells, levelInfo),
            };
            setState({
                kind: StateKind.Play,
                level: {
                    ...level,
                    ...levelNumbers(level),
                },
            });
        };

        const edit = () => {
            const level = {
                ...levelInfo,
                cells: unpackLevelCells(cells, levelInfo),
            };
            setState({
                kind: StateKind.Edit,
                level,
            });
        };

        const delete_ = () => {
            if (!confirm("Do you really want to delete this level?")) return;
            setSavedLevel(id, null);
        };

        return (
            <div className="saved-level-list__item saved-level-list__item--actions">
                {name}
                <ButtonGrid
                    rows={2}
                    cols={3}
                    className="saved-level-list__item--actions__buttons"
                >
                    <ButtonGridButton>
                        <IconButton
                            icon="fas fa-play"
                            title="Play"
                            onClick={play}
                        />
                    </ButtonGridButton>
                    <ButtonGridButton>
                        <IconButton
                            icon="fas fa-pencil"
                            title="Edit"
                            onClick={edit}
                        />
                    </ButtonGridButton>
                    <ButtonGridButton>
                        <IconButton
                            isDestructive={true}
                            icon="fas fa-trash"
                            title="Delete"
                            onClick={delete_}
                        />
                    </ButtonGridButton>
                    <ButtonGridButton>
                        <IconButton
                            icon={hasCopied ? "fas fa-check" : "fas fa-share"}
                            title={hasCopied ? "Copied!" : "Share"}
                            onClick={() => {
                                const url =
                                    location.protocol +
                                    "//" +
                                    location.host +
                                    location.pathname +
                                    "?id=" +
                                    id +
                                    "&data=" +
                                    encodeURIComponent(
                                        packLevel(levelInfo, cells, false),
                                    );
                                (async () => {
                                    const { success, usedClipboard } =
                                        await shareURL(url);
                                    if (success && usedClipboard) {
                                        setHasCopied(true);
                                        setTimeout(
                                            () => setHasCopied(false),
                                            1000,
                                        );
                                    }
                                })();
                            }}
                        />
                    </ButtonGridButton>
                    <ButtonGridButton row={[1, 3]} col={3}>
                        <IconButton
                            icon="fas fa-xmark"
                            title="Cancel"
                            onClick={() => setIsActive(false)}
                        />
                    </ButtonGridButton>
                </ButtonGrid>
            </div>
        );
    } else {
        const [solvedClassSuffix, solvedText] = {
            [SolvedState.Unsolved]: ["unsolved", "Unsolved"],
            [SolvedState.Solved]: ["solved", "Solved"],
            [SolvedState.Own]: ["own", "Your own"],
        }[levelInfo.solved];

        return (
            <button
                className="saved-level-list__item saved-level-list__item--preview"
                onClick={() => setIsActive(true)}
            >
                {name}
                <div className="saved-level-list__item--preview__info">
                    <div
                        className={
                            "saved-level-list__item--preview__info__solved" +
                            " saved-level-list__item--preview__info__solved--" +
                            solvedClassSuffix
                        }
                    >
                        {solvedText}
                    </div>
                    <Time
                        className="saved-level-list__item--preview__info__record"
                        seconds={levelInfo.record}
                    />
                    <div className="saved-level-list__item--preview__info__size">
                        {levelInfo.width} &times; {levelInfo.height}
                    </div>
                </div>
            </button>
        );
    }
}

export interface ListProps {
    setState: Dispatch<SetStateAction<AppState>>;
    create?: () => void;
    className?: string | undefined;
}

export function List({ setState, create, className = "" }: ListProps) {
    const { levels } = useContext(LevelStoreContext)!;

    const [active, setActive] = useState(-1);

    return (
        <div className={className + " saved-level-list"}>
            {Object.keys(levels).map((uuid, i) => (
                <Item
                    key={i}
                    setState={setState}
                    id={uuid}
                    level={levels[uuid]}
                    isActive={active === i}
                    setIsActive={(isActive) => setActive(isActive ? i : -1)}
                />
            ))}
            {create ? (
                <button className="saved-level-list__create" onClick={create}>
                    <i className="fas fa-plus" />
                </button>
            ) : undefined}
        </div>
    );
}
