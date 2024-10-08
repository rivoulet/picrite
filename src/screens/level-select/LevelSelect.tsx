import "./LevelSelect.less";

import {
    Dispatch,
    SetStateAction,
    forwardRef,
    useCallback,
    useState,
} from "react";

import { AppState, StateKind } from "src/AppState";
import { Slide } from "src/components/transitions/Slide";
import { SlideDir } from "src/components/transitions/SlideDir";
import { IconButton } from "src/components/ui/button/Button";
import { RadioButtons } from "src/components/ui/radio-buttons/RadioButtons";

import { Randomized } from "./Randomized";
import { Saved } from "./Saved/Saved";

export interface LevelSelectScreenProps {
    setState: Dispatch<SetStateAction<AppState>>;
    className?: string | undefined;
}

export const LevelSelectScreen = forwardRef<
    HTMLDivElement,
    LevelSelectScreenProps
>(({ setState, className }, ref) => {
    const [selection, setSelection] = useState({
        index: 0,
        wasIncreased: false,
        isShown: true,
    });

    const cards = [
        <Randomized
            setState={setState}
            className="level-select-screen__card"
        />,
        <Saved setState={setState} className="level-select-screen__card" />,
    ];

    const openSettings = () =>
        setState({
            kind: StateKind.Settings,
        });

    return (
        <div className={className + " level-select-screen"} ref={ref}>
            {...cards.map((card, i) => (
                <Slide
                    dir={
                        selection.wasIncreased ? SlideDir.Left : SlideDir.Right
                    }
                    mountOnEnter={true}
                    unmountOnExit={true}
                    in={selection.isShown && selection.index === i}
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    onExited={useCallback(
                        () =>
                            setSelection((selection) => {
                                return {
                                    ...selection,
                                    isShown: true,
                                };
                            }),
                        [],
                    )}
                >
                    {card}
                </Slide>
            ))}
            <div className="level-select-screen__bottom">
                <RadioButtons
                    selected={selection.index}
                    setSelected={(newSelected) =>
                        setSelection((prevSelection) => {
                            return newSelected === prevSelection.index
                                ? prevSelection
                                : {
                                      index: newSelected,
                                      wasIncreased:
                                          newSelected > prevSelection.index,
                                      isShown: false,
                                  };
                        })
                    }
                    name="level-type"
                    buttons={["Randomized", "Saved"]}
                    className="level-select-screen__bottom__type"
                />
                <IconButton
                    icon="fas fa-cog"
                    title="Settings"
                    className="level-select-screen__bottom__settings"
                    onClick={openSettings}
                />
            </div>
        </div>
    );
});
