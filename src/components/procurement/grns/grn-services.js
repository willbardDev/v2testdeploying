import axios from "@/lib/services/config";

const grnServices = {};

grnServices.getGrnsList = async ({queryKey}) => {
    const {page, limit, queryParams} = queryKey[queryKey.length - 1];
    const {data} = await axios.get(`stores/${queryParams.store_id}/grns`, {
        params: {
            page: page,
            limit: limit,
            ...queryParams
        }
    });
    return data;
};

grnServices.grnValues = async(params) => {
    const {data} = await axios.get('grn-values',{ params});
    return data
}

grnServices.grnDetails = async (id) => {
    const {data} = await axios.get(`grns/${id}`);
    return data;
}

export default grnServices;