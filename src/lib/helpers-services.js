import axios from "./config";

const helperServices = {};

helperServices.getUsers = async () => {
  const { data } = await axios.get('users');
  return data;
}

export default helperServices;
 