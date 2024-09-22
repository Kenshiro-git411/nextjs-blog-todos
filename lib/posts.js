// node-fetchを使用するには、npm install node-fetchでnode-fetchをインストールする必要がある。
import fetch from "node-fetch";

export async function getAllPostsData() {
    const res = await fetch(
        // ブログデータを取得
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-post/`)
    );
    // ブログデータをjsonフォーマットに変換
    const posts = await res.json();
    const filteredPosts = posts.sort(
        // 新しい順にデータをソートする
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return filteredPosts;
}

// idだけのデータを取得する
export async function getAllPostIds() {
    const res = await fetch(
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-post/`)
    );
    const posts = await res.json();
    return posts.map((post) => {
        return {
            params: {
            id: String(post.id),
            },
        };
    });
}

// 指定されたidにもとづいて特定のブログ記事を取得する
export async function getPostData(id) {
    const res = await fetch(
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-post/${id}/`)
    );
    const post = await res.json();
    // return {
    //   post,
    // };
    return post;
}