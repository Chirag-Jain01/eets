import {
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    Box,
    Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

const REGISTER_URL = "http://localhost:8080/user/register";
const CHECK_URL = "http://localhost:8080/user/check";
const USER_REQUEST = "USER_REQUEST";
const USER_SUCCESS = "USER_SUCCESS";
const USER_FAILURE = "USER_FAILURE";
const USER_SAVED_SUCCESS = "USER_SAVED_SUCCESS";
const userRequest = () => {
    return {
        type: USER_REQUEST,
    };
};

const userSavedSuccess = (user) => {
    return {
        type: USER_SAVED_SUCCESS,
        payload: user,
    };
};

const userSuccess = (users) => {
    return {
        type: USER_SUCCESS,
        payload: users,
    };
};

const userFailure = (error) => {
    return {
        type: USER_FAILURE,
        payload: error,
    };
};

const Registration = (props) => {
    const [show, setShow] = useState(false);
    const [s, setS] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState();

    const initialState = {
        id: "",
        name: "",
        address: "",
        email: "",
        password: "",
        mobile: "",
    };

    const [user, setUser] = useState(initialState);

    const userChange = (event) => {
        const { name, value } = event.target;
        setUser({...user, [name]: value });
    };
    const idchange = (event) => {
        const { name, value } = event.target;
        setUser({ id: event.target.value });
        setUser({...user, [name]: value, id: value });
    };

    // const dispatch = useDispatch();

    const registerUser = async() => {
        console.log(user.name == null);

        if (!user.name ||
            !user.email ||
            !user.address ||
            !user.mobile ||
            !user.password
        ) {
            setS(true);
            setError("Empty Field");
        } else if (!user.email.match(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm)) {
            setS(true);
            setError("Invalid Email");
        } else if (!user.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
            setS(true);
            setError("Minimum eight characters, at least one letter and one number");
        } else if (!user.mobile.match(/^[0-9]{10}$/)) {
            setS(true);
            setError("Invalid Phone number");
        } else {
            try {
                const r = await axios.post(CHECK_URL, user);
                if (r.status == 404) {
                    setS(true);
                    setError("Invalid email and password");
                } else {
                    const response = await axios.post(REGISTER_URL, user);

                    localStorage.getItem("jwtToken", response.data.token);
                    setShow(true);
                    setMessage(response.message);
                    resetRegisterForm();
                    setTimeout(() => {
                        setShow(false);
                        props.history.push("/userLogin");
                    });
                }
            } catch (error) {
                setS(true);
                setError("Error while register new user or email Already in Use");
                console.log(error);
            }
        }
    };

    const resetRegisterForm = () => {
        setUser(initialState);
    };

    return ( <
        >
        <
        Box component = "form"
        noValidate sx = {
            { mt: 1 } }
        id = "registration-form" >
        <
        TextField margin = "normal"
        required fullWidth id = "name"
        name = "name"
        label = "Name"
        value = { user.name }
        onChange = { userChange }
        />{" "} <
        TextField margin = "normal"
        required fullWidth id = "email"
        name = "email"
        value = { user.email }
        onChange = { userChange }
        label = "Email Address" /
        > { " " } <
        TextField margin = "normal"
        required fullWidth id = "mobile"
        name = "mobile"
        value = { user.mobile }
        onChange = { idchange }
        label = "Phone Number"
        type = "text" /
        > { " " } <
        TextField margin = "normal"
        required fullWidth id = "address"
        name = "address"
        label = "Address"
        type = "text"
        value = { user.address }
        onChange = { userChange }
        />{" "} <
        TextField margin = "normal"
        required fullWidth id = "password"
        name = "password"
        label = "Password"
        type = "password"
        value = { user.password }
        onChange = { userChange }
        />{" "} <
        FormControlLabel control = { < Checkbox value = "agree"
            color = "primary"
            name = "tc"
            id = "tc" / > }
        label = "I agree to term and condition." /
        >
        <
        Box textAlign = "center" >
        <
        NavLink to = { "/userLogin" } >
        <
        Button type = "submit"
        onClick = { registerUser }
        variant = "contained"
        disabled = { user.email.length === 0 || user.password.length === 0 }
        sx = {
            { mt: 3, mb: 2, px: 5 } } >
        Join { " " } <
        /Button>{" "} <
        /NavLink>{" "} <
        p className = "mt-3" > { " " } { "" }
        Already Have an Account < span > { "" } < /span> {""}{" "} <
        /p>{" "} { "" } { " " } <
        /Box>{" "} { /* {error.status ? <Alert severity={error.type}>{error.msg}</Alert> : ""} */ } { " " } <
        /Box>{" "} <
        ToastContainer / >
        <
        />
    );
};

export default Registration;