import axios from 'axios';

export default {
    get: async () => {
        let res = await axios.get(`/api/sales`);
        return res.data.results || [];
    },
};