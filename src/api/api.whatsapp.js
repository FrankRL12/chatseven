import axios from 'axios';

const whatsappApi = axios.create({
    baseURL: 'https://seven-brains.com/api/whatsapp-integration-service/client-api/v1/webhook/event'
});

export const url = "https://seven-brains.com/api/whatsapp-integration-service/client-api/v1/webhook/event?dateFrom=2024-05-01&dateTo=2024-06-19&from=0&size=3400";

export const getAllMesajes = () => {
    const params = {
        dateFrom: '2024-05-01',
        dateTo: '2024-06-19',
        from: 0,
        size: 3400
    };

    return whatsappApi.get('', { params });
};





