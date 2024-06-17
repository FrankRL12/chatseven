import axios from 'axios';

const whatsappApi = axios.create({
    baseURL: 'https://seven-brains.com/api/whatsapp-integration-service/client-api/v1/webhook/event'
});

export const url = "https://seven-brains.com/api/whatsapp-integration-service/client-api/v1/webhook/event?dateFrom=2024-05-01&dateTo=2024-06-14&from=0&size=3000";

export const getAllMesajes = () => {
    const params = {
        dateFrom: '2024-05-01',
        dateTo: '2024-06-14',
        from: 0,
        size: 3000
    };

    return whatsappApi.get('', { params });
};





