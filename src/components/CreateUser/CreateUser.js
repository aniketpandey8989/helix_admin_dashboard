import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import keycloakApi, { HELIX_SERVER_URL } from '../../apiCall';
import { KeycloackContext } from '../Keycloack/KeycloackContext';
import './CreateUser.css';


const CreateUser = () => {
    const { keycloackValue} = useContext(KeycloackContext)
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const navigate = useNavigate()
    const [disableSubmit, setDisableSubmit] = useState(false)
    const [loginUserRole, setLoginUserRole] = useState("")


    useEffect(() => {
        getUserGroup()
    }, [keycloackValue])


    const getUserGroup = async () => {
        const resGroup = await keycloakApi.get(`/users/${keycloackValue?.subject}/groups`)

        setLoginUserRole(resGroup.data[0].name)
    }

    const addUserToGroup = (user) => {

        switch (user) {
            case "Admin":
                return "Customer"
            case "Customer":
                return "Sub Customer"
            case "Sub Customer":
                return "User"
            case "User":
                return "Sub User"
        }

    }


    const notify = (message) => toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => { navigate("/") }
    });

    const notifyError = (message) => toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });




    const onSubmit = async data => {
        setDisableSubmit(true)

        let formObj = {}
        formObj.username = data.username
        formObj.email = data.email
        formObj.credentials = [{
            type: "password",
            value: data.password,
            temporary: true
        }]
        let groupToAdd = addUserToGroup(loginUserRole)
        formObj.groups = [groupToAdd]
        formObj.enabled = true
        formObj.parentUserId = keycloackValue?.subject;
        formObj.parentRole = loginUserRole

        const accessToken = localStorage.getItem("accessToken");

        try {
            const res = await axios.post(`${HELIX_SERVER_URL}/im_users/createImUser`, formObj, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                data
            })

            if (res.status === 201) {
                setDisableSubmit(false)
                notify(`${addUserToGroup(loginUserRole)} is created sucessfully`)
                reset()
            }
        } catch (error) {
           
            setDisableSubmit(false)
             if(error.response.status===409)
            notifyError(`${addUserToGroup(loginUserRole)} is already created`)
            else{
                notifyError("something went wrong")
            }
        }
    };

    return (
        <div className='user_main_container'>

            <ToastContainer theme="dark" />

            <h3>Create {addUserToGroup(loginUserRole)}</h3>

            <form onSubmit={handleSubmit(onSubmit)}  >
                <div className="form-group">
                    <label>User name</label>
                    <input type="text" className="form-control" aria-describedby="emailHelp" placeholder="User Name"  {...register("username")} />

                </div>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" {...register("email",{  required:true,pattern:/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/})} />
                    {errors.email?.type==="pattern" && <small id="passwordHelp" class="text-danger">
             email is not valid
        </small> }

                </div>
                <div className="form-group">
                    <label >Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"{...register("password",{  required:"password must be minimum six characters, at least one letter, one number and one special character:" ,pattern:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/})} />
                </div>
                {errors.password?.type==="pattern" && <small id="passwordHelp" class="text-danger">
             password must be minimum eight characters, at least one letter, one number and one special character:
        </small> }


                <button type="submit" className="mt-4 btn btn-primary ">Submit</button>
            </form>

        </div>
    )
}

export default CreateUser