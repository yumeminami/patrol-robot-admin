import request from '@/utils/request'
import service from '../utils/request'


export async function taskLogList(data) {
    try {
        console.log(data)
        const { pageNumber, pageSize, name, status, type } = data;
        const response = await service.get('/task_logs?all=true');
        let list = response.data;
        let total = response.data.length
        let start = (pageNumber - 1) * pageSize;
        let end = pageNumber * pageSize;
        let mockList = list.filter((item) => {
            if (name && item.name.indexOf(name) < 0) return false;
            if (status !== undefined) {
                if (status === 0 && item.status !== 0) return false;
                if (status !== 0 && item.status !== status) return false;
            }
            if (type !== undefined) {
                if (type === 0 && item.type !== 0) return false;
                if (type !== 0 && item.type !== type) return false;
            }
            return true;
        });
        let pageList = mockList.slice(start, end);
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

export async function getItem(data) {
    try {
        const response = await service.get(`/task_logs/${data.id}`);
        console.log(response.data);
        return {
            code: 200,
            data: response.data,
        }
    }
    catch (error) {
        console.log(error);
        return {
            code: 400,
        };
    }
}

export async function deleteItem(data) {
    try {
        const response = await service.delete(`/task_logs/${data.id}`);
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
