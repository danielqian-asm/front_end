import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { CloudUploadOutlined } from "@ant-design/icons";
// import ArcProgress from 'react-arc-progress';
import ArcProgress from "../../components/Progress/index";
import path from "path";
import Image from "next/image";
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
  Progress,
} from "antd";
import styles from "../../styles/Home.module.css";
import { generate, checkExist } from "../../utils/useRequest";
import { UploadImg } from "../../components/upload/index";
import cx from "classnames";

const { Header: AntdHeader, Sider, Content } = Layout;
const { TextArea } = Input;
const aspectRatio = (w: number, h: number) => {
  return `${w} / ${h}`;
};
const widthAndHeight = (v: number) => {
  return 64 * v;
};

const animationTime = (step: number, imagesNum: number, size: number) => {
  console.log(step, imagesNum, size);
  let baseTime = 3000 / (512 * 512) / 50;
  const time =
    Math.round(baseTime * (size + (size - 512 * 512) * 1.2) * step) * imagesNum;
  console.log(time);
  return time + 2000;
};

interface IProps {
  modulesConfig: Array<any>;
}

const Home: NextPage<IProps> = (props) => {
  const { modulesConfig } = props;
  const [processing, setProcessing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [percent, setPercent] = useState<number>(0);
  const [imageUrls, setImageUrls] = useState<string[]>(["/point.png"]);
  const [value, setValue] = useState({
    width: 8,
    height: 8,
    step: 50,
    imageNumber: 1,
    weights: [
      {
        id: modulesConfig[0].id,
        value: 60,
      },
    ],
    promptWeights: 10,
    prompt: "8K, very detailed",
  });

  const checkLoop = async (id: string, imageNumber: number) => {
    const { response, error } = await checkExist(id, imageNumber);
    const isGenerating = response?.data.find((i: any) => i.isExist === false);
    if (isGenerating) {
      setTimeout(() => {
        checkLoop(id, imageNumber);
      }, 5000);
    } else {
      setImageUrls(response?.data.map((i: any) => i.url));
      setIsEmpty(false);
      setProcessing(false);
    }
  };
  const onSubmit = async () => {
    setProcessing(true);
    const prompt = value.prompt.trim().replace(/\n/g, "");
    const imagesId = new Date().valueOf() + "";
    const weightsList = {} as { [key: string]: string | number };
    let totalWeights = value.promptWeights;
    let restWeights = 100;
    value.weights.forEach((i, index) => {
      totalWeights += i.value;
      weightsList[`c${index}_weights`] = i.value;
      weightsList[`c${index}_id`] = i.id;
    });
    value.weights.forEach((i, index) => {
      const weights = Math.round((i.value / totalWeights) * 100);
      weightsList[`c${index}_weights`] = weights;
      restWeights -= weights;
    });
    await generate({
      ...value,
      ...weightsList,
      height: widthAndHeight(value.height),
      width: widthAndHeight(value.width),
      prompt,
      promptWeights: restWeights,
      imagesId,
    });
    checkLoop(imagesId, value.imageNumber);
  };

  const isShowMultiple = processing === false && imageUrls.length > 1;

  return (
    <>
      <Sider width={300} className={styles.leftMenu}>
        <Form onFinish={onSubmit} layout="vertical">
          <Form.Item
            label={
              <Row>
                <Col span={18}>Width</Col>
                <Col span={6} className={styles.tr}>
                  <Tag color="default">{widthAndHeight(value.width)}</Tag>
                  {/* <Input disabled size={'small'} value={widthAndHeight(value.width)} /> */}
                </Col>
              </Row>
            }
            name="width"
          >
            <div className={styles.subTitle}>
              The width of the generated image.
            </div>
            <Slider
              min={8}
              max={16}
              disabled={processing}
              tooltip={{ open: false }}
              value={value.width}
              onChange={(v) => {
                setValue({
                  ...value,
                  width: v,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            label={
              <Row>
                <Col span={18}>Height</Col>
                <Col span={6} className={styles.tr}>
                  <Tag color="default">{widthAndHeight(value.height)}</Tag>
                </Col>
              </Row>
            }
            name="height"
          >
            <div className={styles.subTitle}>
              The height of the generated image.
            </div>
            <Slider
              min={8}
              max={16}
              disabled={processing}
              tooltip={{ open: false }}
              value={value.height}
              onChange={(v) => {
                setValue({
                  ...value,
                  height: v,
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
              How many steps to spend generating (diffusing) your image.
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
                <Col span={18}>StyleFilter</Col>
                <Col span={6} className={styles.tr}>
                  <Button
                    size={"small"}
                    type="primary"
                    shape="circle"
                    icon={<CloudUploadOutlined />}
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  />
                </Col>
              </Row>
            }
            name="module"
          >
            <Select
              mode="multiple"
              placeholder="Please select"
              defaultValue={value.weights.map((i) => i.id)}
              value={value.weights.map((i) => i.id)}
              onChange={(v) => {
                v.length <= 3 &&
                  setValue({
                    ...value,
                    weights: v.map((id: string) => {
                      const t = value.weights.find((w) => w.id === id);
                      if (t) return { id, value: t.value };
                      else return { id, value: 50 };
                    }),
                  });
              }}
              style={{ width: "100%" }}
            >
              {modulesConfig.map((i) => (
                <Select.Option
                  key={i.id}
                  value={i.id}
                  disabled={
                    value.weights.length >= 3 &&
                    !value.weights.find(({ id }) => id === i.id)
                  }
                >
                  <Tooltip
                    placement="top"
                    title={
                      <Image
                        src={`/stylefilter/${i.id}/2.png`}
                        height={200}
                        width={200}
                      />
                    }
                  >
                    <div className={styles.selectOption}>{`${i.name}${
                      !i.isReady ? "(training)" : ""
                    }`}</div>
                  </Tooltip>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {value.weights.map((i) => (
            <div key={i.id}>
              <h4 className={styles.sliderLabel}>
                {modulesConfig.find((m) => m.id === i.id).name} Weights
              </h4>
              <Slider
                min={0}
                max={100}
                step={10}
                disabled={processing}
                // tooltip={{ open: true }}
                value={i.value}
                onChange={(v) => {
                  setValue({
                    ...value,
                    weights: value.weights.map((w) => {
                      return {
                        id: w.id,
                        value: i.id === w.id ? v : w.value,
                      };
                    }),
                  });
                }}
              />
            </div>
          ))}

          <div>
            <h4 className={styles.sliderLabel}>Prompt Weights</h4>
            <Slider
              min={0}
              max={100}
              step={10}
              disabled={processing}
              value={value.promptWeights}
              onChange={(v) => {
                setValue({
                  ...value,
                  promptWeights: v,
                });
              }}
            />
          </div>
          <Form.Item label="Prompt" name="prompt">
            <TextArea
              // value={value}
              // onChange={e => setValue(e.target.value)}
              // placeholder="Controlled autosize"
              disabled={processing}
              onChange={(e) => {
                setValue({
                  ...value,
                  prompt: e.target.value,
                });
              }}
              defaultValue={value.prompt}
              autoSize={{ minRows: 9, maxRows: 10 }}
            />
          </Form.Item>
          <Row>
            <Col span={18}>
              <h4 className={styles.sliderLabel}>Image Number</h4>
            </Col>
            <Col span={6} className={styles.tr}>
              <Tag color="default">{value.imageNumber}</Tag>
            </Col>
          </Row>
          <Slider
            min={1}
            max={4}
            step={1}
            disabled={processing}
            tooltip={{ open: false }}
            value={value.imageNumber}
            onChange={(v) => {
              setValue({
                ...value,
                imageNumber: v,
              });
            }}
          />
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
                [styles.imgMultipleContainer]: isShowMultiple,
                [styles.imgContainer]: !isShowMultiple,
              })}
            >
              {processing && (
                <ArcProgress
                  className={styles.progress}
                  size={100}
                  arcStart={-90}
                  arcEnd={270}
                  fillColor={"#1677ff"}
                  progress={1}
                  thickness={8}
                  speed={-100}
                  animation={animationTime(
                    value.step,
                    value.imageNumber,
                    widthAndHeight(value.width) * widthAndHeight(value.height)
                  )}
                />
              )}

              {/* <Button onClick={() => {
                    setProcessing(true)
                  }}>start test progress</Button>
                  <Button onClick={() => {
                    setProcessing(false)
                  }}>Reset</Button> */}
              <div
                className={cx({
                  [styles.imgBg]: true,
                  [styles.loading]: processing,
                })}
                style={{
                  width: widthAndHeight(value.width),
                  aspectRatio: aspectRatio(value.width, value.height),
                  height: widthAndHeight(value.height),
                }}
              >
                {isShowMultiple &&
                  imageUrls.map((i: string) => (
                    <Image
                      src={i}
                      key={i}
                      className={cx({
                        [styles.preview]: true,
                        [styles.opacity]: isEmpty,
                      })}
                      width={widthAndHeight(value.width)}
                      height={widthAndHeight(value.height)}
                      style={{
                        aspectRatio: aspectRatio(value.width, value.height),
                      }}
                    />
                  ))}
                {!isShowMultiple && (
                  <Image
                    src={processing ? "/point.png" : imageUrls[0]}
                    className={cx({
                      [styles.preview]: true,
                      [styles.opacity]: isEmpty,
                    })}
                    width={widthAndHeight(value.width)}
                    height={widthAndHeight(value.height)}
                    style={{
                      aspectRatio: aspectRatio(value.width, value.height),
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </Content>
      </Layout>
      {isModalOpen && (
        <UploadImg
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export const getServerSideProps = async () => {
  const modulesPath = path.join(
    process.env.BASE_PATH || "",
    `/utils/modules.json`
  );
  const modulesConfig = await fs.readFileSync(modulesPath, "utf8");
  // const modulesList = await fs.readdirSync(process.env.STYLEFILTER_PATH || "");
  const modulesList = [] as any;
  const modulesConfigJson = JSON.parse(modulesConfig).map((i: any) => {
    if (modulesList.includes(i.id)) i.isReady = true;
    else i.isReady = false;
    return i;
  });
  return {
    props: {
      modulesConfig: modulesConfigJson,
    },
  };
};

export default Home;
