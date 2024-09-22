import { useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { getAllTasksData } from "../lib/tasks";
import Task from "../components/Task";
import useSWR from "swr";
import StateContextProvider from "../context/StateContext";
import TaskForm from "../components/TaskForm";


const fetcher = (url) => fetch(url).then((res) => res.json());

// apiUrl: データを取得するためのAPIのURLです。
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task`;

// staticfilterdTasksはpropsであり、このコンポーネントに渡すことができ、一覧データが取得できるstaticfilterdTasksを渡している。
export default function TaskPage({ staticfilterdTasks }) {

    // useSWRは、ユーザーがページにフォーカスした時やページ遷移した場合にサーバーサイドから最新情報を取得更新してくれます。
    const { data: tasks, mutate} = useSWR(apiUrl, fetcher, {
        //オブジェクトの分割代入を使用している。dataプロパティをtasksという名前で使っている。取得したデータをtasksとして使用可能になる。mutate関数も同時に取得している。apiUrlに代入されているURLに基づいてデータがフェッチされる。fetcherはデータを取得するための関数。
        //データが取得されるとSWRはそのデータをキャッシュする。次回同じURLを指定した場合は、キャッシュされたデータがすぐに返され、バックグラウンドで新しいデータを取得する。
        //mutate関数を使用することで、キャッシュされたデータを手動で更新することができる。

        // 最初のデータ取得の際に、initialDataとして指定されたstaticfilterdTasksが使用される。
        fallbackData: staticfilterdTasks,
    });
    // タスクの新しい順に並び替える
    const filteredTasks = tasks?.sort(
        (a,b) => new Date(b.created_at) - new Date(a.created_at)
    );

    useEffect(() => {
        //mutateを行うことで、useSWRで取得できるデータのキャッシュを最新の状態にすることをしている。
        mutate();
    }, []);
    
    return(
        // StateContextProviderで囲うと、StateContext.jsの<StateContext.Provider>で囲われているものを自由に使うことができるようになる。
        <StateContextProvider>
            <Layout title="Task page">
                <TaskForm taskCreated={mutate}/>
                <ul>
                    {/* sortされたfilteredTasksが上で定義しているところから渡されており、画面に表示されるときは、ソートされた状態になっている。 */}
                    {filteredTasks &&
                        filteredTasks.map((task) => ( //mapを使うことでリストの様に表示される。
                            <Task key={task.id} task={task} taskDeleted={mutate}/>
                    ))}
                </ul>
                {/* main-pageに戻るようにする */}
                <Link href="/main-page">
                    <div className="flex cursor-pointer mt-12">
                        <svg
                            className="w-6 h-6 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                />
                        </svg>
                        <span>Back to main page</span>
                    </div>
                </Link>
            </Layout>
        </StateContextProvider>
    );
}

// ビルドした際に動く関数
export async function getStaticProps() {
    // ビルドした際にAPIのエンドポイントからタスクの一覧を取得する
    const staticfilterdTasks = await getAllTasksData();

    // propsの返却: 取得したタスクのデータ（staticfilterdTasks）をpropsとして返し、TaskPageコンポーネントに渡す（上記のTaskPage関数に渡す）。
    return{
        props:{ staticfilterdTasks },//propsとしてstaticfilterdTasksが扱われる。
        revalidate: 3,
    };
}