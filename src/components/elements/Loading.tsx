import React from "react";

interface Props {
    loading: boolean;
    content: string | null;
    /** web|Other */
    type: string;
}

export const LoadingItem = ({
    loading,
    content,
    type,
}: Props): JSX.Element | null => {
    if (loading === false) return null;

    return (
        <div className="loading_item" data-type={type}>
            <div className="item_content">
                <div className="loading_animation">
                    <span className="l1" />
                    <span className="l2" />
                    <span className="l3" />
                    <span className="l4" />
                    <span className="l5" />
                </div>
                <p>{content || "loading..."}</p>
            </div>
        </div>
    );
};

export const setLoadingPromise = (
    arr: [],
    err: () => void,
    setLoading: (state: boolean) => void,
    _finally: (() => void) | null
): Promise<void | never[]> =>
    Promise.all(arr)
        .catch(() => {
            err();
        })
        .finally(() => {
            setLoading(false);
            if (_finally !== null) _finally();
        });

export default LoadingItem;
