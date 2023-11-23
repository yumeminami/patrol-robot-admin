import request from '@/utils/request'
import service from '../utils/request'


export async function alarmList(data) {
    try {
        console.log(data)
        const { pageNumber, pageSize, status, level, type } = data;
        const response = await service.get('/alarm_logs?all=true');
        let list = response.data;
        let start = (pageNumber - 1) * pageSize;
        let end = pageNumber * pageSize;
        let mockList = list.filter((item) => {
            if (type && item.type.indexOf(type) < 0) return false;
            if (status !== undefined) {
                if (status === 0 && item.status !== 0) return false;
                if (status !== 0 && item.status !== status) return false;
            }
            if (level !== undefined) {
                if (level === 0 && item.level !== 0) return false;
                if (level !== 0 && item.level !== level) return false;
            }
            return true;
        });
        let pageList = mockList.slice(start, end);
        let total = mockList.length;
        return {
            list: pageList,
            total: total,
        }
    }
    catch (error) {
        console.log(error);
        return {};
    }


}

export async function deleteItem(data) {
    try {
        const response = await service.delete(`/alarm_logs/${data.id}`);
        console.log(response.data);
        return {
            code: 200,
        }
    }
    catch (error) {
        console.log(error);
        return {
            code: 400,
        };
    }
}

export async function editItem(data) {
    try {
        const response = await service.put(`/alarm_logs/${data.id}`, { status: data.status })
        console.log(response.data)
        return {
            code: 200,
        }
    }
    catch (error) {
        console.log(error)
        return {
            code: 400
        }
    }
}
