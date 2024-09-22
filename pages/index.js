// import Image from 'next/image';
import Auth from "../components/Auth";
import Layout from "../components/Layout";

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_RESTAPI_URL)
  return (
    <Layout title="Login">
      <Auth />
    </Layout>
  );
}
