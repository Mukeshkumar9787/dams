import React from 'react'
import { GoogleLogin } from "@react-oauth/google";
import { verifyGoogleToken } from '@/http/apiCalls';
import { afterSucessfullLogin } from '@/utils/helper';
import { notifyError } from '@/utils/notify';

const GoogleLoginButton = () => {
    const onSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;
        const response = await verifyGoogleToken({ token });
        if (response.success) {
            afterSucessfullLogin(response.data.token);
        } else {
            notifyError("Login failed: " + response.message);
        }       
    };

    const onError = (error) => {
        notifyError("Login failed.");
    };
    return (
        <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
        />
    )
}

export default GoogleLoginButton
