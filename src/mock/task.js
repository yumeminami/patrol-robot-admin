import Mock from "mockjs";
import axios from "axios";
import service from "../utils/request";
let List = [];
const count = 100;


// for (let i = 0; i < count; i++) {
//     List.push(
//         Mock.mock({
//             id: i,
//             name: "@cname",
//             status: "@integer(0, 3)",
//             type: "@integer(1, 2)",
//             robot_id: "@integer(1, 100)",
//         })
//     );
// }

async function taskList() {
    service.get('/tasks',)
        .then(response => {
            List = response.data;
            return true;
        })
        .catch(error => {
            console.log(error);
            return false;
        })
}

function addItem(data) {
    service.post('/tasks', data)
        .then(response => {
            console.log(response.data);
            return true;
        })
        .catch(error => {
            console.log(error);
            return false;
        })
}

function editItem(id, data) {
    service.put(`/tasks/${id}`, data)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        })
}

function deleteItem(id) {
    try {
        const response = service.delete(`/tasks/${id}`);
        // console.log(response.data);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}



export default {
    taskList: (config) => {
        const { pageNumber, pageSize, name, status, type } = JSON.parse(
            config.body
        );
        let start = (pageNumber - 1) * pageSize;
        let end = pageNumber * pageSize;
        let mockList = List.filter((item) => {
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
            code: 20000,
            data: {
                total: mockList.length,
                items: pageList,
            },
        };
    },
    deleteItem: (config) => {
        const { id } = JSON.parse(config.body);
        if (!deleteItem(id)) {
            return {
                code: 50000,
                message: "删除失败",
            }
        }
        const item = List.filter((item) => item.id === id);
        const index = List.indexOf(item[0]);
        List.splice(index, 1);
        return {
            code: 20000,
        };
    },
    editItem: async (config) => {
        const data = JSON.parse(config.body);
        const { id } = data;
        // service.put(`/tasks/${id}`, data)
        //     .then(response => {
        //         console.log(response.data);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     })

        // const item = List.filter((item) => item.id === id);
        // const index = List.indexOf(item[0]);
        // List.splice(index, 1, data);
        return service.put(`/tasks/${id}`, data)
            .then(response => {
                console.log(response.data);
                const item = List.filter((item) => item.id === id);
                const index = List.indexOf(item[0]);
                List.splice(index, 1, response.data);
                return {
                    code: 20000,
                }
            })
            .catch(error => {
                console.log(error);
                return {
                    code: 50000,
                    message: "修改失败",
                }
            })


    },
    // editItem: async (config) => {
    //     try {
    //         const data = JSON.parse(config.body);
    //         const { id } = data;
    //         const response = await service.put(`/tasks/${id}`, data);

    //         console.log(response.data);

    //         const item = List.find((item) => item.id === id);
    //         if (item) {
    //             const index = List.indexOf(item);
    //             List.splice(index, 1, response.data);
    //         }

    //         return {
    //             code: 20000,
    //         };
    //     } catch (error) {
    //         console.log(error);
    //         return {
    //             code: 50000,
    //             message: "修改失败",
    //         };
    //     }
    // },

    addItem: (config) => {
        const data = JSON.parse(config.body);
        List.push(data);
        return {
            code: 20000,
        };
    },
};
