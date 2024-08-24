import "./Cell.less";

import { memo, useRef } from "react";
import { CellMark, CellValue } from "../../CellValue";
import CrossSign from "../../assets/cross.svg?react";

export interface CellProps {
    value: CellValue;
}

export const Cell = memo(({ value }: CellProps) => {
    const hasMarkRef = useRef(true);
    const hasVisibleMark = !!value; // true or not CellMark.Empty
    if (hasVisibleMark) {
        hasMarkRef.current = value !== CellMark.Cross;
    }
    const hasVisibleMarkClassName = hasVisibleMark
        ? " grid__cell__contents--visible"
        : "";
    return (
        <td className="grid__cell">
            {hasMarkRef.current ? (
                <div
                    className={
                        "grid__cell__contents grid__cell__contents--mark" +
                        hasVisibleMarkClassName
                    }
                />
            ) : (
                <div
                    className={
                        "grid__cell__contents grid__cell__contents--cross" +
                        hasVisibleMarkClassName
                    }
                >
                    <CrossSign />
                </div>
            )}
        </td>
    );
});
