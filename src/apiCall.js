
import axios from "axios";
import {useNavigate} from "react-router-dom"


const keycloakApi = axios.create({
    baseURL: `http://localhost:8080/auth/admin/realms/washroom`,
});

keycloakApi.interceptors.request.use((request) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`;

    }
    
    return request;
});
// keycloakApi.interceptors.response.use(undefined, (error) => {
//     // Errors handling
//     if (error.status === 401) {
//       localStorage.removeItem("accessToken")
//       const navigate = useNavigate()
//       navigate("/login")
//     }
//   });

export default keycloakApi