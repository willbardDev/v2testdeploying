import React from 'react';
import {BasicAuthContext} from "../BasicAuthContext";

const useBasicAuth = () => {
    return React.useContext(BasicAuthContext);
}

export {useBasicAuth}