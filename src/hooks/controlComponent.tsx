import { useEffect, useRef } from "react";

export const useGetMount = (): React.MutableRefObject<boolean> => {
    const refIsMount = useRef(false);

    useEffect(() => {
        refIsMount.current = true;

        return () => {
            refIsMount.current = false;
        };
    }, []);

    return refIsMount;
};
