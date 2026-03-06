"use client";

import { Modal, message } from "antd";

export const notifySuccess = (content: string) => {
  message.success(content);
};

export const notifyError = (content: string) => {
  message.error(content);
};

export const confirmAction = ({
  title,
  content,
  okText = "Confirm",
  cancelText = "Cancel",
}: {
  title: string;
  content?: string;
  okText?: string;
  cancelText?: string;
}) =>
  new Promise<boolean>((resolve) => {
    Modal.confirm({
      title,
      content,
      centered: true,
      okText,
      cancelText,
      okButtonProps: {
        style: {
          backgroundColor: "#3C50E0",
          borderColor: "#3C50E0",
          color: "#FFFFFF",
        },
      },
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
