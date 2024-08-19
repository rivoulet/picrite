import { CSSProperties, ReactNode } from "react";
import "./RadioButtons.less";

export interface RadioButton {
    content: ReactNode;
    className?: string;
    isDisabled?: boolean;
}

export interface RadioButtonsProps {
    selected: number;
    setSelected?: (i: number) => void;
    name: string;
    className?: string;
    hasKeyboardControls?: boolean;
    buttons: RadioButton[];
}

export function RadioButtons({
    selected,
    setSelected,
    name,
    className = "",
    hasKeyboardControls = true,
    buttons,
}: RadioButtonsProps) {
    return (
        <div
            className={className + " radio-buttons"}
            style={
                {
                    "--radio-buttons-count": buttons.length,
                    "--radio-buttons-selected": selected,
                } as CSSProperties
            }
            onFocus={
                hasKeyboardControls
                    ? undefined
                    : (e) => {
                          if (!(e.relatedTarget instanceof HTMLElement)) return;
                          e.relatedTarget.focus();
                      }
            }
        >
            <div className="radio-buttons__highlight" />
            {...buttons.map(({ content, className = "", isDisabled }, i) => (
                <label
                    className={
                        "radio-buttons__button" +
                        (isDisabled ? " radio-buttons__button--disabled" : "")
                    }
                >
                    <input
                        className="radio-buttons__button__input"
                        type="radio"
                        name={name}
                        checked={selected === i}
                        disabled={isDisabled}
                        readOnly={!setSelected}
                        tabIndex={hasKeyboardControls ? undefined : -1}
                        onChange={
                            setSelected
                                ? () => {
                                      setSelected(i);
                                  }
                                : undefined
                        }
                    />
                    <div
                        className={
                            className + " radio-buttons__button__content"
                        }
                    >
                        {content}
                    </div>
                </label>
            ))}
        </div>
    );
}
