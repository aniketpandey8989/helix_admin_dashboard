import React, { createContext, useState, useEffect } from 'react'

// KEYCLOACK
import Keycloak from 'keycloak-js'

const KeycloackContext = createContext()

const KeycloackContextProvider = (props) => {
    const [ keycloackValue, setKeycloackValue ] = useState(null)
    const [ authenticated, setAuthenticated ] = useState(false)

    const setKeycloack = () => {
        const keycloak = Keycloak("/keycloak.json")

        keycloak.init({
            onLoad: 'login-required', 
        }).then(authenticated => {
            setKeycloackValue(keycloak)
            setAuthenticated(authenticated)
            
               if (authenticated) 
              {
                localStorage.setItem("accessToken", keycloak.token);
              }

        })
    }

    const logout = () => {
        setKeycloack(null)
        setAuthenticated(false)
         localStorage.clear();
        keycloackValue.logout()
    }

    useEffect(() => {
        setKeycloack()
    }, [])

    return (
        <KeycloackContext.Provider
            value={{
                keycloackValue,
                authenticated,
                logout
            }}
        >
            {props['children']}
        </KeycloackContext.Provider>
    )
}

export { KeycloackContextProvider, KeycloackContext }