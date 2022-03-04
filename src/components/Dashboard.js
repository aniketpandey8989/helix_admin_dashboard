import React, { useEffect, useState, useContext, useCallback } from 'react'
import { Form, FormGroup, Label, Input, FormText, Button, Table, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./dashboard.css"
import moment from 'moment';
import { useNavigate } from "react-router-dom"
import keycloakApi from '../apiCall';
import ReactPaginate from 'react-paginate'
import ModelComponent from './Model';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../App';
import axios from 'axios';




const Dashboard = () => {
    const keycloak = useContext(AuthContext);
    console.log("---use context vaklue-----", keycloak);

    const breadcrum = ["Users", "Roles/Permessions"]
    const [active, setActive] = useState(0)
    const [customerList, setCustomerList] = useState([])
    const [skip, setSkip] = useState(0)
    const [recordCount, setRecordCount] = useState(0)
    const [pageCount, setPageCount] = useState(0);
    const navigate = useNavigate()
    const [showModel, setShowModel] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [loginUserRole, setLoginUserRole] = useState("")
    const [showAction, setShowAction] = useState(null)
    const [isTabOpen, setIsTabOpen] = useState(false)







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
            if (keycloak.hasRealmRole("Download Reports")) {
                setLoginUserRole("Sub User")
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









    const getAllCustomer = async () => {

        try {

            const accessToken = localStorage.getItem("accessToken");

            const res = await axios.get(`http://localhost:8081/api/im_users/getImUser?id=${keycloak?.subject}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },

            })

            console.log("-------------res------------------", res);
            setCustomerList(res?.data)









            // const res = await keycloakApi.get(`/users`)
            // console.log("---res data----", res.data)
            // let sorted_data = res?.data.sort(function (var1, var2) {
            //     // console.log("------------",var1,var2);
            //     var a = new Date(var1?.createdTimestamp).getTime(), b = new Date(var2?.createdTimestamp).getTime();
            //     if (a > b) {

            //         return -1;
            //     }
            //     if (a < b) {

            //         return 1;
            //     }

            //     return 0;
            // })
            // setCustomerList(sorted_data)
            // const sortedActivities = activities.sort((a, b) => b.date - a.date)



        } catch (error) {
            // navigate("/login")

        }

    }

    useEffect(() => {
        if (keycloak?.authenticated === true) {
            getAllCustomer()
        }

    }, [keycloak])



    const handleActive = (i) => {
        setActive(i)
    }
    const handlePageChange = (selectedObject) => {
        setSkip(selectedObject.selected * 10)
    };

    const handleDelete = async () => {
        console.log("---delete--", selectedRecord)
        try {
            const res = await keycloakApi.delete(`/users/${selectedRecord}`)
            console.log("---res----", res);
            setShowModel(false)
            notify("User deleted sucessfully")
            getAllCustomer()

        } catch (error) {
            console.log("----error--", error);
            notifyError("Unauthorized")


        }


    }
    const notifyError = (message) => toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => { setShowModel(false) }
    });

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

    const handleLogout = useCallback(() => {
        console.log("---caliinging---");
        // localStorage.clear();
        keycloak
            ?.logout()
        //   .then(() =>navigate("/"));
    }, [keycloak]);





    return (
        <div className='main_container'>
            <ToastContainer theme="dark" />
            <ModelComponent showModel={showModel} setShowModel={setShowModel} handleDelete={handleDelete} />
            <div className='heading_div'>
                <div >
                    <h2 className="dashboard"  >User Management</h2>
                </div>
                <div className='logout_main'>
                    <div> <h5 className='username' >Hi, {keycloak?.idTokenParsed?.preferred_username}</h5></div>
                    <Button
                        color="info"
                        onClick={() => handleLogout()}
                    >
                        Logout
                    </Button>
                </div>
            </div>
            {/* <div style={{ height: "60px", width: "60px", position: 'relative' }}>
                        <img style={{ width: "60px", height: "60px" }} src={require("../assests/logo192.png")} />
                    </div> */}

            <div className='button_div' >
                <div>

                    {breadcrum.map((d, i) => {
                        return (<span key={i} onClick={() =>{ handleActive(i); if(d==="Roles/Permessions"){
                            navigate(`/permission`)
                        }}} className={`span  ${active === i ? "active" : ""}`} >{d}</span>)
                    })}

                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ marginRight: "20px" }}>
                        <Button
                            color="success"
                            onClick={() => { window.open("http://localhost:3010", "_self") }}
                        >
                            Helix App
                        </Button>
                    </div>
                    {loginUserRole !== "Sub User" && (
                        <Button
                            color="primary"
                            onClick={() => navigate("/create-user")}
                        >
                            Add {addUserToGroup(loginUserRole)}
                        </Button>
                    )}
                </div>
            </div>


            {/* ---------------------------table-------------------- */}
            <div className='table_content' >
                <h5> All {addUserToGroup(loginUserRole)} List</h5>
            </div>
            <Table className='table_style' >
                <thead style={{ background: "#000", color: "#fff" }}>
                    <tr>
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
                                        {/* <div className='action_div' >
                                            <div>
                                                <Button
                                                    color="success"
                                                    onClick={() => navigate(`/subcustomer?id=${dta?.id}`)}
                                                >
                                                    View
                                                </Button>

                                            </div>
                                            <div className='button_mar20' >
                                                <Button
                                                    color="danger"
                                                    onClick={() => {
                                                        setSelectedRecord(dta?.id)
                                                        setShowModel(true)
                                                    }}

                                                >
                                                    Delete
                                                </Button>

                                            </div>

                                        </div>  */}
                                        <div>
                                            <img className={`arrowDown  ${dta?.id === showAction ? "active_rotate" : ""}`} src={require("../assests/awrrowDown.png")}
                                                onClick={() => {
                                                    console.log("---hello--", dta?.id); setIsTabOpen((prev) => !prev); setShowAction(prev => {
                                                        if (prev !== dta?.id) {
                                                            return dta?.id
                                                        }
                                                        else {
                                                            return null
                                                        }
                                                    })
                                                }}



                                            />
                                            {/* <h6 style={{cursor:"pointer"}} onClick={() => {console.log("---hello--",dta?.id); setIsTabOpen((prev)=>!prev) ;setShowAction(prev=>{
                                                if(prev!==dta?.id){
                                                    return dta?.id
                                                }
                                                else{
                                                    return null
                                                }
                                            })}}  >click</h6> */}

                                            <div className={`unorder  ${dta?.id === showAction ? "active_tab" : ""}`} >
                                                <span className='listItem' onClick={() => navigate(`/subcustomer?id=${dta?.id}`)}  >View</span>
                                                <span className='listItem' onClick={() => {
                                                    setSelectedRecord(dta?.id)
                                                    setShowModel(true)
                                                }}  >Delete</span>
                                                {/* <span  className='listItem' onClick={()=>navigate(`/permission?id=${dta?.id}`)} >Permessions</span> */}


                                            </div>

                                        </div>

                                    </td>
                                )}






                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <div className='pagi_div' >
                {/* <ReactPaginate
					pageCount={pageCount}
					pageRange={2}
					marginPagesDisplayed={2}
					onPageChange={handlePageChange}
					containerClassName={'container'}
					previousLinkClassName={'page'}
					breakClassName={'page'}
					nextLinkClassName={'page'}
					 pageClassName={'page'}
					disabledClassName={'disabled'}
					activeClassName={'active_p'}
                    pageLinkClassName={"list_class"}
				/> */}



            </div>
        </div>

    )
}

export default Dashboard