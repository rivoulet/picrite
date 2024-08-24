import { CSSProperties, ReactNode } from "react";
import "./RadioButtons.less";

export interface RadioButtonDetailed {
    content: ReactNode;
    className?: string;
    isDisabled?: boolean;
}

export type RadioButton = string | RadioButtonDetailed;

export interface BaseRadioButtonsProps {
    selected: number;
    setSelected: (i: number) => void;
    className?: string;
    buttons: RadioButton[];
}

export interface KeyboardRadioButtonsProps extends BaseRadioButtonsProps {
    hasKeyboardControls?: true;
    name: string;
}

export interface NoKeyboardRadioButtonsProps extends BaseRadioButtonsProps {
    hasKeyboardControls: false;
    name?: never;
}

export type RadioButtonsProps =
    | KeyboardRadioButtonsProps
    | NoKeyboardRadioButtonsProps;

export function RadioButtons({
    selected,
    setSelected,
    hasKeyboardControls = true,
    name,
    className = "",
    buttons,
}: RadioButtonsProps) {
    const inputName = hasKeyboardControls && name;
    const inputSelected = hasKeyboardControls && selected;

    const buttons_ = buttons.map((button, i) => {
        const {
            content,
            className = "",
            isDisabled = false,
        } = typeof button === "string" ? { content: button } : button;
        const className_ =
            className +
            " radio-buttons__button" +
            (isDisabled ? " radio-buttons__button--disabled" : "");
        const onSelect = () => setSelected(i);
        const content_ = (
            <div className="radio-buttons__button__content">{content}</div>
        );
        // Labels' focusin events have relatedTarget === null
        return hasKeyboardControls ? (
            <label className={className_}>
                <input
                    className="radio-buttons__button__input"
                    type="radio"
                    name={inputName as string | undefined}
                    checked={inputSelected === i}
                    disabled={isDisabled}
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
                    if (!(e.relatedTarget instanceof HTMLElement)) return;
                    e.relatedTarget.focus();
                }}
            >
                {content_}
            </button>
        );
    });

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
            {...buttons_}
        </div>
    );
}
