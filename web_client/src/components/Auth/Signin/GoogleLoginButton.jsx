import React from 'react'
import { GoogleLogin } from "@react-oauth/google";
import { verifyGoogleToken } from '@/http/apiCalls';
import { afterSucessfullLogin } from '@/utils/helper';

const GoogleLoginButton = () => {
    const onSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;
        const response = await verifyGoogleToken({ token });
        if (response.success) {
            afterSucessfullLogin(response.data.token);
        } else {
            window.alert("Login failed: " + response.message);
        }       
    };

    const onError = (error) => {
        window.alert("Login Failed error: " + error);
    };
    return (
        <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
        />
    )
}

export default GoogleLoginButton