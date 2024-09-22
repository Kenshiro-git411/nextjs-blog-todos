import { useEffect } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getAllTaskIds, getTaskData } from "../../lib/tasks";

const fetcher = (url) => fetch(url).then((res) => res.json());

//getStaticProps関数のreturnにあるものを引数として受け取って(propsとして受け取る)処理を行う
export default function Post({ staticTask, id }){
    const router = useRouter();
    //クライアント側の処理
    const { data: task, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-task/${id}`,
        fetcher,
        {
            fallbackData: staticTask,
        }
    );
    //個別ページがマウントされたときに確実にキャッシュが最新化されるようにuseEffectを使用する。
    useEffect(() => {
        mutate();
    }, []);
    //isFallbackがtrueの時、またはタスクが存在しない時、Loadingを出力させる。
    if(router.isFallback || !task) {
        return <div>Loading...</div>
    }
    return (
        <Layout title={task.title}>
            <span>
                {"ID:"}
                {task.id}
            </span>
            <p className="mb-4 text-xl font-bold">{task.title}</p>
            {/* 作成された日時 */}
            <p className="mb-12">{task.created_at}</p>
            {/* 個別のページから一覧ページへ戻るためのリンク */}
            <Link href="/task-page">
                <div className="flex cursor-pointer mt-8">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                    </svg>
                    <span>Back to task-page</span>
                </div>
            </Link>
        </Layout>
    )
}

//build時にサーバーサイドで実行される
export async function getStaticPaths(){
    const paths = await getAllTaskIds(); //getAllTaskIdsはtasks.jsに入っているライブラリ関数

    return{
        paths,
        fallback:true,
    };
}

export async function getStaticProps({ params }){
    //idに基づいて特定のタスクデータを取得してくる。
    //→取得したデータのオブジェクトはstaticTaskに格納される。
    const{ task:staticTask } = await getTaskData(params.id);
    return {
        props: {
            id: staticTask.id,
            staticTask,
        },
        revalidate: 3, //Incremental Static Regeneration機能を有効化させる
    }
}