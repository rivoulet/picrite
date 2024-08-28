import "./Toggle.less";

import { InputHTMLAttributes } from "react";

export type ToggleProps = InputHTMLAttributes<HTMLInputElement>;

export function Toggle({ ...props }: ToggleProps) {
    return (
        <label className="toggle">
            <input type="checkbox" className="toggle__input" {...props} />
            <div className="toggle__visible">
                <div className="toggle__visible__track" />
                <div className="toggle__visible__thumb" />
            </div>
        </label>
    );
}
