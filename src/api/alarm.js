import request from '@/utils/request'
import service from '../utils/request'
import Item from 'antd/lib/list/Item';

let list = []

export async function alarmList(data) {
    try {
        console.log(data)
        const { pageNumber, pageSize, name, status, level } = data;
        const response = await service.get('/alarm_logs');
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
            if (level !== undefined) {
                if (level === 0 && item.level !== 0) return false;
                if (level !== 0 && item.level !== level) return false;
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

export function addItem(data) {
    return request({
        url: '/task/add',
        method: 'post',
        data
    })
}

export async function deleteItem(data) {
    try {
        const response = await service.delete(`/tasks/${data.id}`);
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
        const response = await service.put(`/alarm_logs/${data.id}`, {status: data.status})
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
