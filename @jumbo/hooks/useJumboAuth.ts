import React from "react";
import { AuthContext } from "../components/JumboAuthProvider/JumboAuthContext";

const useJumboAuth = () => {
    return React.useContext(AuthContext);
};

export default useJumboAuth;