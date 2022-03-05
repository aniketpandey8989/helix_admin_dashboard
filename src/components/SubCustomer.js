import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { Dropdown, DropdownItem, DropdownMenu } from 'reactstrap';
import keycloakApi, { HELIX_SERVER_URL } from '../apiCall';
import { AuthContext } from '../App';
import "./SubCustomer.css";



const SubCustomer = () => {
    const [searchParams] = useSearchParams();
    const { id } = useParams();
    
    const [customerId, setCustomerId] = useState(null)
    const [customerDetails, setCustomerDetails] = useState(null)


    const keycloak = useContext(AuthContext);
 

    const breadcrum = ["Users", "Roles/Permessions"]
    const [active, setActive] = useState(0)
    const [customerList, setCustomerList] = useState([])
    const [skip, setSkip] = useState(0)
    const [recordCount, setRecordCount] = useState(0)
    const [pageCount, setPageCount] = useState(0);
    const navigate = useNavigate()
    const [showModel, setShowModel] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    // const [showModel, setShowModel] = useState(false);
    // const [selectedRecord, setSelectedRecord] = useState(null);
    const [loginUserRole, setLoginUserRole] = useState("");
    const [showAction, setShowAction] = useState(null);
    const [isTabOpen, setIsTabOpen] = useState(false);
    const [paramId,setParamId]=useState("")





    useEffect(() => {

        getUserDetails()


    }, [paramId,id])

    const getUserDetails = async () => {
       
        setCustomerId(id)
        let res = await keycloakApi.get(`/users/${id}`)
       
        if (res.status === 200) {
            setCustomerDetails(res?.data)
        }
    }



    const addUserToGroup = (user) => {
        switch (user) {
            case "Admin":
                return "Customer";
            case "Customer":
                return "Sub Customer";
            case "Sub Customer":
                return "User";
            case "User":
                return "Sub User";
        }
    };






    const getAllCustomer = async () => {

        try {

            const resGroup = await keycloakApi.get(`/users/${keycloak?.subject}/groups`)
            console.log("-------res---------",resGroup.data[0].name);
        
            setLoginUserRole(resGroup.data[0].name)





              const accessToken = localStorage.getItem("accessToken");
            
              

            const res = await axios.get(
                `${HELIX_SERVER_URL}/im_users/getImUser?id=${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

                        let sorted_data = res?.data.sort(function (var1, var2) {
                
                var a = new Date(var1?.createdTimestamp).getTime(), b = new Date(var2?.createdTimestamp).getTime();
                if (a > b) {

                    return -1;
                }
                if (a < b) {

                    return 1;
                }

                return 0;
            })
            setCustomerList(sorted_data)
            



        } catch (error) {
            // navigate("/login")

        }

    }

    useEffect(() => {
        if (keycloak?.authenticated === true) {
            getAllCustomer()
        }

    }, [keycloak,paramId,id])



    return (
        <div className='main_div'>
            <div className='detail_box'>
                <div style={{display:'flex'}}>
                    <div >
                        <h6>User Name</h6>
                        <h6>Email</h6>
                    </div>
                    <div className='detail_content'>
                        <h6>{customerDetails?.username}</h6>
                        <h6>{customerDetails?.email}</h6>
                    </div>
                </div>
            </div>
            <table class="table table-bordered">
                        <thead>
                            <tr className="bg-heading">
                                <th>
                                    SNo.
                                </th>
                                <th>
                                    Id
                                </th>
                                <th>
                                    User Name
                                </th>
                                <th>
                                    Email
                                </th>

                                <th>
                                    Enabled
                                </th>
                                <th>
                                    Created At
                                </th>
                                {
                                    loginUserRole !== "Sub User" && (
                                        <th>
                                            Actions
                                        </th>
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody>

                            {customerList?.map((dta, idx) => {
                                return (

                                    <tr key={idx} >

                                        <th scope="row">
                                            {idx + 1}
                                        </th>
                                        <td>
                                            {dta?.id}
                                        </td>
                                        <td>
                                            {dta?.username}
                                        </td>
                                        <td>
                                            {dta?.email}
                                        </td>

                                        <td>
                                            {dta?.enabled ? "true" : "false"}
                                        </td>
                                        <td>
                                            {moment(dta?.createdTimestamp).format('L')}

                                        </td>

                                        {loginUserRole !== "Sub User" && (
                                            <td>

                                                <div>
                                                    <img className={`arrowDown  ${dta?.id === showAction ? "active_rotate" : ""}`} src={require("../assests/awrrowDown.png")}
                                                        onClick={() => {
                                                             setIsTabOpen((prev) => !prev); setShowAction(prev => {
                                                                if (prev !== dta?.id) {
                                                                    return dta?.id
                                                                }
                                                                else {
                                                                    return null
                                                                }
                                                            })
                                                        }}



                                                    />


                                                    <div className={`unorder  ${dta?.id === showAction ? "active_tab" : ""}`} >
                                                    


                                                        <Dropdown isOpen={dta?.id === showAction ? true : false}>
                                                                                           
                                                            <DropdownMenu>
                                                               
                                                                <DropdownItem>
                                                                <span className='listItem' onClick={() => { setParamId(dta?.id);navigate(`/subcustomer/${dta?.id}`)}}  >View</span>
                                                                </DropdownItem>
                                                                <DropdownItem>
                                                                <span className='listItem' onClick={() => {
                                                    setSelectedRecord(dta?.id)
                                                    setShowModel(true)
                                                }}  >Delete</span>
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </Dropdown>



                                                    </div>

                                                </div>

                                            </td>
                                        )}






                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>

        </div>
    )
}

export default SubCustomer