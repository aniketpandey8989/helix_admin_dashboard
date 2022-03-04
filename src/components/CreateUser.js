import React, { useState, useContext, useEffect } from 'react'
import './CreateUser.css'
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom"
import keycloakApi from '../apiCall';
import { userInfo } from '../data';
import { AuthContext } from '../App';
import axios from 'axios';









const CreateUser = () => {
    const keycloak = useContext(AuthContext);
    console.log("---use context vaklue-----", keycloak);

    const { register, handleSubmit, watch, formState: { errors } ,reset } = useForm();
    const navigate = useNavigate()
    const [disableSubmit, setDisableSubmit] = useState(false)
    const [loginUserRole, setLoginUserRole] = useState("")


    useEffect(() => {
        if (keycloak?.authenticated === true) {
            console.log("------adadadad----", keycloak?.hasRealmRole("Create Sub Customer"));
            if (keycloak.hasRealmRole("Create Customer")) {
                setLoginUserRole("Admin")
            }

            if (keycloak.hasRealmRole("Create Sub Customer")) {
                setLoginUserRole("Customer")
            }

            if (keycloak.hasRealmRole("Create User")) {
                setLoginUserRole("Sub Customer")
            }
            if (keycloak.hasRealmRole("Create Sub User")) {
                setLoginUserRole("User")
            }

        }



    }, [keycloak])


    const addUserToGroup = (user) => {

        switch (user) {
            case "Admin":
                return "Customer(CBRE)"
            case "Customer":
                return "Sub Customer(MS)"
            case "Sub Customer":
                return "User"
            case "User":
                return "Sub User"
        }

    }


    const notify = () => toast.success('Customer is created successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => { navigate("/") }
    });

    const notifyError = () => toast.error('Some thing went wrong', {
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
        console.log("*********************",data)
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
        formObj.parentUserId=keycloak?.subject;
        formObj.parentRole=loginUserRole
        console.log("----object----", formObj)


        const accessToken = localStorage.getItem("accessToken");

       const res =await  axios.post("http://localhost:8081/api/im_users/createImUser",formObj ,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            data
        })  
    
            if (res.status === 201) {
                setDisableSubmit(false)
                notify()
                reset()
            }


        
        // try {
        //     const res = await keycloakApi.post('/users', formObj)
        //     setDisableSubmit(false)
        //     console.log("---------res----", res);
        //     if (res.status === 201) {
        //         notify()
        //         reset()
                
        //     }
        // } catch (error) {
        //     console.log("---error--", error);
        //     setDisableSubmit(false)
        //     notifyError()
        // }
    };


    return (
        <div className='user_main_container'>
            {/* <button onClick={notify}>Notify!</button> */}
            <ToastContainer theme="dark" />

            <h3>Create {addUserToGroup(loginUserRole)}</h3>

            <form onSubmit={handleSubmit(onSubmit)}  >
                <div className="form-group">
                    <label>User name</label>
                    <input type="text" className="form-control" aria-describedby="emailHelp" placeholder="User Name"  {...register("username")} />

                </div>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" {...register("email")} />

                </div>
                <div className="form-group">
                    <label >Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"{...register("password")} />
                </div>
                {keycloak?.hasRealmRole("Add Logo") && (<div className="form-group">
                    <label >Add Logo</label>
                    <input type="file" className="form-control-file" id="exampleFormControlFile1" {...register("file")}  />
                </div>)}

                <button disabled={disableSubmit} type="submit" className="mt-4 btn btn-primary ">Submit</button>
            </form>

        </div>
    )
}

export default CreateUser