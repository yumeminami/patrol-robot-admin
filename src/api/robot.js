import service from '../utils/request'


export async function robotList(data) {
    try {
        console.log(data)
        const { pageNumber, pageSize, } = data;
        const response = await service.get('/robots');
        let list = response.data;
        let total = response.data.length
        let start = (pageNumber - 1) * pageSize;
        let end = pageNumber * pageSize;
        let mockList = list.filter((item) => {
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
