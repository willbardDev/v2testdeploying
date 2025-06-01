const { default: axios } = require("app/services/config");

const filesShelfServices = {};

filesShelfServices.getList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get("/files-shelf", {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

export default filesShelfServices;