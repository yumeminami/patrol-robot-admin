import request from '@/utils/request'
import service from '../utils/request'

export async function taskList(data) {
    try {
        console.log(data)
        const { pageNumber, pageSize, name, status, type } = data;
        const response = await service.get('/tasks');
        let list = response.data;
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

export async function addItem(data) {
    try {
        const response = await service.post(`/tasks`, data);
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
        const response = await service.put(`/tasks/${data.id}`, data)
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
