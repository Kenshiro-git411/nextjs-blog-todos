import { LockClosedIcon } from '@heroicons/react/solid';
import { useState } from "react";
import { useRouter } from "next/router";
import Cookie from "universal-cookie";

const cookie = new Cookie();


export default function Auth() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    // ログインが呼び出された場合の処理
    const login = async () => {
        // 例外処理を含めて、処理を行うようにする。
        // 例外処理が発生しなかった場合
        try {
            await fetch(
                // env.localに書かれたパスにapi/auth/jwt/create/をつなげたurlでアクセスし、endポイントにアクセスし、bodyの内容などを受け取っている。
                `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/auth/jwt/create/`,
                {
                method: "POST",
                body: JSON.stringify({ username: username, password: password }),
                headers: {
                    "Content-Type": "application/json",
                },
                }
            )
            // fetchの結果をresに格納される。
            .then((res) => {
            // 認証に失敗した場合
            if (res.status === 400) {
                throw "authentication failed";
            // 認証に成功した場合
            } else if (res.ok) {
                return res.json(); //resをjsonオブジェクトに変換してreturnする。
            }
            })
            // アクセストークンをcookieに設定していく
            .then((data) => {
            const options = { path: "/" };
            cookie.set("access_token", data.access, options);
            });
            // 上記の処理が成功した場合、main-pageに遷移する
            router.push("/main-page");
        // 例外が発生した場合、アラートでメッセージを出力するようにする。
        } catch (err) {
            alert(err);
        }
    };

    // return内のフォームでsubmitボタンが押された場合の処理
    const authUser = async (e) => {
        // リロードを防ぐ
        e.preventDefault();
        // ログインを行う場合
        if (isLogin) {
            login();
        // 新規ユーザー登録する場合
        } else {
            // 例外処理を行うようにする
            try {
                // 新規登録の場合、registerにアクセスする
                await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/register/`, {
                method: "POST",
                body: JSON.stringify({ username: username, password: password }),
                headers: {
                    "Content-Type": "application/json",
                },
                // 新規登録に失敗した場合
                }).then((res) => {
                if (res.status === 400) {
                    throw "authentication failed";
                }
                });
                // 新規登録に成功した場合
                login();
            } catch (err) {
            alert(err);
            }
        }
    };

    return (
        <div>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Your Company" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" className="mx-auto h-10 w-auto"/>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                {isLogin ? "Login" : "Sign up"}
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={authUser} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                            Username
                        </label>
                        <div className="mt-2">
                            <input name="username" type="text" required autoComplete="username" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={username} onChange={(e) => {
                                setUsername(e.target.value);
                            }}/>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                                Password
                            </label>
                            <div className="text-sm">
                                {/* isloginの状態を反転させた状態で更新するようにする */}
                                <span onClick={() => setIsLogin(!isLogin)} className="cursor-pointer font-semibold text-white hover:text-indigo-500">
                                    Change Mode?
                                </span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input name="password" type="password" required autoComplete="current-password" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={password} onChange={(e) => {
                                setPassword(e.target.value);
                            }}/>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            {isLogin ? "Login with JWT" : "Create new user"}
                        </button>
                    </div>
                </form>
                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Start a 14 day free trial
                    </a>
                </p>
            </div>
        </div>
    );
}
