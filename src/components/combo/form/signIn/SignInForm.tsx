import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FillHandle } from "../../fillitem/FillInterface";
import FillItem from "../../fillitem/FillItem";
import Split from "../../../elements/Split";

const SignupSchema = Yup.object().shape({
    email: Yup.string().email("無效的EMAIL!!").required("必填欄位喔!"),
    password: Yup.string()
        .min(7, "太短 7-20個單位")
        .max(20, "太長 7-20個單位")
        .required("必填欄位喔!"),
});

const formActionList = {
    singIn: "SingIn",
    register: "Register",
};

interface Props {
    singInFunction: (email: string, password: string) => void;
    registerFunction: (email: string, password: string) => void;
    isWaitingResult: boolean;
}

const SignInForm = ({
    singInFunction,
    registerFunction,
    isWaitingResult,
}: Props): JSX.Element => {
    // const refOnSended = useRef(false);
    const [formAction, setFormAction] = useState(formActionList.singIn);
    const refEmail = useRef<FillHandle>(null);
    const refPassword = useRef<FillHandle>(null);

    useEffect(() => {
        setFormAction(formActionList.singIn);
    }, []);

    useEffect(() => {
        if (isWaitingResult) {
            refEmail.current?.disabled();
            refPassword.current?.disabled();
        } else {
            refEmail.current?.undisabled();
            refPassword.current?.undisabled();
        }
    }, [isWaitingResult]);

    const handleChangeFormAction = () => {
        if (formAction === formActionList.singIn) {
            setFormAction(formActionList.register);
        } else {
            setFormAction(formActionList.singIn);
        }
    };

    const handleSubmit = (email: string, password: string): void => {
        if (isWaitingResult) return;

        if (formAction === formActionList.singIn) {
            singInFunction(email, password);
            return;
        }

        registerFunction(email, password);
    };

    interface Form {
        email: string;
        password: string;
    }
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: SignupSchema,
        onSubmit: (values: Form, { resetForm }) => {
            handleSubmit(values.email, values.password);
            resetForm();
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="form_box">
            <div className="box_title">
                {formAction === formActionList.singIn ? "Sing In" : "Register"}
            </div>
            <div className="box_content">
                <div className="row">
                    <div className="col-12">
                        <FillItem
                            ref={refEmail}
                            name="email"
                            title="名稱"
                            type="text"
                            value={formik.values.email}
                            onchange={formik.handleChange}
                            onblur={formik.handleBlur}
                            error={
                                formik.errors.email && formik.touched.email
                                    ? formik.errors.email
                                    : ""
                            }
                            placeholder="輸入您的大名"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <FillItem
                            ref={refPassword}
                            name="password"
                            title="密碼"
                            type="password"
                            value={formik.values.password}
                            onchange={formik.handleChange}
                            onblur={formik.handleBlur}
                            error={
                                formik.errors.password &&
                                formik.touched.password
                                    ? formik.errors.password
                                    : ""
                            }
                            placeholder="輸入您的密碼"
                        />
                    </div>
                </div>
            </div>

            <div className="box_bottom">
                <div className="row">
                    <div className="col">
                        <button type="submit" className="btn btn-lg btn_style1">
                            {formAction === formActionList.singIn
                                ? "登入"
                                : "註冊"}
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button
                            type="button"
                            className="btn btn-lg btn_style1"
                            onClick={handleChangeFormAction}
                        >
                            {formAction === formActionList.singIn
                                ? "切換至註冊"
                                : "切換至登入"}
                        </button>
                    </div>
                </div>
                {isWaitingResult ? (
                    <>
                        <Split content={<small>系統訊息</small>} />
                        <div className="alert alert-info" role="alert">
                            作業中~
                        </div>
                    </>
                ) : null}
            </div>
        </form>
    );
};

export default SignInForm;
