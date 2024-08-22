import { CSSProperties, ReactNode } from "react";
import "./RadioButtons.less";

export interface RadioButtonDetailed {
    content: ReactNode;
    className?: string;
    isDisabled?: boolean;
}

export type RadioButton = string | RadioButtonDetailed;

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
        >
            <div className="radio-buttons__highlight" />
            {...buttons.map((button, i) => {
                const {
                    content,
                    className = "",
                    isDisabled = false,
                } = typeof button === "string" ? { content: button } : button;
                const className_ =
                    className +
                    " radio-buttons__button" +
                    (isDisabled ? " radio-buttons__button--disabled" : "");
                const onSelect = setSelected
                    ? () => {
                          setSelected(i);
                      }
                    : undefined;
                const content_ = (
                    <div className="radio-buttons__button__content">
                        {content}
                    </div>
                );
                // Labels' focusin events have relatedTarget === null
                return hasKeyboardControls ? (
                    <label className={className_}>
                        <input
                            className="radio-buttons__button__input"
                            type="radio"
                            name={name}
                            checked={selected === i}
                            disabled={isDisabled}
                            readOnly={!setSelected}
                            onChange={onSelect}
                        />
                        {content_}
                    </label>
                ) : (
                    <button
                        className={className_}
                        tabIndex={-1}
                        disabled={isDisabled}
                        onClick={onSelect}
                        onFocus={(e) => {
                            if (!(e.relatedTarget instanceof HTMLElement))
                                return;
                            e.relatedTarget.focus();
                        }}
                    >
                        {content_}
                    </button>
                );
            })}
        </div>
    );
}
