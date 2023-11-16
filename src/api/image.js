import service from '../utils/request'

export async function imageList(data) {
    try {
        console.log(data)
        const { pageNumber, pageSize, all, alarm } = data;
        const response = await service.get('/patrol_images');
        let list = response.data;
        let total = response.data.length
        let start = (pageNumber - 1) * pageSize;
        let end = pageNumber * pageSize;
        let mockList = list.filter((item) => {
            if (alarm !== undefined && item.alarm !== alarm) return false;
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



export async function deleteItem(data) {
    try {
        const response = await service.delete(`/patrol_images/${data.id}`);
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


