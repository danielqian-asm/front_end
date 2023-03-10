import "../styles/globals.css";
import type { AppProps } from "next/app";
import NextNprogress from "nextjs-progressbar";
import Link from "next/link";
import "antd/dist/antd.css";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Layout, Row, Col, Menu } from "antd";
import { PictureOutlined, SoundOutlined } from "@ant-design/icons";

const { Header: AntdHeader, Sider, Content } = Layout;
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>ASM</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <NextNprogress>22
    </NextNprogress> */}
      <main className={styles.main}>
        <AntdHeader className={styles.header}>
          <Row>
            <Col className={styles.logoCol} flex="250px">
              <Image
                height={40}
                width={100}
                className={styles.logo}
                src={`/logo.png`}
              />
            </Col>
            <Col flex="auto">
              <Menu
                mode="horizontal"
                className={styles.nav}
                defaultSelectedKeys={["image"]}
                theme={"dark"}
              >
                <Menu.Item key="image" icon={<PictureOutlined />}>
                  <Link href={"/index"}>Image</Link>
                </Menu.Item>
                {/* <Menu.Item key="audio" icon={<SoundOutlined />}>
                  <Link href={"/audio"}>Audio</Link>
                </Menu.Item> */}
              </Menu>
            </Col>
          </Row>
        </AntdHeader>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
    </div>
  );
}

export default MyApp;
