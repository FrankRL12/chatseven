import axios from 'axios';

const whatsappApi = axios.create({
    baseURL: 'https://seven-brains.com/api/whatsapp-integration-service/client-api/v1/webhook/event'
});

export const url = "https://seven-brains.com/api/whatsapp-integration-service/client-api/v1/webhook/event?dateFrom=2024-05-01&dateTo=2024-06-20&from=0&size=3300";

export const getAllMesajes = () => {
    // Función para obtener la fecha actual en formato YYYY-MM-DD
    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes comienza desde 0
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours();

        // Si la hora actual es mayor o igual a las 18 (6 p.m.), incrementar el día
        if (hours >= 18) {
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            const nextYear = nextDay.getFullYear();
            const nextMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
            const nextDayOfMonth = String(nextDay.getDate()).padStart(2, '0');
            return `${nextYear}-${nextMonth}-${nextDayOfMonth}`;
        }

        return `${year}-${month}-${day}`;
    };

    // Función para calcular el valor de 'size' basado en días transcurridos desde una fecha de inicio
    const calculateSize = () => {
        const startDate = new Date('2024-07-12'); // Fecha de inicio
        const currentDate = new Date();
        const diffInTime = currentDate.getTime() - startDate.getTime();
        const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
        const baseSize = 4300;
        const incrementPerDay = 150; // Incremento diario
        const increment = diffInDays * incrementPerDay;

        //console.log(`Fecha de inicio: ${startDate}`);
        //console.log(`Fecha actual: ${currentDate}`);
        //console.log(`Días transcurridos: ${diffInDays}`);
        //console.log(`Incremento total: ${increment}`);

        return baseSize + increment;
    };

    const params = {
        dateFrom: '2024-05-01',
        dateTo: getCurrentDate(), // Fecha actual dinámica
        from: 0,
        size: calculateSize() // Size dinámico
    };

    //console.log(`Fecha actual (dateTo): ${params.dateTo}`);
    //console.log(`Tamaño dinámico (size): ${params.size}`);

    return whatsappApi.get('', { params });
};

// Ejemplo de uso
getAllMesajes();





