import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import {
  message,
  Upload,
  Spin,
  Modal,
  Button,
  Input,
  Form,
  InputNumber,
} from "antd";
import { listenerCount } from "process";
import React, { useState } from "react";

const { Dragger } = Upload;

interface IProps {
  onClose: () => void;
}

export const UploadImg: React.FC<IProps> = ({ onClose }) => {
  const [processing, setProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");
  const [moduleStep, setModuleStep] = useState(100);
  const [id, setId] = useState(new Date().valueOf() + "");
  const props: UploadProps = {
    name: "photo",
    multiple: true,
    action: `http://129.146.100.107:5001/upload?id=${id}`,
    progress: {
      strokeWidth: 3,
    },
    beforeUpload: () => {
      if (!processing) {
        setProcessing(true);
      }
    },
    onChange(info) {
      if (!processing) setProcessing(true);
      const { status } = info.file;
      if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
      const isUpdaging = info.fileList.find(
        (item) => item.status === "uploading"
      );
      if (!isUpdaging) {
        message.success(`files uploaded successfully.`);
        setProcessing(false);
        setShowConfirmModal(true);
      }
    },
    itemRender() {
      return null;
    },
  };

  return (
    <>
      <Modal
        title="Create new StyleFilter"
        open={true}
        centered={true}
        onCancel={onClose}
        footer={[]}
      >
        <Dragger {...props}>
          <Spin spinning={processing}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Spin>
        </Dragger>
      </Modal>
      <Modal
        title="Please type in module name"
        open={showConfirmModal}
        centered={true}
        width={400}
        closable={false}
        footer={[
          <Button
            key={"create"}
            disabled={!moduleName || !moduleDesc}
            type={"primary"}
            onClick={async () => {
              await fetch(`/api/train?id=${id}&name=${moduleName}&steps=${moduleStep}&desc=${moduleDesc}`);
              message.success(`Please wait.`);
              onClose();
            }}
          >
            Create
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          layout="horizontal"
        >
          <Form.Item label="Name">
            <Input
              onChange={(e) => {
                setModuleName(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Steps">
            <InputNumber
              defaultValue={moduleStep}
              min={20}
              max={1000}
              step={10}
              onChange={(v: number | null) => {
                setModuleStep(v ?? 20);
              }}
            />
          </Form.Item>
          <Form.Item label="Describe">
            <Input
              onChange={(e) => {
                setModuleDesc(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
