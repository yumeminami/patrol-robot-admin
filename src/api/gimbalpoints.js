import request from '@/utils/request'
import service from '../utils/request'

export async function gimbalpointList(data) {
    try {
        console.log(data)
        const { pageNumber, pageSize, name, type, all } = data;
        const response = await service.get('/gimbalpoints');
        let list = response.data;
        let total = response.data.length
        let start = (pageNumber - 1) * pageSize;
        let end = pageNumber * pageSize;
        let mockList = list.filter((item) => {
            if (name && item.name.indexOf(name) < 0) return false;
            if (type !== undefined) {
                if (type === 0 && item.type !== 0) return false;
                if (type !== 0 && item.type !== type) return false;
            }
            return true;
        });
        let pageList =
            all ? mockList :
                mockList.slice(start, end);
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
        const response = await service.delete(`/gimbalpoints/${data.id}`);
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
        const response = await service.put(`/gimbalpoints/${data.id}`, data)
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
