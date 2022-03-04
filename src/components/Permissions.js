import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import keycloakApi from '../apiCall';
import './Permission.css'
import { useForm } from "react-hook-form";


const Permissions = () => {
    const [searchParams] = useSearchParams();
    const [customerDetails, setCustomerDetails] = useState(null)
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

    useEffect(() => {
        // getUserDetails()
    }, [])

    const getUserDetails = async () => {
        let id = searchParams.get("id")
        let res = await keycloakApi.get(`/users/${id}`)
        console.log("-----res------", res)
        if (res.status === 200) {
            setCustomerDetails(res?.data)
            console.log("----user data---", res);
        }
    }
    const onSubmit = data => console.log(data);



    return (
        <div className='perm_maindiv' >
            <h3> Permission </h3>
            <form onSubmit={handleSubmit(onSubmit)} >
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Create_Sub_Customer")} />
                    <label className="form-check-label">
                        Create Sub Customer
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Add_Logo")} />
                    <label className="form-check-label">
                       Add Logo
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("View_All_Users")} />
                    <label className="form-check-label">
                       View All Users
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Delete_Sub_Customer")} />
                    <label className="form-check-label">
                      Delete Sub Customer
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("View_Sub_Customer_Dashboard")} />
                    <label className="form-check-label">
                     View Sub Customer Dashboard
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("View_Sub_User_Dashboard")} />
                    <label className="form-check-label">
                     View Sub User Dashboard
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Create_User")} />
                    <label className="form-check-label">
                     Create User
                    </label>
                </div>

                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Delete_User")} />
                    <label className="form-check-label">
                   Delete User
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("View_User_Dashboard")} />
                    <label className="form-check-label">
                   View User Dashboard
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Create_Sub_User")} />
                    <label className="form-check-label">
                   Create Sub User
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("View_Dashboard")} />
                    <label className="form-check-label">
                   View Dashboard
                    </label>
                </div>

                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Add_Ifc")} />
                    <label className="form-check-label">
                   Add Ifc
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Add_Hierarchy")} />
                    <label className="form-check-label">
                   Add Hierarchy
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Add_Sensor")} />
                    <label className="form-check-label">
                   Add Sensor
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Replace_Sensor")} />
                    <label className="form-check-label">
                   Replace Sensor
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Delete_Sensor")} />
                    <label className="form-check-label">
                   Delete Sensor
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Add_Gateway")} />
                    <label className="form-check-label">
                   Add Gateway
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Replace_Gateway")} />
                    <label className="form-check-label">
                     Replace Gateway
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Update_Firmware")} />
                    <label className="form-check-label">
                     Update Firmware
                    </label>
                </div>
      
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Reports")} />
                    <label className="form-check-label">
                     Reports
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" {...register("Download_Reports")} />
                    <label className="form-check-label">
                     Download Reports
                    </label>
                </div>






               
               <div  style={{marginTop:"20px"}} >
               <button type="submit" className="btn btn-success">Submit</button>
               </div>
            </form>
        </div>
    )
}

export default Permissions