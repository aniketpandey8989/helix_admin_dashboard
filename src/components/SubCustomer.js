import React, { useEffect, useState, useContext, useCallback } from 'react'
import { Form, FormGroup, Label, Input, FormText, Button, Table, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./SubCustomer.css"
import moment from 'moment';
import { useNavigate, useSearchParams } from "react-router-dom"
import keycloakApi from '../apiCall';
import ReactPaginate from 'react-paginate'
import ModelComponent from './Model';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../App';


const SubCustomer = () => {
    const [searchParams] = useSearchParams();
    const [customerId, setCustomerId] = useState(null)
    const [customerDetails, setCustomerDetails] = useState(null)


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


    useEffect(() => {

        getUserDetails()


    }, [])

    const getUserDetails = async () => {
        let id = searchParams.get("id")
        setCustomerId(id)
        let res = await keycloakApi.get(`/users/${id}`)
        console.log("-----res------", res)
        if (res.status === 200) {
            setCustomerDetails(res?.data)
        }
    }






    const getAllCustomer = async () => {

        try {
            const res = await keycloakApi.get(`/users`)
            console.log("---res data----", res.data)
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
                <Button
                    color="primary"
                    onClick={() => navigate("/create-user")}
                >
                    Add SubCustomer
                </Button>
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
                            First Name
                        </th>
                        <th>
                            Last Name
                        </th>
                        <th>
                            Enabled
                        </th>
                        <th>
                            Created At
                        </th>
                        <th>
                            Actions
                        </th>
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
                                    {dta?.firstName}
                                </td>
                                <td>
                                    {dta?.lastName}

                                </td>
                                <td>
                                    {dta?.enabled ? "true" : "false"}
                                </td>
                                <td>
                                    {moment(dta?.createdTimestamp).format('L')}

                                </td>
                                <td>
                                    <div className='action_div' >
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

                                    </div>
                                </td>





                            </tr>
                        )
                    })}
                </tbody>
            </Table>

        </div>
    )
}

export default SubCustomer