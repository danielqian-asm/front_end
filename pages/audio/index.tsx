import React, { useState } from "react";
import type { NextPage } from "next";
import { CloudUploadOutlined } from "@ant-design/icons";
import path from "path";
import Image from "next/image"
import fs from "fs";
import {
  Layout,
  Button,
  Row,
  Col,
  Form,
  Input,
  Slider,
  Tag,
  Spin,
  Select,
  Tooltip,
  Progress
} from "antd";
import styles from "./styles.module.css";
import { generateAudio, checkAudioExist } from "../../utils/useRequest";
import cx from "classnames";

const { TextArea } = Input;
const { Sider, Content } = Layout;

interface IProps {
}
// # n_samples_per_class = 1

// ddim_steps = 50
// # ddim_eta = 0.0
// n_batch = 10 # 1 ~ 10
// f = 3 # 1 ~ 10  1 = 5s
const Home: NextPage<IProps> = (props) => {
  const [processing, setProcessing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
//   const [imageUrls, setImageUrls] = useState<string[]>(["/point.png"]);
  const [audioList, setAudioList] = useState<string[]>([]);
  
  const [value, setValue] = useState({
    batch: 4,
    step: 50,
    audio_num: 1,
    f: 1,
  });

//   const checkLoop = async (id: string, audio_num: number) => {
//     const { response, error } = await checkAudioExist(id, audio_num);
//     const isGenerating = response?.data.find((i: any) => i.isExist === false);
//     if (isGenerating) {
//       setTimeout(() => {
//         checkLoop(id, audio_num);
//       }, 5000);
//     } else {
//       setImageUrls(response?.data.map((i: any) => i.url));
//       setIsEmpty(false);
//       setProcessing(false);
//     }
//   };
  const onSubmit = async () => {
    setProcessing(true);
    setAudioList([])
    const audio_id = new Date().valueOf() + "";
    // @ts-ignore
    const { data } = await generateAudio({
        n_batch: value.batch,
        ddim_steps: value.step,
        audio_num: value.audio_num,
        f: value.f,
        audio_id
    });
    console.log(11, data)
    // @ts-ignore
    setAudioList(data)
    setProcessing(false);
    // checkLoop(audio_id, value.audio_num);
  };

  const isShowMultiple = processing === false && audioList.length > 1;
  const playOneAudio = (id: number) => {
    audioList.forEach((i, index) => {
      if (index === id) return
      const player = document.getElementById(`audioId_${index}`)
      // @ts-ignore
      player.pause()
    })
  }
//   n_samples_per_class = 1
//   ddim_steps = 50
//   ddim_eta = 0.0
//   f = 3

// ddim_steps = 50
// n_batch = 10 # 1 ~ 10
// f = 3 # 1 ~ 10  1 = 5s
  return (

        <>
          <Sider width={300} className={styles.leftMenu}>
            <Form onFinish={onSubmit} layout="vertical">
              <Form.Item
                label={
                  <Row>
                    <Col span={18}>Batch</Col>
                    <Col span={6} className={styles.tr}>
                      <Tag color="default">{value.batch}</Tag>
                    </Col>
                  </Row>
                }
                name="batch"
              >
                <div className={styles.subTitle}>
                Audio Number
                </div>
                <Slider
                  min={1}
                  max={10}
                  disabled={processing}
                  tooltip={{ open: false }}
                  value={value.batch}
                  onChange={(v) => {
                    setValue({
                      ...value,
                      batch: v,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label={
                  <Row>
                    <Col span={18}>Steps</Col>
                    <Col span={6} className={styles.tr}>
                      <Tag color="default">{value.step}</Tag>
                    </Col>
                  </Row>
                }
                name="steps"
              >
                <div className={styles.subTitle}>
                  How many steps to spend generating (diffusing) your audio.
                </div>
                <Slider
                  min={20}
                  max={150}
                  step={10}
                  disabled={processing}
                  tooltip={{ open: false }}
                  value={value.step}
                  onChange={(v) => {
                    setValue({
                      ...value,
                      step: v,
                    });
                  }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Row>
                    <Col span={18}>Length</Col>
                    <Col span={6} className={styles.tr}>
                      <Tag color="default">{value.f}</Tag>
                    </Col>
                  </Row>
                }
                name="steps"
              >
                <div className={styles.subTitle}>
                  Every length means 5s.
                </div>
                <Slider
                  min={1}
                  max={10}
                  disabled={processing}
                  tooltip={{ open: false }}
                  value={value.f}
                  onChange={(v) => {
                    setValue({
                      ...value,
                      f: v,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="Text Prompt (in development)" name="prompt">
                <TextArea
                  disabled={processing}
                  onChange={(e) => {}}
                  autoSize={{ minRows: 2, maxRows: 10 }}
                />
              </Form.Item>
              <Form.Item label="Genre (in development)" name="genre">
                <TextArea
                  disabled={processing}
                  onChange={(e) => {}}
                  autoSize={{ minRows: 2, maxRows: 10 }}
                />
              </Form.Item>
              {/* <Row>
                <Col span={18}>
                <h4 className={styles.sliderLabel}>
                Audio Number
                </h4></Col>
                <Col span={6} className={styles.tr}>
                  <Tag color="default">{value.audio_num}</Tag>
                </Col>
              </Row>
              <Slider
                min={1}
                max={4}
                step={1}
                disabled={processing}
                tooltip={{ open: false }}
                value={value.audio_num}
                onChange={(v) => {
                  setValue({
                    ...value,
                    audio_num: v,
                  });
                }}
              /> */}
              <Form.Item>
                <Button
                  loading={processing}
                  disabled={processing}
                  block
                  htmlType={"submit"}
                  size={"large"}
                  type="primary"
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Sider>
          <Layout className={styles.container}>
            <Content>
              <div className={styles.mainArea}>
                <div
                  className={cx({
                    // [styles.imgMultipleContainer]: isShowMultiple,
                    [styles.imgContainer]: true,
                    [styles.audioContainer]: true,
                  })}
                >
                  {/* <Button onClick={() => {
                    setProcessing(true)
                  }}>start test progress</Button>
                  <Button onClick={() => {
                    setProcessing(false)
                  }}>Reset</Button> */}
                  <div
                    className={cx({ [styles.imgBg]: true, [styles.loading]: processing })}
                  >
                  <Spin spinning={processing}>
                      {audioList.length > 0 && audioList.map((i, index) => <div key={index} className={styles.audioBox}>
                        <audio controls id={`audioId_${index}`}  onPlay={() => playOneAudio(index)}>
                          <source src={`audio/${i}`} type="audio/wav" />
                          Your browser does not support the audio element.
                      </audio>
                      </div>)}
                  </Spin>
                  </div>
                </div>
              </div>
            </Content>
          </Layout>
        </>

  );
};

export default Home;
