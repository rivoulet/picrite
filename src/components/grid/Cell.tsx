import "./Cell.less";

import { memo, useRef } from "react";
import { CellMark } from "../../CellMark";
import CrossSign from "../../assets/cross.svg?react";

export function Cell({ mark }: { mark: CellMark }) {
    const hasMarkRef = useRef(true);
    const hasVisibleMark = mark !== CellMark.Empty;
    if (hasVisibleMark) {
        hasMarkRef.current = mark === CellMark.Mark;
    }
    const hasVisibleMarkClassName = hasVisibleMark
        ? " grid__cell__contents--visible"
        : "";
    return (
        <td className="grid__cell">
            {hasMarkRef.current ? (
                <div
                    className={
                        " grid__cell__contents grid__cell__contents--mark" +
                        hasVisibleMarkClassName
                    }
                />
            ) : (
                <CrossSign
                    className={
                        " grid__cell__contents grid__cell__contents--cross" +
                        hasVisibleMarkClassName
                    }
                />
            )}
        </td>
    );
}

export const MemoCell = memo(Cell);
