import React, { useState, useEffect, useContext } from "react";
// import "./sensorconfig.css";
import { Button, Dropdown, DropdownItem, DropdownMenu } from "reactstrap";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useForm, useFieldArray } from "react-hook-form";
import keycloakApi from "../../apiCall";
import axios from "axios";
import { KeycloackContext } from "../Keycloack/KeycloackContext";

const UpdateConfigData = () => {
  const [configData, setConfigData] = useState([{}]);
  const { register, control, handleSubmit, reset, formState, setValue,watch ,} =
    useForm();
  const { id } = useParams();

  const { fields, append, remove } = useFieldArray({ name: "config", control });
  const { keycloackValue, authenticated, logout } =
    useContext(KeycloackContext);

  useEffect(async () => {
    console.log(id, "id in update");

    try {
      const accessToken = localStorage.getItem("accessToken");
      let res = await axios.get(
        `${process.env.REACT_APP_HELIX_SERVER_URL}/sensor_config/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("------res------in useEffect", res.data);
      if(res.status===200){
          let receiveData = res.data
        setValue("sensorCode",receiveData.sensorCode)
        setValue("sensorType",receiveData.sensorType)
        setValue("config",receiveData.sensor_config)
        

      }
      

      // setConfigList(res.data);
      setConfigData(res?.data);
    } catch (error) {}
  }, []);
  //   http://localhost:8081/api/sensor_config/6247e021e78d8d16f8480c52
  const onSubmit = async (data) => {
    console.log(data, "data onSubmit");
    // display form data on success
    const accessToken = localStorage.getItem("accessToken");

    const res = await axios.put(
      `${process.env.REACT_APP_HELIX_SERVER_URL}/sensor_config/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("----res----",res);

    reset({});
  };

  return (
    <div>
      <h3>Edit Sensor Configuration</h3>
      <div className="main_container">
        <Button
          color="success"
          onClick={() => append({})}
          className="Add_button"
        >
          {fields.length === 0 ? "Add config" : "Add more config"}
        </Button>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* {configData &&
                      configData?.map((dt, idx) => (
                        console.log(dt,"===dt")
                      ))} */}
          {fields.length > 0 && (
            <div className="form-group" style={{ padding: "20px" }}>
              <label>Sensor code:</label>
              <input
                type="text"
                required={true}
                name={`deviceId`}
                // value={configData.sensorCode}
                {...register(`sensorCode`, { required: true })}
                className="form-control"
                aria-describedby="emailHelp"
                placeholder="Sensor code"
              />
              <div className="form-group">
                <label>Sensor Type:</label>
                <input
                  type="text"
                  required={true}
                //   value={configData.sensorType}
                  name={`deviceId`}
                  {...register(`sensorType`, { required: true })}
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Sensor Type"
                />
              </div>
            </div>
          )}

          {fields.map((item, i) => (
            <div className="formbox_div" key={i}>
              <div className="label_div">
                <div className="form-group">
                  <label>Config Name:</label>
                  {configData &&
                    configData.sensor_config?.map((dt, idx) => {
                      console.log(dt, "mappppppppp");
                    })}
                  <input
                    type="text"
                    required={true}
                    name={`config[${i}]label`}
                    {...register(`config.${i}.label`, { required: true })}
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Label"
                  />
                </div>
                <div className="form-group">
                  <label>Default value:</label>
                  <input
                    type="number"
                    required={true}
                    name={`config[${i}]defaultValue`}
                    {...register(`config.${i}.defaultValue`, {
                      required: true,
                    })}
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Default value"
                  />
                </div>
              </div>
              <div className="start_div">
                <div className="form-group">
                  <label>Start Range:</label>
                  <input
                    type="number"
                    required={true}
                    name={`config[${i}]startRange`}
                    {...register(`config.${i}.startRange`, { required: true })}
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Start range"
                  />
                </div>
                <div className="form-group">
                  <label>End Range:</label>
                  <input
                    type="number"
                    required={true}
                    name={`config[${i}]endRange`}
                    {...register(`config.${i}.endRange`, { required: true })}
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="End range"
                  />
                </div>

              </div>
              <div className="end_div">


                <div className="form-group">
                  <label>Description:</label>
                  <input
                    type="text"
                    name={`config[${i}]description`}
                    {...register(`config.${i}.description`)}
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Description"
                    required={true}
                  />
                </div>
                <div className="form-group">
                  <label>Unit:</label>
                  <input
                    type="text"
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Unit"
                    {...register(`config.${i}.unit`)}
                     required={true}
                  />
                </div>
              </div>
              <div className="button_div">
                <Button
                  color="primary"
                  style={{ marginLeft: "20px" }}
                  onClick={() => remove(i)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          {fields.length > 0 && (
            <div className="submit_div">
              <Button color="success">Update</Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateConfigData;
