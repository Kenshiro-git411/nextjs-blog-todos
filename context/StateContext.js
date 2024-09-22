import { createContext, useState } from "react";

export const StateContext = createContext();

export default function StateContextProvider(props){
    // useStateを使って、selectedTaskという状態を定義している。初期値は{ id: 0, title: "" }になっている。
    // setSelectedTaskはselectedTaskの値を更新するための関数。
    const [selectedTask, setSelectedTask] = useState({ id: 0, title: "" });
    return(
        // StateContext.Providerを使用して、子コンポーネントにselectedTaskとsetSelectedTaskを渡す。
        <StateContext.Provider
            value={{
                selectedTask,
                setSelectedTask,
            }}
        >
            {/* {props.children}の部分は、StateContextProviderコンポーネントの子要素を表示する。これにより、このプロバイダー内にラップされたすべてのコンポーネントが、コンテキストにアクセスできるようになる。 */}
            {props.children}
        </StateContext.Provider>
    );
}