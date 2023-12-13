import service from '../utils/request'

export async function videoList(data) {
    try {
        console.log(data)
        const { pageNumber, pageSize, all, alarm, task_log_id } = data;
        const response = await service.get('/patrol_videos?all=true');
        let list = response.data;
        let total = response.data.length
        let start = (pageNumber - 1) * pageSize;
        let end = pageNumber * pageSize;
        let mockList = list.filter((item) => {
            if (alarm != undefined && item.alarm != alarm) return false;
            if (task_log_id && item.task_log_id !== task_log_id) return false;
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
        const response = await service.delete(`/patrol_videos/${data.id}`);
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


