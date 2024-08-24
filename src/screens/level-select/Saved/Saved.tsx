import "./Saved.less";

import { CardProps } from "../Card";
import { forwardRef, useState } from "react";

import { Create } from "./Create";
import { List } from "./List";

export const Saved = forwardRef<HTMLDivElement, CardProps>(
    ({ setState, className = "" }, ref) => {
        const [isCreating, setIsCreating] = useState(false);

        return (
            <div
                className={className + " level-select-screen__saved"}
                ref={ref}
            >
                {isCreating ? (
                    <Create
                        setState={setState}
                        back={() => setIsCreating(false)}
                        className="level-select-screen__saved__create"
                    />
                ) : (
                    <List
                        setState={setState}
                        create={() => setIsCreating(true)}
                        className="level-select-screen__saved__list"
                    />
                )}
            </div>
        );
    },
);
