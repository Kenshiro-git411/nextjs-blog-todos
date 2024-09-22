import { useContext } from "react";
import { StateContext } from "../context/StateContext";
import Cookie from "universal-cookie";

const cookie = new Cookie();

export default function TaskForm({ taskCreated }){
    const { selectedTask, setSelectedTask } = useContext(StateContext);

    // タスクを新規で作成するときに呼び出される関数
    const create = async (e) => {
        // フォームの送信イベントを防止します。これにより、ページがリロードされるのを防ぎ、非同期処理を続行できる。
        e.preventDefault();
        await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/tasks/`, {
            method: "POST",
            body: JSON.stringify({ title: selectedTask.title }),
            headers: {
                "Content-Type": "application/json",
                // 新規作成する場合はJWTの認証が必要（cookieからアクセストークンを取得してヘッダーに付与する。）
                Authorization: `JWT ${cookie.get("access_token")}`,
            },
        }).then((res) => {
            if (res.status === 401) {
              alert("JWT Token not valid");
            }
        });
        setSelectedTask({ id: 0, title: "" });
        taskCreated();
    }

    // タスクを更新するときに呼び出される関数
    const update = async (e) => {
        e.preventDefault();
        // fetch関数を使って、指定されたURLに対してPUTリクエストを送信する。
        await fetch(
            `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/tasks/${selectedTask.id}/`,
            {
                method: "PUT",
                body: JSON.stringify({ title: selectedTask.title }),
                headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${cookie.get("access_token")}`,
                },
            }
        ).then((res) => {
            if (res.status === 401) {
                alert("JWT Token not valid");
            }
        });
        setSelectedTask({ id: 0, title: "" });//更新処理が完了した後、selectedTaskの状態を初期値にリセットする。
        taskCreated();
    };
    return (
        <div>
            <form onSubmit={selectedTask.id !== 0 ? update : create}>
                <input className="text-black mb-8 px-2 py-1" type="text" value={selectedTask.title} onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}/>
                <button type="submit" className="bg-gray-500 ml-2 hover:bg-gray-600 text-sm px-2 py-1 rounded uppercase" >
                    {selectedTask.id !== 0 ? "update" : "create"}
                </button>
            </form>
        </div>
    )
}

