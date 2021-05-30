import React, {
    FocusEventHandler,
    ChangeEvent,
    useRef,
    useImperativeHandle,
    forwardRef,
} from "react";

import { FillHandle } from "./FillInterface";

interface Props {
    title: string | null;
    error: string | null;
    placeholder: string | null;
    value: string | number;
    name?: string;
    type: string;
    onchange: (e: ChangeEvent<HTMLInputElement>) => void;
    onblur?: FocusEventHandler<HTMLInputElement>;
    onkeypress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const FillItem: React.ForwardRefRenderFunction<FillHandle, Props> = (
    {
        title = null,
        error = null,
        placeholder = null,
        value,
        name,
        type,
        onchange,
        onblur,
        onkeypress,
    }: Props,
    forwardedRef
): JSX.Element => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(forwardedRef, () => ({
        disabled: () => {
            if (
                inputRef.current !== null &&
                inputRef.current.disabled !== null
            ) {
                inputRef.current.disabled = true;
            }
        },
        undisabled: () => {
            if (
                inputRef.current !== null &&
                inputRef.current.disabled !== null
            ) {
                inputRef.current.disabled = false;
            }
        },
    }));

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (typeof onkeypress !== "undefined") onkeypress(e);
    };

    return (
        <div className="fill_item" data-error={error ? "" : null}>
            {title ? <div className="item_title">{title}</div> : null}
            <div className="item_input">
                {placeholder && value === "" ? (
                    <div className="placeholder">{placeholder}</div>
                ) : null}
                <input
                    ref={inputRef}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onchange}
                    onBlur={onblur}
                    className="form-control"
                    onKeyPress={handleKeyPress}
                />
                {error && error !== "" ? (
                    <div className="error">{error}</div>
                ) : null}
            </div>
        </div>
    );
};

export default forwardRef(FillItem);
