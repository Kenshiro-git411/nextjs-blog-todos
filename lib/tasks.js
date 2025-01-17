import fetch from "node-fetch";

export async function getAllTasksData(){
    const res = await fetch(
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`)
    );
    const tasks = await res.json();
    const staticfilterdTasks = tasks.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return staticfilterdTasks;
}

// idの一覧を取得
export async function getAllTaskIds() {
    const res = await fetch(
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`)
    );
    const tasks = await res.json();

    return tasks.map((task) => {
        return {
            params: {
            id: String(task.id),
            },
        };
    });
}
// idをもとにタスクのデータを取得する。
export async function getTaskData(id) {
    const res = await fetch(
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-task/${id}/`)
    );
    const task = await res.json();
    return {
      task,
    };
    // return task;
}