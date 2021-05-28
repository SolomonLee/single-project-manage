import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const lockBodyScroll = () => {
    document.body.classList.add("modal-open");
};

const unlockBodyScroll = () => {
    if (document.getElementById("ModalBox")?.children.length === 0)
        document.body.classList.remove("modal-open");
};

interface Props {
    children: JSX.Element | JSX.Element[] | string | number | null;
    isOpen: boolean;
    setClose: undefined | React.MouseEventHandler<HTMLButtonElement>;
    stylenum: number | undefined;
}

const Modal = ({
    children,
    isOpen,
    stylenum,
    setClose = undefined,
}: Props): JSX.Element | null => {
    const refModal = useRef(document.getElementById("ModalBox"));

    useEffect(() => {
        if (refModal.current === null)
            refModal.current = document.getElementById("ModalBox");

        if (isOpen) {
            lockBodyScroll();
        } else {
            unlockBodyScroll();
        }

        return () => unlockBodyScroll();
    }, [isOpen]);

    if (isOpen && refModal.current != null)
        return ReactDOM.createPortal(
            <>
                <div className="modal-mask" />
                <div className="modal" data-style={stylenum}>
                    {typeof setClose !== "undefined" ? (
                        <button
                            type="button"
                            className="close"
                            onClick={setClose}
                        >
                            <span className="material-icons icons-close" />
                        </button>
                    ) : null}

                    {children}
                </div>
            </>,
            refModal.current
        );

    return null;
};

export default Modal;
