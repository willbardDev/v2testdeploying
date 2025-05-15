import axios from "app/services/config";

const transactionServices = {};

transactionServices.getList =  async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get(`/accounts/${queryParams.type}`, {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

export default transactionServices;
