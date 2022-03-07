import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown
} from "reactstrap";
import home from "../../src/assests/blackhome.png";
import logoImg from "../../src/assests/helixSenseLogo.svg";
import logout from "../../src/assests/logout.png";
import plus from "../../src/assests/plus.png";
import role from "../../src/assests/role.png";
import userimg from "../../src/assests/user.png";
import keycloakApi, { HELIX_SERVER_URL } from "../apiCall";
import { AuthContext } from "../App";
import "./dashboard.css";
import ModelComponent from "./Model";






const Dashboard = () => {
    const keycloak = useContext(AuthContext);
    console.log("-----kc----",keycloak);
    const breadcrum = ["Users", "Roles/Permessions"];
    const [active, setActive] = useState(0);
    const [customerList, setCustomerList] = useState([]);
    const [skip, setSkip] = useState(0);
    const [recordCount, setRecordCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const navigate = useNavigate();
    const [showModel, setShowModel] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [loginUserRole, setLoginUserRole] = useState("");
    const [showAction, setShowAction] = useState(null);
    const [isTabOpen, setIsTabOpen] = useState(false);

    // useEffect( () => {

        



    //     if (keycloak?.authenticated === true) {
    //         if (keycloak.hasRealmRole("Create Customer")) {
    //             setLoginUserRole("Admin");
    //         }

    //         if (keycloak.hasRealmRole("Create Sub Customer")) {
    //             setLoginUserRole("Customer");
    //         }

    //         if (keycloak.hasRealmRole("Create User")) {
    //             setLoginUserRole("Sub Customer");
    //         }
    //         if (keycloak.hasRealmRole("Create Sub User")) {
    //             setLoginUserRole("User");
    //         }
    //         if (keycloak.hasRealmRole("Download Reports")) {
    //             setLoginUserRole("Sub User");
    //         }
    //     }
    // }, [keycloak]);

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


        const resGroup = await keycloakApi.get(`/users/${keycloak?.subject}/groups`)
        console.log("-------res---------",resGroup.data[0].name);
    
        setLoginUserRole(resGroup.data[0].name)





        try {
            const accessToken = localStorage.getItem("accessToken");

            const res = await axios.get(
                `${HELIX_SERVER_URL}/im_users/getImUser?id=${keycloak?.subject}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            let sorted_data = res?.data.sort(function (var1, var2) {
                // console.log("------------",var1,var2);
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

        } catch (error) { }
    };

    useEffect(() => {
        if (keycloak?.authenticated === true) {
            getAllCustomer();
        }
    }, [keycloak]);

    const handleActive = (i) => {
        setActive(i);
    };
    const handlePageChange = (selectedObject) => {
        setSkip(selectedObject.selected * 10);
    };

    const handleDelete = async () => {

        try {
            const res = await keycloakApi.delete(`/users/${selectedRecord}`);

            setShowModel(false);
            notify("User deleted sucessfully");
            getAllCustomer();
        } catch (error) {
            notifyError("Unauthorized");
        }
    };
    const notifyError = (message) =>
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClose: () => {
                setShowModel(false);
            },
        });

    const notify = (message) =>
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClose: () => {
                navigate("/");
            },
        });

    const handleLogout = useCallback(() => {
        // localStorage.clear();
        keycloak?.logout();
        //   .then(() =>navigate("/"));
    }, [keycloak]);

    

    return (
        <div>
            <ToastContainer theme="dark" />
            <ModelComponent
                showModel={showModel}
                setShowModel={setShowModel}
                handleDelete={handleDelete}
            />
            <div className="heading_div">
                <div>
                    <img src={logoImg} alt="logo" className="logoimg " />
                </div>
                <div className="logout_main">
                    <div className="name-logout">
                        <h6>Hi, {keycloak?.idTokenParsed?.preferred_username}</h6>
                        <UncontrolledDropdown>
                            <DropdownToggle className="dropdown-style">
                                <img src={userimg} alt="logo" className="user " />
                            </DropdownToggle>
                            <DropdownMenu >
                                {/* <DropdownItem header> 
                <img src={changelogo} alt="logo" className="logo-size " />Change logo</DropdownItem> */}
                                <DropdownItem style={{ cursor: "pointer" }} header> <div onClick={() => handleLogout()} > <img src={logout} alt="logo" className="logo-size " />Logout</div></DropdownItem>

                            </DropdownMenu>
                        </UncontrolledDropdown>

                    </div>
                </div>
            </div>
            <div className="sidebar">
                <div className="bg-sidebar">
                    <div className="img-style">
                        <img src={home} title="User" alt="logo" className="user " />
                    </div>
                    {loginUserRole==="Admin"&&(<div className="img-style" onClick={() => { navigate(`/permission`) }}  >
                        <img src={role} title="Roles/Permessions" alt="logo" className="user " />
                    </div>)}
                </div>
                <div className="main-section">
                    <div className="button_div">
                        <div style={{ display: "flex" }}>
                            <div style={{ marginRight: "20px" }}>
                                <Button
                                    color="success"
                                    onClick={() => {
                                        window.open("http://ec2-18-192-107-104.eu-central-1.compute.amazonaws.com:3010/", "_blank");
                                    }}
                                >
                                    Helix App
                                </Button>
                            </div>
                            {loginUserRole !== "Sub User" && (
                                <Button
                                    color="primary"
                                    onClick={() => navigate("/create-user")}
                                    className="bg-btn"
                                >
                                    <img src={plus} alt="logo" className="logo-size " /> ADD {addUserToGroup(loginUserRole)}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* ---------------------------table-------------------- */}
                    <div className="table_content">
                        <h5> All {addUserToGroup(loginUserRole)} List</h5>
                    </div>
                    <table className="table table-bordered">
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
                        <tbody className="table_body">

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
                                                                   <span className='listItem' onClick={() => navigate(`/subcustomer/${dta?.id}`)}  >View</span>
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
                    <div className="pagi_div"></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;