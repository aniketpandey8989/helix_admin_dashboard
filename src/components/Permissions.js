import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import keycloakApi, { BASE_URL } from '../apiCall';
import './Permission.css'
import { useForm } from "react-hook-form";
import { Form, FormGroup, Label, Input, FormText, Button, Table, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import axios from 'axios';



const Permissions = () => {
    const [searchParams] = useSearchParams();
    const [customerDetails, setCustomerDetails] = useState(null)
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const [roles, setRoles] = useState([])
    const [keyclockGroup, setkeyclockGroup] = useState([])
    const [allGroups,setAllGroups]=useState([])

    const [roleList, setRoleList] = useState([])

    const [permsList, setParamsList] = useState([
        "Add Logo", "View All Users", "Create Sub Customer", "Add Ifc", "Add Sensor", "Delete Sensor", "Add Gateway", "Replace Gateway", "Create User", "Create Sub User", "View All User Dashboard"
    ])

    useEffect(() => {
        getAllGroups()
        // getRoles()
    }, [])

    const getAllGroups = async () => {
        const res = await keycloakApi("/groups")
        console.log("----------groups---", res);

        let group = await res.data.filter(d => { if (d.name != "Admin") return true })
        console.log("----------------------jgjgfjgjgjg------------", group);

        //  group =  await group.map( async d=>{

        //     let res_data = await keycloakApi(`/groups/${d.id}`)
        //     console.log("-------res_dtat----",res_data.res_data?.data?.realmRoles);
        //     d.roles=res_data?.data?.realmRoles
        //     return d
        //  })

        for (let i = 0; i < group.length; i++) {
            // console.log("+++++++++++++++++++++++++++=", group[i]?.id);
            let res_data = await keycloakApi(`/groups/${group[i].id}`)
            // console.log("-------******************8----", res_data?.data?.realmRoles);
            group[i]["roles"] = res_data?.data?.realmRoles


        }




        console.log("----------------new group-------------", group);
        setkeyclockGroup(group)
        setAllGroups(group)
        getRoles(group)


    }






    const getRoles = async (group) => {



        console.log("-----------000000000000000000000----------------------", group);



        let res = await keycloakApi.get(`/roles`)
        console.log("-----res-----///////////////////////////////////////////////-", res,group)
        setRoles(res.data)

        let UserTypes = []
        // keyclockGroup.map(d=>{

        //     console.log(d.roles);
        //     UserTypes.push(d?.name)
        // })

        let tablelist = res.data.map((dta) => {

            let d_Obj = {}

            group.map(d => {
                // console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", dta, "aaaaaaaaaaaaaaaaaaaaaaaa", d.roles);
                d_Obj[`${d.name}`] = d.roles.includes(dta.name)
                d_Obj["group_id"]=d.id
            })


            // for (let i = 0; i < UserTypes.length; i++) {
            //     d_Obj[`${UserTypes[i]}`] = false
            // }
            let dat = {}
            dat[`${dta.name}`] = d_Obj

            console.log("--------------------------------0000",{ ...dta, checkValues: dat });
            return { ...dta, checkValues: dat }

        })
        console.log("=====================uususfsuiiufiusfs==============", tablelist);
        setRoleList(tablelist)


    }

    const getUserDetails = async () => {
        let id = searchParams.get("id")
        let res = await keycloakApi.get(`/users/${id}`)
        console.log("-----res------", res)
        if (res.status === 200) {
            setCustomerDetails(res?.data)
            console.log("----user data---", res);
        }
    }




    const handleChecked = async(dta, group, e) => {
        console.log("---------handele click data", dta,"ooooooo",group);
        console.log("---------handele click data------------", e.target.checked);
        let Value = Object.values(dta.checkValues)
        console.log("----ckkkfkfskfskfsf----",Value[0].group_id);

        let group_id =Value[0].group_id

        const sendData = [{
            attributes: {},
            clientRole: false,
            composite: false,
            containerId: dta.containerId,
            id: dta.id,
            name: dta.name
        }]

       

        console.log("-------send onbje----",sendData);

       if(e.target.checked){
        const res=  await keycloakApi.post(`groups/${group}/role-mappings/realm`,sendData)
        console.log("-----res------",res);
        getAllGroups()
       }
       else{
        // console.log("-----------------sendsdata---",sendData);
        // const res=  await keycloakApi.delete(`groups/${group}/role-mappings/realm`,JSON.stringify({id:dta.id,name:dta.name}))
        // console.log("-----res------",res);
        // getAllGroups()
        const accessToken = localStorage.getItem("accessToken");

     let res = await   axios.delete(`${BASE_URL}/groups/${group}/role-mappings/realm`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              
            },
            data: sendData,
          })


          console.log("---------del---res----",res);
          getAllGroups()


        
       }



        //   let mod =  roleList.map(d=>{
        //         //  console.log("---data--------handle---",d);

        //         let key1 = Object.keys(d)
        //         let Value =Object.values(d)

        //         let key2 = Object.keys(dta)
        //         // console.log("------key ,valuw",key1,Value);


        //         if(key1[0]===key2[0]){




        //             d[key2[0]][group]=e.target.checked

        //         }
        //         return d

        //     })

        //     setRoleList(mod)


    }

    const handleSubmitData = () => {
        console.log("----------------------", roleList);

    }





    return (
        <div className='perm_maindiv' >
            <h3> Permission </h3>





            <form  >
                <table className="table table-bordered" >
                    <thead style={{ background: "#3a4354", color: "#fff", border: "1px sold white" }} >
                        <tr>
                            <th scope="col">Permissions</th>
                            {keyclockGroup.map((d, i) => {
                                return (<th key={i} scope="col">{d.name}</th>)
                            })}

                            {/* <th scope="col">Customer</th>
                            <th scope="col">Sub Customer</th>
                            <th scope="col">User</th>
                            <th scope="col">Sub User</th> */}
                        </tr>
                    </thead>
                    <tbody style={{ border: "1px solid black" }} >

                        {roleList.map((dta, idx) => {
                            // console.log("----dtat---", dta);


                            let keyi = Object.keys(dta?.checkValues)
                            let Value = Object.values(dta.checkValues)
                            // console.log("------key ,valuw", keyi, Value[0]["Customer"]);

                            return (

                                
                                <tr key={idx}>
                                    <th scope="row">{keyi[0]}</th>
                                    {console.log("--------------------roles-------------------",allGroups)}

                                    {allGroups.map((d,i)=>{
                                        return(
                                            <td  key={i} ><div className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={Value[0][d.name]} onChange={(e) => handleChecked(dta, d.id ,e)} id="flexCheckIndeterminate" />

                                    </div></td>
                                        )

                                    })}


{/* 
                                    <td><div className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={Value[0]["Customer"]} onChange={(e) => handleChecked(dta, "Customer", e)} id="flexCheckIndeterminate" />

                                    </div></td>

                                    <td><div className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={Value[0]["Sub Customer"]} onChange={(e) => handleChecked(dta, "Sub Customer", e)} id="flexCheckIndeterminate" />

                                    </div></td>
                                    <td><div className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={Value[0]["Sub User"]} onChange={(e) => handleChecked(dta, "Sub User", e)} id="flexCheckIndeterminate" />

                                    </div></td>
                                    <td><div className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={Value[0]["User"]} onChange={(e) => handleChecked(dta, "User", e)} id="flexCheckIndeterminate" />

                                    </div></td> */}
                                   
                                </tr>
                            )





                        })}







                    </tbody>
                </table>
                {/* <div style={{ marginTop: "20px" }} >
                    <button onClick={() => handleSubmitData()} type="button" className="btn btn-success">Submit</button>
                </div> */}
            </form>























        </div>
    )
}

export default Permissions